#ifndef DASHBOARD_H
#define DASHBOARD_H

#include <ESPAsyncWebServer.h>

struct dashboardData
{
	bool sensorStatus;
	bool networkStatus;
	bool brokerStatus;
	uint16_t temperature;
	uint16_t humidity;
};

class dashboard
{

private:
    static void onWsEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len);
    unsigned long loopPrevious = 0;

public:
    void begin();
    void loop();
    void send();
    dashboardData data;
};

extern dashboard dash;

#endif