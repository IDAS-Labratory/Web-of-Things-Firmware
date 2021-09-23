#include "webServer.h"
#include "ArduinoJson.h"
#include "AsyncJson.h"
#include "LittleFS.h"

// Include the html file
#include "default/html.h"

#include "WiFiManager.h"
#include "configManager.h"
#include "updater.h"
#include "publisher.h"
#include "sensor.h"
#include "dashboard.h"


void webServer::begin()
{
    //enable testing and debugging of the interface
    DefaultHeaders::Instance().addHeader(PSTR("Access-Control-Allow-Origin"), PSTR("*"));

    server.addHandler(&ws);
    server.begin();

    server.serveStatic("/download", LittleFS, "/");

    server.onNotFound(serveProgmem);

    //handle uploads
    server.on(PSTR("/upload"), HTTP_POST, [](AsyncWebServerRequest *request) {}, handleFileUpload);

    bindAll();
}

void webServer::bindAll()
{   
    //Options index
    server.on(PSTR("/api/index"), HTTP_OPTIONS,[](AsyncWebServerRequest *request){
        request->send(200, PSTR("application/json"), "{\"status\": \"successed\", \"message\": \"WoT Device is alive!\"}");
    });

    //Update netowrk details with static address
    server.on(PSTR("/api/network/setStaticIP"), HTTP_POST, [](AsyncWebServerRequest *request) {}, NULL,
      [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total){
            
            StaticJsonDocument<96> doc;            
            DeserializationError error = deserializeJson(doc, (char*)data);
            
            if (!error) {
                request->send(200, PSTR("application/json"), "{\"status\": \"successed\",\"message\": \"message is received\"}");
                WiFiManager.setNewStaticWifi(doc["ssid"], doc["pass"], doc["ip"],doc["subnet"], doc["gateway"], doc["dns"]);
            }
            else{
                request->send(400, PSTR("application/json"), "{\"status\": \"failed\",\"message\": \"message is missed\"}");
            }
    });

    //update Network details
    server.on(PSTR("/api/network/set"), HTTP_POST, [](AsyncWebServerRequest *request) {},NULL,
    [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total){
            StaticJsonDocument<48> doc;
            DeserializationError error = deserializeJson(doc, (char*)data);
            
            if (!error) {
                request->send(200, PSTR("application/json"), "{\"status\": \"successed\",\"message\": \"message is received\"}");
                
                WiFiManager.setNewWifi(doc["ssid"], doc["pass"]);
            }
            else{
                request->send(400, PSTR("application/json"), "{\"status\": \"failed\",\"msg\": \"message is missed\"}");
            }
    });

    //Update device configuration
    server.on(PSTR("/api/config/device/set"),HTTP_POST, [](AsyncWebServerRequest *request) {}, NULL,
      [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total){

            StaticJsonDocument<96> doc;
            
            DeserializationError error = deserializeJson(doc, (char*)data);
            if (!error) {
                request->send(200, PSTR("application/json"), "{\"status\": \"successed\",\"message\": \"message is received\"}");
                
                configManager.setDeviceConfig(doc["name"] ,doc["ssid"], doc["pass"]);
            }
            else{
                request->send(400, PSTR("application/json"), "{\"status\": \"failed\",\"message\": \"message is missed\"}");
            }
    });
     
    // Update device with capitive portal configuration
     server.on(PSTR("/api/config/device/setStatic"),HTTP_POST, [](AsyncWebServerRequest *request) {}, NULL,
      [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total){

            StaticJsonDocument<96> doc;
            DeserializationError error = deserializeJson(doc, (char*)data);
            if (!error) {
                request->send(200, PSTR("application/json"), "{\"status\": \"successed\",\"message\": \"message is received\"}");
                
                configManager.setStaticDeviceConfig(doc["name"] ,doc["ssid"], doc["pass"], doc["ip"], doc["subnet"], doc["gateway"]);
            }
            else{
                request->send(400, PSTR("application/json"), "{\"status\": \"failed\",\"message\": \"message is missed\"}");
            }
    });
    
    // Update sensor configuration
    server.on(PSTR("/api/config/sensor/set"),HTTP_POST, [](AsyncWebServerRequest *request) {}, NULL,
      [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total){

            StaticJsonDocument<48> doc;
            DeserializationError error = deserializeJson(doc, (char*)data);
            if (!error) {
                request->send(200, PSTR("application/json"), "{\"status\": \"successed\",\"message\": \"message is received\"}");
                
                configManager.setSensorConfig(doc["rate"]);
            }
            else{
                request->send(400, PSTR("application/json"), "{\"status\": \"failed\",\"message\": \"message is missed\"}");
            }
    });
    
    // Update broker configuration
    server.on(PSTR("/api/config/broker/set"),HTTP_POST, [](AsyncWebServerRequest *request) {}, NULL,
      [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total){

            StaticJsonDocument<96> doc;
            DeserializationError error = deserializeJson(doc, (char*)data);
            if (!error) {
                request->send(200, PSTR("application/json"), "{\"status\": \"successed\",\"message\": \"message is received\"}");
                
                configManager.setBrokerConfig(doc["status"],doc["ip"] ,doc["port"], doc["topic"], doc["qos"]);
            }
            else{
                request->send(400, PSTR("application/json"), "{\"status\": \"failed\",\"message\": \"message is missed\"}");
            }
    });

    //Restart the WoT device
    server.on(PSTR("/api/restart"), HTTP_POST, [](AsyncWebServerRequest *request) {
        request->send(200, PSTR("application/json"), "{\"status\": \"successed\", \"message\": \"Device is restarted!!\"}");
        delay(2000);
        ESP.restart();
    });

    //Reset device to defalut values
    server.on(PSTR("/api/reset"), HTTP_POST, [](AsyncWebServerRequest *request) {
        request->send(200, PSTR("application/json"), "{\"status\": \"successed\", \"message\": \"Device is reset to factory defaults!!\"}");
        delay(1000);
        configManager.reset();
        delay(2000);
        ESP.restart();
    });

    // Get dashboard information
    server.on(PSTR("/api/dashboard/get"), HTTP_GET, [](AsyncWebServerRequest *request) {
        
        String payload;
        StaticJsonDocument<256> jsonBuffer;
        
        jsonBuffer["firmwareName"] = configManager.firmwareConfigData.firmwareName;
        jsonBuffer["firmwareVer"] = configManager.firmwareConfigData.firmwareVer;
        jsonBuffer["sensorModel"] = configManager.sensorConfigData.model;
        jsonBuffer["deviceName"] = configManager.deviceConfigData.deviceName;

        jsonBuffer["networkSSID"] = WiFiManager.SSID();
        jsonBuffer["networkAddress"] = WiFiManager.getAddress();
       
        jsonBuffer["brokerServer"] = mqttPublisher.getBrokerAddress();
        jsonBuffer["brokerTopic"] = mqttPublisher.getBrokerTopic();

        serializeJson(jsonBuffer, payload);

        request->send(200, PSTR("application/json"), payload);
    });

    //Forget network cennection
    server.on(PSTR("/api/network/forget"), HTTP_POST, [](AsyncWebServerRequest *request) {
        request->send(200,  PSTR("application/json"), "{\"status\": \"successed\", \"message\": \"Network information is cleared successfully\"}");
        WiFiManager.forget();
    });

    //get captive portal network details
    server.on(PSTR("/api/network/get"), HTTP_GET, [](AsyncWebServerRequest *request) {
        String payload;
        StaticJsonDocument<48> jsonBuffer;

        jsonBuffer["status"] = WiFiManager.isCaptivePortal();
        jsonBuffer["ssid"] = configManager.deviceConfigData.deviceSSID;
        jsonBuffer["pass"] = configManager.deviceConfigData.devicePass;
        serializeJson(jsonBuffer, payload);

        request->send(200, PSTR("application/json"), payload);
    });

    //Get file listing
    server.on(PSTR("/api/files/get"), HTTP_GET, [](AsyncWebServerRequest *request) {
        String JSON;
        StaticJsonDocument<1000> jsonBuffer;
        JsonArray files = jsonBuffer.createNestedArray("files");

        //get file listing
        Dir dir = LittleFS.openDir("");
        while (dir.next())
            files.add(dir.fileName());

        //get used and total data
        FSInfo fs_info;
        LittleFS.info(fs_info);
        jsonBuffer["used"] = String(fs_info.usedBytes);
        jsonBuffer["max"] = String(fs_info.totalBytes);

        serializeJson(jsonBuffer, JSON);

        request->send(200, PSTR("application/json"), JSON);
    });

    //Remove file
    server.on(PSTR("/api/files/remove"), HTTP_POST, [](AsyncWebServerRequest *request) {
        LittleFS.remove("/" + request->arg("filename"));
        request->send(200, PSTR("text/html"), "");
    });

    //Update from LittleFS
    server.on(PSTR("/api/update"), HTTP_POST, [](AsyncWebServerRequest *request) {        
        updater.requestStart("/" + request->arg("filename"));
        request->send(200, PSTR("text/html"), "");
    });

    //Update status
    server.on(PSTR("/api/update-status"), HTTP_GET, [](AsyncWebServerRequest *request) {
        String JSON;
        StaticJsonDocument<200> jsonBuffer;

        jsonBuffer["status"] = updater.getStatus();
        serializeJson(jsonBuffer, JSON);

        request->send(200, PSTR("text/html"), JSON);
    });

    //Get configurations data
    server.on(PSTR("/api/config/get"), HTTP_GET, [](AsyncWebServerRequest *request){

        String payload;
        StaticJsonDocument<384> jsonBuffer;
        
        jsonBuffer["DeviceName"] = configManager.deviceConfigData.deviceName;
        jsonBuffer["DeviceSSID"] = configManager.deviceConfigData.deviceSSID;
        jsonBuffer["DevicePassword"] = configManager.deviceConfigData.devicePass;

        jsonBuffer["DeviceIP"] = configManager.deviceConfigData.deviceIP;
        jsonBuffer["DeviceGw"] = configManager.deviceConfigData.deviceGw;
        jsonBuffer["DeviceSub"] = configManager.deviceConfigData.deviceSub;

        jsonBuffer["MQTTStatus"] = configManager.brokerConfigData.publishRequest;
        jsonBuffer["MQTTBrokerIP"] = configManager.brokerConfigData.address;
        jsonBuffer["MQTTBrokerPort"] = configManager.brokerConfigData.port;
        jsonBuffer["MQTTBrokerTopic"] = configManager.brokerConfigData.topic;
        jsonBuffer["MQTTBrokerQoS"] = configManager.brokerConfigData.qos;

        jsonBuffer["SensorModel"] = configManager.sensorConfigData.model;
        jsonBuffer["SensorGPIO"] = configManager.sensorConfigData.gpio;
        jsonBuffer["SampelingRate"] = configManager.sensorConfigData.sampleRate;
        
        serializeJson(jsonBuffer, payload);

        request->send(200, PSTR("application/json"), payload);
    });
}

// Callback for the html
void webServer::serveProgmem(AsyncWebServerRequest *request){
    // Dump the byte array in PROGMEM with a 200 HTTP code (OK)
    AsyncWebServerResponse *response = request->beginResponse_P(200, PSTR("text/html"), html, html_len);

    // Tell the browswer the content is Gzipped
    response->addHeader(PSTR("Content-Encoding"), PSTR("gzip"));
    
    request->send(response);    
}

void webServer::handleFileUpload(AsyncWebServerRequest *request, String filename, size_t index, uint8_t *data, size_t len, bool final)
{
    static File fsUploadFile;

    if (!index)
    {
        Serial.println(PSTR("Start file upload"));
        Serial.println(filename);

        if (!filename.startsWith("/"))
            filename = "/" + filename;

        fsUploadFile = LittleFS.open(filename, "w");
    }

    for (size_t i = 0; i < len; i++)
    {
        fsUploadFile.write(data[i]);
    }

    if (final)
    {
        String JSON;
        StaticJsonDocument<100> jsonBuffer;

        jsonBuffer["success"] = fsUploadFile.isFile();
        serializeJson(jsonBuffer, JSON);

        request->send(200, PSTR("text/html"), JSON);
        fsUploadFile.close();        
    }
}

webServer server;