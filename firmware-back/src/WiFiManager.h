#ifndef WIFI_H
#define WIFI_H

#include <Arduino.h>
#include <DNSServer.h>
#include <memory>

class WifiManager
{

private:
    DNSServer *dnsServer;
    String ssid;
    String pass;
    IPAddress ip;
    IPAddress gw;
    IPAddress sub;
    IPAddress dns;

    bool reconnect = false;
    bool inCaptivePortal = false;
    
    char const *captivePortalName;
    char const *captivePortalPassword;
    IPAddress captivePortalIP;
    IPAddress captivePortalGateway;
    IPAddress captivePortalSubnet;
    
    void startCaptivePortal();
    void stopCaptivePortal();
    void connectNewWifi(String newSSID, String newPass);    
    void storeToEEPROM();

public : 
    void begin();
    void loop();
    void forget();
    bool isCaptivePortal();
    String SSID();
    String getAddress();
    void setNewWifi(String newSSID, String newPass);
    void setNewStaticWifi(String newSSID, String newPass, String newIp, String newSub, String newGw, String newDns);
};

extern WifiManager WiFiManager;

#endif