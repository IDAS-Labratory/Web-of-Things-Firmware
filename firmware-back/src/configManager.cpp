#include <EEPROM.h>
#include <Arduino.h>
#include "configManager.h"

bool config::begin(int bytes){
    
    numBytes = bytes;
    
    EEPROM.begin(numBytes);
    
    uint8_t checksumFirmwareData = 0;
    uint8_t checksumDeviceData = 0;
    uint8_t checksumSensorData = 0;
    uint8_t checksumBrokerData = 0;
    uint8_t checksumInternal = 0;

    EEPROM.get(0, internal);
    EEPROM.get(SIZE_Internal, checksumInternal);
    EEPROM.get(SIZE_Internal + 1, deviceConfigData);
    EEPROM.get(SIZE_Internal + 1 + SIZE_DeviceConfig, checksumDeviceData);
    EEPROM.get(SIZE_Internal + 1 + SIZE_DeviceConfig + 1, sensorConfigData);
    EEPROM.get(SIZE_Internal + 1 + SIZE_DeviceConfig + 1 + SIZE_SensorConfig, checksumSensorData);
    EEPROM.get(SIZE_Internal + 1 + SIZE_DeviceConfig + 1 + SIZE_SensorConfig + 1, brokerConfigData);
    EEPROM.get(SIZE_Internal + 1 + SIZE_DeviceConfig + 1 + SIZE_SensorConfig + 1 + SIZE_BrokerConfig, checksumBrokerData);
    EEPROM.get(SIZE_Internal + 1 + SIZE_DeviceConfig + 1 + SIZE_SensorConfig + 1 + SIZE_BrokerConfig + 1, firmwareConfigData);
    EEPROM.get(SIZE_Internal + 1 + SIZE_DeviceConfig + 1 + SIZE_SensorConfig + 1 + SIZE_BrokerConfig + 1 + SIZE_FirmwareConfig, checksumFirmwareData);
    
    bool returnValue = true;

    //reset configuration data if checksum mismatch
    if (
        checksumFirmwareData != checksum(reinterpret_cast<uint8_t*>(&firmwareConfigData), sizeof(firmwareConfigData)) ||
        checksumDeviceData != checksum(reinterpret_cast<uint8_t*>(&deviceConfigData), sizeof(deviceConfigData)) ||
        checksumSensorData != checksum(reinterpret_cast<uint8_t*>(&sensorConfigData), sizeof(sensorConfigData)) ||
        checksumBrokerData != checksum(reinterpret_cast<uint8_t*>(&brokerConfigData), sizeof(brokerConfigData))
        )
    {
        Serial.println(PSTR("Config data checksum mismatch"));
        reset();
        returnValue = false;
    }

    //reset internal data if checksum mismatch
    if (checksumInternal != checksum(reinterpret_cast<uint8_t*>(&internal), sizeof(internal)))
    {
        Serial.println(PSTR("Internal data checksum mismatch"));
        internal = internalData();
        requestSave = true;
        returnValue = false;
    }

    return returnValue;
           
}

