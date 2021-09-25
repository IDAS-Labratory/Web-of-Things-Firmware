#include <Arduino.h>
#include "LittleFS.h"

#include "WiFiManager.h"
#include "webServer.h"
#include "updater.h"
#include "configManager.h"
#include "publisher.h"
#include "dashboard.h"
#include "sensor.h"

// Configuring DHT Sensor 
#define SensorGPIO 5  // Digital pin connected to the DHT sensor
#define SensorModel DHT11 //Type of sensor in use

//creating sensor object by constructor for initializing DHT sensor values
DHTSensor dhtsensor(SensorGPIO, SensorModel);

// Setup sub-systems
void setup() 
{   
    Serial.println(F(">> Device Firmware Start Successfully!"));
    Serial.begin(115200);
    
    // Start all sub-systems individually 
    configManager.begin();
    LittleFS.begin();
    server.begin();
    WiFiManager.begin();
    mqttPublisher.begin();
    dash.begin();
    dhtsensor.begin();   
}

// Run sub-systems
void loop() 
{
    configManager.loop();
    WiFiManager.loop();
    updater.loop();
    mqttPublisher.loop();
    dash.loop();
    dhtsensor.loop();
}
