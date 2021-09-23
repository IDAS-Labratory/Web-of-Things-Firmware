#include <AsyncMqttClient.h>

#include "publisher.h"
#include "dashboard.h"
#include "configManager.h"


void onMqttConnect(bool sessionPresent) {
  
  dash.data.brokerStatus = true;
  Serial.println("Connected to MQTT broker successfully.");
  Serial.print("Session present: ");
  Serial.println(sessionPresent);

}

void Publisher::begin(){
        String name = "\"" + String(configManager.deviceConfigData.deviceName) + "\"";
        String input = "{\"name\":" + name + ", \"timestamp\": 0, \"value\":  {\"temperature\": 0.1, \"humidity\": 0.1}}";

        DeserializationError error = deserializeJson(Payload, input);
        if (error){
            Serial.println("MQTT publisher has occurred an error in creating payload context!");
        }

        BrokerHost.fromString(String(configManager.brokerConfigData.address));
        BrokerPort = configManager.brokerConfigData.port;
        Topic = configManager.brokerConfigData.topic;
        Qos = configManager.brokerConfigData.qos;

        dash.data.brokerStatus = false;
        MQTTReconnect = true;
}

void Publisher::MqttReconnectServer(){
    //Serial.println("Connecting to MQTT broker...");
    mqttClient.onConnect(onMqttConnect);
    mqttClient.setServer(BrokerHost, BrokerPort);
    mqttClient.connect();
    
    if(mqttClient.connected()){
        MQTTReconnect = false;
    }
}

void Publisher::loop(){    
    
    //MQTT publish rate set to sensor sampling rate
    if (loopPrevious == 0 || (millis() - loopPrevious > configManager.sensorConfigData.sampleRate)){
        loopPrevious = millis();
        //Cheching Publish Request
        if(configManager.brokerConfigData.publishRequest) {
            
            //Cheching Reconnect Request
            if(MQTTReconnect) {
                MqttReconnectServer();
            }
            // if device is connected to broker, start publishing message
            if(mqttClient.connected())
            {
                Payload["timestamp"] = loopPrevious; 
                Payload["value"]["temperature"] = dash.data.temperature;
                Payload["value"]["humidity"] = dash.data.humidity; 
                MqttPublish();
            }
        }
    }
}

void Publisher::MqttPublish(){
    char localPayload[150];
    serializeJson(Payload, localPayload);

    mqttClient.publish(Topic, Qos, true, localPayload);
    Serial.println("Publishing at QoS " + String(Qos) + " on topic: " + Topic);
}

String Publisher::getBrokerAddress(){
    return BrokerHost.toString();
}

char* Publisher::getBrokerTopic(){
    return Topic;
}

Publisher mqttPublisher;