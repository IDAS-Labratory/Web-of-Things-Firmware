
#include <ESP8266WiFi.h>

#include "WiFiManager.h"
#include "configManager.h"
#include "dashboard.h"

WifiManager WiFiManager;

void WifiManager::begin()
{    
    captivePortalName = configManager.deviceConfigData.deviceSSID;
    captivePortalPassword = configManager.deviceConfigData.devicePass;
    captivePortalIP.fromString(String(configManager.deviceConfigData.deviceIP));
    captivePortalGateway.fromString(String(configManager.deviceConfigData.deviceGw));
    captivePortalSubnet.fromString(String(configManager.deviceConfigData.deviceSub));

    WiFi.mode(WIFI_STA);

    //set static IP if entered
    ip = IPAddress(configManager.internal.ip);
    gw = IPAddress(configManager.internal.gw);
    sub = IPAddress(configManager.internal.sub);
    dns = IPAddress(configManager.internal.dns);

    if (ip.isSet() || gw.isSet() || sub.isSet() || dns.isSet())
    {
        Serial.println(PSTR("Using static IP"));
        WiFi.config(ip, gw, sub, dns);
    }

    if (WiFi.SSID() != "")
    {
        //trying to fix connection in progress hanging
        ETS_UART_INTR_DISABLE();
        wifi_station_disconnect();
        ETS_UART_INTR_ENABLE();
        WiFi.begin();
    }

    if (WiFi.waitForConnectResult() == WL_CONNECTED)
    {
        dash.data.networkStatus = true;
        //connected
        Serial.println(PSTR("Connected to stored WiFi details"));
        Serial.print("Open device dashboared on LOCAL IP:");
        Serial.println(WiFi.localIP().toString());
    }
    else
    {
        //captive portal
        dash.data.networkStatus = false;
        startCaptivePortal();
    }
}

void WifiManager::forget()
{ 
    WiFi.disconnect();
    dash.data.networkStatus = false;
    startCaptivePortal();

    //remove IP address from EEPROM
    ip = IPAddress();
    sub = IPAddress();
    gw = IPAddress();
    dns = IPAddress();

    //make EEPROM empty
    storeToEEPROM();

    Serial.println(PSTR("Requested to forget WiFi. Started Captive portal."));
}

void WifiManager::setNewWifi(String newSSID, String newPass)
{    
    ssid = newSSID;
    pass = newPass;
    ip = IPAddress();
    sub = IPAddress();
    gw = IPAddress();
    dns = IPAddress();

    reconnect = true;
}

void WifiManager::setNewStaticWifi(String newSSID, String newPass, String newIp, String newSub, String newGw, String newDns)
{
    Serial.println("Set New Static WIFI");
    ssid = newSSID;
    pass = newPass;
    ip.fromString(newIp);
    sub.fromString(newSub);
    gw.fromString(newGw);
    dns.fromString(newDns);

    reconnect = true;
}

void WifiManager::connectNewWifi(String newSSID, String newPass)
{
    delay(1000);

    //set static IP or zeros if undefined    
    WiFi.config(ip, gw, sub, dns);

    //fix for auto connect racing issue
    if (!(WiFi.status() == WL_CONNECTED && (WiFi.SSID() == newSSID)) || ip.v4() != configManager.internal.ip  || dns.v4() != configManager.internal.dns)
    {          
        //trying to fix connection in progress hanging
        ETS_UART_INTR_DISABLE();
        wifi_station_disconnect();
        ETS_UART_INTR_ENABLE();

        //store old data in case new network is wrong
        String oldSSID = WiFi.SSID();
        String oldPSK = WiFi.psk();
        //Serial.print("WIFI Password is: "); Serial.println(newPass);

        char * tempPass = new char [newPass.length()+1];
        strcpy (tempPass, newPass.c_str());

        WiFi.begin(newSSID.c_str(), tempPass, 0, NULL, true);
        delay(2000);

        if (WiFi.waitForConnectResult() != WL_CONNECTED)
        {
            
            Serial.println(PSTR("New connection unsuccessful"));
            if (!inCaptivePortal)
            {
                WiFi.begin(oldSSID, oldPSK, 0, NULL, true);
                if (WiFi.waitForConnectResult() != WL_CONNECTED)
                {
                    Serial.println(PSTR("Reconnection failed too"));
                    startCaptivePortal();
                }
                else 
                {
                    Serial.println(PSTR("Reconnection successful"));
                    Serial.println(WiFi.localIP());
                }
            }
        }
        else
        {
            if (inCaptivePortal)
            {
                stopCaptivePortal();
            }

            Serial.println(PSTR("New connection successful"));
            Serial.println(WiFi.localIP());

            //store IP address in EEProm
            storeToEEPROM();

        }
    }
}

void WifiManager::startCaptivePortal()
{

    WiFi.persistent(false);
    // disconnect sta, start ap
    WiFi.disconnect(); //  this alone is not enough to stop the autoconnecter
    WiFi.mode(WIFI_AP);
    WiFi.persistent(true);

    //Config Captive Portal
    WiFi.softAPConfig(captivePortalIP, captivePortalGateway, captivePortalSubnet);
    WiFi.softAP(captivePortalName, captivePortalPassword);
    
    dnsServer = new DNSServer();

    /* Setup the DNS server redirecting all the domains to the apIP */
    dnsServer->setErrorReplyCode(DNSReplyCode::NoError);
    dnsServer->start(53, "*", WiFi.softAPIP());

    Serial.println(PSTR("Opened a captive portal on IP:"));
    Serial.println(configManager.deviceConfigData.deviceIP);
    inCaptivePortal = true;
}

void WifiManager::stopCaptivePortal()
{    
    WiFi.mode(WIFI_STA);
    delete dnsServer;

    inCaptivePortal = false;    
}

bool WifiManager::isCaptivePortal()
{
    return inCaptivePortal;
}

String WifiManager::SSID()
{    
    return inCaptivePortal ? WiFi.softAPSSID() : WiFi.SSID();
}

String WifiManager::getAddress(){
    return inCaptivePortal ? WiFi.softAPIP().toString() : WiFi.localIP().toString();
}

void WifiManager::loop()
{
    if (inCaptivePortal)
    {
        //captive portal loop
        dash.data.networkStatus = false;
        dnsServer->processNextRequest();
    }

    if (reconnect)
    {
        connectNewWifi(ssid, pass);
        dash.data.networkStatus = true;
        reconnect = false;
    }
    
}

void WifiManager::storeToEEPROM()
{
    Serial.println("Store Internal Data.....");
    configManager.internal.ip = ip.v4();
    configManager.internal.gw = gw.v4();
    configManager.internal.sub = sub.v4();
    configManager.internal.dns = dns.v4();
    configManager.save();
}