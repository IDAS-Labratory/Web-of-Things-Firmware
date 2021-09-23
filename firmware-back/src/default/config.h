#ifndef CONFIG_H
#define CONFIG_H

struct firmwareData {
    char firmwareName[20];
    char firmwareVer[10];
};

struct deviceData
{
    char deviceName[32];
    char deviceSSID[32];
    char devicePass[32];
    char deviceIP[16];
    char deviceGw[16];
    char deviceSub[16];
};

struct sensorData
{
    uint8_t model;
    uint8_t gpio;
    uint32_t sampleRate;
};

struct brokerData
{
    bool publishRequest;
    char address[16];
    uint16_t port;
    char topic[32];
    uint8_t qos;
};

extern const firmwareData firmwareDefaults;
extern const deviceData deviceDefaults;
extern const sensorData sensorDefaults;
extern const brokerData brokerDefaults;

#endif