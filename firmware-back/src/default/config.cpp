#include <Arduino.h>
#include "config.h"


const firmwareData firmwareDefaults PROGMEM = {
	"Helenor",
	"v1.0"
};

const deviceData deviceDefaults PROGMEM = {
	"WoT Device",
	"WoT AP",
	"12345678",
	"192.168.4.1",
	"192.168.4.1",
	"255.255.255.0"
};

const sensorData sensorDefaults PROGMEM = {
	11,
	5,
	5000
};

const brokerData brokerDefaults PROGMEM = {
	false,
	"",
	1883,
	"/temperature",
	0,
};
