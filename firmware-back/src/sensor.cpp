#include "sensor.h"
#include "configManager.h"
#include "dashboard.h"

//Constructor
DHTSensor::DHTSensor(uint8_t dht_Pin, uint8_t dht_Type):dht(dht_Pin, dht_Type){}

void DHTSensor::begin()
{
    Serial.println("Sensor start to sampleing!");
    dht.begin();
    
    sensor_t sensor;
    
    dht.temperature().getSensor(&sensor);
    sensorType = sensor.name;
    Serial.print(F("Sensor Type: ")); Serial.println(sensorType);
}

void DHTSensor::loop()
{
    
  if (loopPrevious == 0 || (millis() - loopPrevious > configManager.sensorConfigData.sampleRate)){
      
      loopPrevious = millis();
      
      // Get temperature event and print its value.
      sensors_event_t eventTemp; 
      sensors_event_t eventHum;
      dht.temperature().getEvent(&eventTemp);
      dht.humidity().getEvent(&eventHum);  
    
    if (isnan(eventTemp.temperature) || isnan(eventHum.relative_humidity)) 
    {
      dash.data.sensorStatus = false;
      Serial.println(F("Error reading sensor!"));
    }  
    else 
    {  
      dash.data.sensorStatus = true;
      // Update Temperature Value
      dash.data.temperature = eventTemp.temperature;
      Serial.print(F("Temperature: "));
      Serial.print(eventTemp.temperature);
      Serial.println(F(" °C"));
      // Update Humidity Value
      dash.data.humidity = eventHum.relative_humidity;
      Serial.print(F("Humidity: "));
      Serial.print(eventHum.relative_humidity);
      Serial.println(F(" %"));
    }
  }

}

String DHTSensor::getSensorType(){
  return sensorType;
}


