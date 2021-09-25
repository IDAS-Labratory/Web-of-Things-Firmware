# WoT Firmware for ESP8266

WoT firmware project is implemented as a starting point for using WoT-based devices in real IoT projects. This firmware is providing some basic IoT functionalities such as HTTP web server, MQTT-based event publisher, DHT11 sensor management, interactive web interface, network manager, configuration manager, live dashboard and Over-The-Air updates. Also, the UI implementation of this firmware is attached to this repository to help developers to customize or modify for their projects.

## Table of Contents
- [Requirements](#Requirements)
     - [Hardware Requirements](#Hardware-Requirements)
     - [Software Requirements](#Software-Requirements)
- [Installation](#Installation)
     - [Hardware Setup](#Hardware-Setup)
     - [Software Setup](#Software-Setup)
     - [Configuration](#Configuration)
- [Software Architecture and Design Approach](#Sotware-Architecture-and-Design-Approach)
     - [Software Architecture](#Software-Architecture)
     - [Module Structure](#Module-Structure)
- [Learn More](#Learn-More)


## Requirements

### Hardware Requirements
* [Wemos D1](http://www.esp8266learning.com/wemos-d1-esp8266-based-board.php) mini or any type of [ESP8266](https://www.espressif.com/en/products/modules/esp8266) board.

* [DHT11](https://www.adafruit.com/product/386) sensor

### Software Requirements

* [PlatformIO](https://platformio.org/) to develop and deploy firmware on ESP8266. It is recommended to install PlatformIO as a extensions on VSCode. Read more about installing PlatformIO [here](https://platformio.org/install/ide?install=vscode).

## Installation

Now, you can clone this repository and begin to setup your hardware and software.

### Hardware Setup

Follow this instruction according [schematic](#Hardware-Schematic) image to setup the hardware.

1. Connect 5v Vcc and GND pins of Wemos D1 to breadboard power rails according to [Wemos D1 pinout](https://www.wemos.cc/en/latest/d1/d1_mini.html) 

2. Connect GPIO 5 of D1 to data pin (pin 2) DHT11.
>>__Notice__: Do not forget to connect a pull-up resistor to data pin. Otherwise, your sensor doesn’t work properly.

3. Connect DHT11 VCC and GND pins to breadboard power rails.

![Hardware-Schematic](https://github.com/IDAS-Labratory/Web-of-Things-Firmware/blob/master/doc/diagrams/Schematic/Firmware%20Sketch_bb.png?raw=true)


### Software Setup

1. Firstly, clone this repository on your PC.
2. Open main directory of repository and then open `/firmware-back`.
3. Now click right through this directory and select the VScode to open the program files.
>>__Note__: You should open directory that contains `platformio.ini` file in order to PlatformIO can be activated on your VSCode.
4. Connect your Wemos D1 to your PC by USB cable.
5. At this step you should build the program and then upload it on the Wemos, according below.

### Configuration
To configure or change default values, you should modify the values of `config.cpp` in `/firmware-back/src/default`.

If you want to use other models of DHT sensor or set another GPIO for working, you should modify defining values `SensorModel` and `SensorGPIO` in the `main.cpp`.

The user interface of WoT firmware is developed on [Preact JS](https://preactjs.com/) framework. To change UI dashboard, you should develop `/firmware-front` and then applying modifications by this command `npm run build`. New `html.h` file is automatically replaced by previous version.

## APIs Endpoint

### REST APIs

HTTP Verb |API                            | Request Body Value   | Description   
----------|-------------------------------| -------------------- |------------
GET       |/api/index                     | {}                   | Index
POST      |/api/restart                   | {}                   | Restart device
POST      |/api/reset                     | {}                   | Reset device to default values
GET       |/api/config/get                | {}                   | Get configuration data
POST      |/api/config/device/set         | { "name": "WoT", "ssid": "WoT AP", "pass":"wot1234567"} | Set device configuration
POST      |/api/config/device/setStatic   | { "name": "WoT", "ssid": "WoT AP", "pass": "wot1234567", "ip": "192.168.1.1", "subnet": "255.255.255.0", "gateway": "192.168.1.1" }             | Set captive portal configuration by static address 
POST      |/api/config/sensor/set         | { "rate": 5000 }     | Set sensor configuration
POST      |/api/config/broker/set         | { "ip": "192.168.1.100", "port": 1883, "topic": "/temperature", "qos": 0 }                                                                | Get humidity status
GET       |/api/network/get               | {}                   | Get captive portal network status
POST      |/api/network/set               | { "ssid": "IDAS-Lab", "pass": "password" }    | Set network connection
POST      |/api/network/setStaticIP       | { "ip": "192.168.1.90", "subnet": "255.255.255.0", "gateway": "192.168.1.1", "dns": "8.8.8.8", "ssid": "IDAS-Lab", "pass": "password" }       | Set network connection by static address
GET       |/api/dashboard/get             | {}                   | Get dashboard information

### MQTT API

Topic        | QoS | Message
-------------|-----|--------
/temperature | 0   | { "name": "WoT Device", "timestamp": 9801423, "value": { "temperature": 24.00, "humidity": 16.00 } }

## Sotware Architecture and Design Approach

The architecture of WoT firmware is designed over the WoT-Middleware architecture that is proposed on previous project, [WoT-Middleware Platform](https://github.com/IDAS-Labratory/Web-of-Things-Middleware-Platform), however, the firmware architecture is implemented, pretty much different than WoT-Middleware platform, according to its micro programming nature. Therefore, WoT firmware architecture designed and implemented follow the __Layered Architecture Style__ beside __Object-Oriented__ architecture over the Arduino framework. 

![WoT-Firmware-Architecture](https://github.com/IDAS-Labratory/Web-of-Things-Firmware/blob/master/doc/diagrams/System/Architecture.png?raw=true)

### Software-Architecture

The firmware architecture is designed in three main layers, including Application, Middleware, and Things layer.

#### Application Layer

This firmware provides some basic REST APIs and MQTT Topic in order to enable developers to use WoT device functionalities in other applications development.  

#### Middleware Layer

The middleware layer is responsible for three major tasks as _Providing Services_, _Implementing Functionalities_ and _Connecting to Hardware_. So, the three parts of designed middleware are in charge of each one of them. we will describe each part in the following.

1. The publisher part is carried out the _Providing Services_ by implementing both MQTT Publisher and HTTP Web Server.

2. The main functionalities of firmware are implemented in major part of the middleware layer. Live dashboard, WiFi manager, sensor manager, Over-The-Air upgrading and configuration management are the main functionalities which are implemented in this layer.

3. To run and work with sensor module and ESP flash memory, we leverage two basic Arduino libraries as the [DHT sesnor library](https://github.com/adafruit/DHT-sensor-library) and [Little Fail-Safe Filesystem](https://github.com/littlefs-project/littlefs) in middleware layer to connect to DHT sensor and flash memory hardware, respectively.


#### Things Layer

This layer contains our internal and external hardware, consist of DHT11 sensor as a external part and ESP flash memory as an internal one. 

### Module Structure

The classes functionalities and responsibility are detailed in the following.

- `src/main.cpp`: Firstly, it calls begin functions of all sub-systems individually to setup them and then running sub-systems life-cycle in the loop function. The DHT sensor object is initializing with sensor pin and model values by DHTSensor class constructor at the main.

- `src/webServer.cpp`: This class by leveraging ESPAsyncWebServer library, as a web server, provides some Restful APIs to represent device functionalities on the Web. Users control and monitor WoT device through GUI dashboard or these APIs independently.

- `src/publisher.cpp`: This class uses AsyncMqttClient library to enable WoT device to publish its data through MQTT protocol.

- `src/configManager.cpp`: This class fetch default configuration data from Flash memory and then, replaced them by new values on user demands.
- `src/WiFiManager.cpp`: Network management including captive portal and local network connection are main tasks of this class.
- `src/sensor.cpp`: Creating sensor object from DHT library, reading data from sensor and storing them in temporary memory are main activities of this class.  
- `src/dashboard.cpp`: This class is responsible for preparing dashboard items and representing them by WebSocket connection into firmware UI.
- `src/updater.cpp`: WoT firmware has been able to Over-The-Air update functionality by this class.

```
firmware-back/src/
     default/
          config.cpp
          config.h
          html.h
     configManager.cpp
     configManager.h
     dashboard.cpp
     dashboard.h
     main.cpp
     publisher.cpp
     publisher.h
     sensor.cpp
     sensor.h
     updater.cpp
     updater.h
     webServer.cpp
     webServer.h
     WiFiManager.cpp
     WiFiManager.h
```

## Learn-More

- This project is build and run over the [ESP8266 IoT framework](https://github.com/maakbaas/esp8266-iot-framework). Please find out this repository to learn more about implementation details.

- You can flash the `firmware.bin` file, it already exist in `/firmware-back` , into your ESP8266 device by using ESP flasher tools, like [NodeMCU Flasher](https://github.com/nodemcu/nodemcu-flasher) or [ESPlorer](https://esp8266.ru/esplorer/).