void config::save(){
    
    // Stroe Internal data and its checksum
    Serial.println("Storing Data into EEPROM....");
    EEPROM.put(0, internal);
    EEPROM.put(SIZE_Internal, checksum(reinterpret_cast<uint8_t*>(&internal), sizeof(internal)));

    //Store device config data and its checksum
    EEPROM.put(SIZE_Internal + 1, deviceConfigData);
    EEPROM.put(SIZE_Internal + 1 + SIZE_DeviceConfig, checksum(reinterpret_cast<uint8_t*>(&deviceConfigData), sizeof(deviceConfigData)));

    //Stroe sensor config data and its checksum
    EEPROM.put(SIZE_Internal + 1 + SIZE_DeviceConfig + 1, sensorConfigData);
    EEPROM.put(SIZE_Internal + 1 + SIZE_DeviceConfig + 1 + SIZE_SensorConfig, checksum(reinterpret_cast<uint8_t*>(&sensorConfigData), sizeof(sensorConfigData)));

    //Store broker config data and its checksum
    EEPROM.put(SIZE_Internal + 1 + SIZE_DeviceConfig + 1 + SIZE_SensorConfig + 1, brokerConfigData);
    EEPROM.put(SIZE_Internal + 1 + SIZE_DeviceConfig + 1 + SIZE_SensorConfig + 1 + SIZE_BrokerConfig, checksum(reinterpret_cast<uint8_t*>(&brokerConfigData), sizeof(brokerConfigData)));
    
    //Store firmware data
    EEPROM.put(SIZE_Internal + 1 + SIZE_DeviceConfig + 1 + SIZE_SensorConfig + 1 + SIZE_BrokerConfig + 1, firmwareConfigData);
    EEPROM.put(SIZE_Internal + 1 + SIZE_DeviceConfig + 1 + SIZE_SensorConfig + 1 + SIZE_BrokerConfig + 1 + SIZE_FirmwareConfig, checksum(reinterpret_cast<uint8_t*>(&firmwareConfigData), sizeof(firmwareConfigData)));
    
    // Commit EEPROM changes
    Serial.println("Commit EEPROM....");
    EEPROM.commit();

}

void config::reset()
{
    memcpy_P(&firmwareConfigData, &firmwareDefaults, sizeof(firmwareConfigData));
    memcpy_P(&deviceConfigData, &deviceDefaults, sizeof(deviceConfigData));
    memcpy_P(&sensorConfigData, &sensorDefaults, sizeof(sensorConfigData));
    memcpy_P(&brokerConfigData, &brokerDefaults, sizeof(brokerConfigData));
    requestSave = true;
}

void config::saveExternal(deviceData *devicData, sensorData *sensorData, brokerData *brokerData)
{
    memcpy_P(&deviceConfigData, &devicData, sizeof(deviceConfigData));
    memcpy_P(&sensorConfigData, &sensorData, sizeof(sensorConfigData));
    memcpy_P(&brokerConfigData, &brokerData, sizeof(brokerConfigData));
    requestSave = true;
}

void config::setDeviceConfig(String name, String ssid, String password){
    strcpy(deviceConfigData.deviceName, name.c_str());
    strcpy(deviceConfigData.deviceSSID, ssid.c_str());
    strcpy(deviceConfigData.devicePass, password.c_str());
    
    requestSave = true;
}

void config::setStaticDeviceConfig(String name, String ssid, String password, String ip, String sub, String gw){
    strcpy(deviceConfigData.deviceName, name.c_str());
    strcpy(deviceConfigData.deviceSSID, ssid.c_str());
    strcpy(deviceConfigData.devicePass, password.c_str());
    strcpy(deviceConfigData.deviceIP, ip.c_str());
    strcpy(deviceConfigData.deviceSub, sub.c_str());
    strcpy(deviceConfigData.deviceGw, gw.c_str());
    
    requestSave = true;
}

void config::setSensorConfig(uint32_t sampleRate){
    
    sensorConfigData.sampleRate = sampleRate;

    requestSave = true;
}

void config::setBrokerConfig(bool status,String addr, uint16_t port, String topic, uint8_t qos){

    brokerConfigData.publishRequest = status;
    strcpy(brokerConfigData.address, addr.c_str());
    brokerConfigData.port = port;
    strcpy(brokerConfigData.topic, topic.c_str());
    brokerConfigData.qos = qos;
    
    requestSave = true;

}

void config::loop()
{
    if (requestSave)
    {
        requestSave = false;
        save();
    }
}

uint8_t config::checksum(uint8_t *byteArray, unsigned long length)
{
    uint8_t value = 0;
    unsigned long counter;

    for (counter=0; counter<length; counter++)
    {
        value += *byteArray;
        byteArray++;
    }

    return (uint8_t)(256-value);

}

config configManager;