
#include "AsyncJson.h"
#include "ArduinoJson.h"

#include "dashboard.h"
#include "webServer.h"
#include "configManager.h"

void dashboard::begin()
{
    server.ws.onEvent(onWsEvent);
}

void dashboard::loop()
{
    if (loopPrevious == 0 || (millis() - loopPrevious > configManager.sensorConfigData.sampleRate))
    {
        loopPrevious = millis();
        send();
    }
}

void dashboard::send()
{
    unsigned long now = millis();
    char payload[128];
    
    StaticJsonDocument<100> root;
    root["timestamp"] = now;
    root["sensorstatus"] = dash.data.sensorStatus; 
    root["networkstatus"] = dash.data.networkStatus;
    root["brokerstatus"] = dash.data.brokerStatus;
    root["temperature"] = dash.data.temperature;
    root["humidity"] = dash.data.humidity;
    serializeJson(root, payload);
    
    server.ws.textAll(payload);
}

void dashboard::onWsEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *dataIn, size_t len)
{
    /* initialize new client */
    if (type == WS_EVT_CONNECT)
    {
        Serial.println("New WS client is connected.");
    }
    else if (type == WS_EVT_DISCONNECT)
    {
        Serial.println("WS client is Disconnected");
    }
}

dashboard dash;