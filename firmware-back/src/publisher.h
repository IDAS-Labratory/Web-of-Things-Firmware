#ifndef PUBLISHER_H
#define PUBLISHER_H

#include <AsyncMqttClient.h>
#include "ArduinoJson.h"

class Publisher {
   
    public:
        void begin();
        void loop();
        String getBrokerAddress();
        char* getBrokerTopic();



    private:
        IPAddress BrokerHost;
        uint16_t BrokerPort;
        char* Topic;
        uint8_t Qos;

        bool MQTTReconnect = false;
        
        StaticJsonDocument<150> Payload;
        AsyncMqttClient mqttClient;
        unsigned long loopPrevious = 0;
        
        void MqttPublish();
        void MqttReconnectServer();
};

extern Publisher mqttPublisher;

#endif