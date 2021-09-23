import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import {Card, CardContainer, List, Live, Connecting, Disconnected, Spinner} from "../MainComponents";

const loc = require("../../language/en.json");

export function DashboardPage(props) {
    
    const [counter, setCounter] = useState(0);
    const [socketStatus, setSocketStatus] = useState(0);

    useEffect(() => {
        document.title = loc.titleDashboard;    
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCounter(counter => counter + 1);
            if (!(socketStatus == 0 && props.socket.readyState != 1)) {
                setSocketStatus(props.socket.readyState);
            }
        }, 40); //Refresh Status

        return () => clearTimeout(timer);

    }, [counter]);
    

    const sensorDashboardList = <>
        <List>
            <li> <label>{loc.globalStatus}:</label> {props.dashboardStatusData.sensorstatus == true ? loc.dashSenPlug : props.dashboardStatusData.sensorstatus == false ? loc.dashSenUnplug : <Spinner style={{verticalAlign:"-0.25em"}}/>} </li>
            <li> <label>{loc.dashSenCardtemp}:</label> {props.dashboardStatusData.sensorstatus ? props.dashboardStatusData.temperature + " °C" : "--"} </li>
            <li><label>{loc.dashSenCardHum}:</label> {props.dashboardStatusData.sensorstatus ? props.dashboardStatusData.humidity + " %" : "--"}</li>
        </List>
    </>;

    const networkDashboardList = <>
        <List>
            <li> <label>{loc.globalStatus}:</label> {props.dashboardStatusData.networkstatus == true ? loc.dashNetLocalStatus : props.dashboardStatusData.networkstatus == false ? loc.dashNetCpStatus : <Spinner style={{verticalAlign:"-0.25em"}}/>} </li>
            <li> <label>{loc.dashNetCardSSID}:</label> {props.dashboardData.networkSSID} </li>
            <li> <label>{loc.dahsNetCardAdrr}:</label> {props.dashboardData.networkAddress} </li>
        </List>
    </>;

    const deviceDashboardList = <>
        <List>
            <li> <label>{loc.dashDevCardName}:</label> {props.dashboardData.deviceName} </li>
            <li> <label>{loc.dashDevCardSensor}:</label> DHT{props.dashboardData.sensorModel} </li>
            <li> <label>{loc.dashDevCardFirmVer}:</label> {props.dashboardData.firmwareName} {props.dashboardData.firmwareVer} </li>
        </List>
    </>;

    const brokerDashboardList = <>
        <List>
            <li> <label>{loc.globalStatus}:</label> {props.dashboardStatusData.brokerstatus == true ? loc.dashBroConStatus : props.dashboardStatusData.brokerstatus == false ? loc.dashBroDisStatus : <Spinner style={{verticalAlign:"-0.25em"}}/>} </li>
            <li> <label>{loc.dashBroCardServer}:</label> {props.dashboardData.brokerServer} </li>
            <li> <label>{loc.dashBroCardTopic}:</label> {props.dashboardData.brokerTopic} </li>
        </List>
    </>;

    return <> 
        <h2>{loc.titleDashboard} {socketStatus != 0 ? socketStatus == 1 ? <Live>{loc.dashLive}</Live> : <Disconnected>{loc.dashDisconn}</Disconnected> : <Connecting>{loc.dashConn}</Connecting>}</h2> 
        <CardContainer>
            <Card className="box redBox">
                <h3>{loc.dashSenCardTitle}</h3>
                {sensorDashboardList}    
            </Card>
            <Card className="box blueBox">
                <h3>{loc.dashNetCardTitle}</h3>
                {networkDashboardList}
            </Card>
        </CardContainer>
        <CardContainer>
            <Card className="box orangeBox">
                <h3>{loc.dashDevCardTitle}</h3>
                {deviceDashboardList}
            </Card>
            <Card className="box cyanBox">
                <h3>{loc.dashBroCardTitle}</h3>
                {brokerDashboardList}
            </Card>
        </CardContainer>
    </>;
}

DashboardPage.propTypes = {
    socket: PropTypes.object,
    dashboardData: PropTypes.object,
    dashboardStatusData: PropTypes.object,
};