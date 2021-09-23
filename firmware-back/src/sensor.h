#ifndef DHTSENSOR_H
#define DHTSENSOR_H

#include <Adafruit_Sensor.h>
#include <DHT_U.h>

class DHTSensor 
{
    public:
        DHTSensor(uint8_t pin, uint8_t model);
        void begin();
        void loop();
        String getSensorType();
    
    private:
        DHT_Unified dht;
        String sensorType;
        unsigned long loopPrevious = 0;       
};

#endif