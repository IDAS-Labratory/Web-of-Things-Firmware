#ifndef CONFIGMGR_H
#define CONFIGMGR_H

#include "default/config.h"

#define SIZE_Internal 18 
#define SIZE_FirmwareConfig 35
#define SIZE_DeviceConfig 195
#define SIZE_SensorConfig 8
#define SIZE_BrokerConfig 60


struct internalData
{
    uint32_t ip;
    uint32_t gw;
    uint32_t sub;
    uint32_t dns;
};

class config
{

public:
    firmwareData firmwareConfigData;
    sensorData sensorConfigData;
    deviceData deviceConfigData;
    brokerData brokerConfigData;
    internalData internal;
    
    bool begin(int bytes = 512);
    void saveExternal(deviceData *devicData, sensorData *sensorData, brokerData *brokerData);
    void save();
    void reset();
    void loop();
    
    void setDeviceConfig(String name, String ssid, String password);
    void setStaticDeviceConfig(String name, String ssid, String password, String ip, String sub, String gw);
    void setSensorConfig(uint32_t samplingRate);
    void setBrokerConfig(bool status,String addr, uint16_t port, String topic, uint8_t qos);

private:
    int numBytes;
    uint8_t checksum(uint8_t *byteArray, unsigned long length);
    bool requestSave = false;
};

extern config configManager;

#endif