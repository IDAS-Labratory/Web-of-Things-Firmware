import React, {useState ,useEffect } from "react";
import PropTypes from "prop-types";
import { CornerDownRight } from "react-feather";

import {postBrokerConfigData, postSensorConfigData, postDeviceStaticConfigData, postDeviceConfigData} from "../../apis/api"; 

import {Card, Form, Button, Confirmation } from "../MainComponents";

const loc = require("../../language/en.json");

export function ConfigPage(props) {
    
    const [portalStatic, setPortalStatic] = useState(false);
    const [mqttStatus, setMqttStatus] = useState(props.configData.MQTTStatus);
    const [deviceSaveModal, setDeviceSaveModal] = useState(false);
    const [sensorSaveModal, setSensorSaveModal] = useState(false);
    const [brokerSaveModal, setBrokerSaveModal] = useState(false);

    useEffect(() => {
        document.title = loc.titleConfiguration;
    }, []);

    function updateDeviceConfig() {
        
        const deviceName = document.getElementById("device_name").value ? 
            String(document.getElementById("device_name").value.trim()) : props.configData.DeviceName;
        
        const deviceSSID = document.getElementById("portal_ssid").value ? 
            String(document.getElementById("portal_ssid").value.trim()) : props.configData.DeviceSSID;
        
        const devicePass = document.getElementById("portal_pass").value ? 
            String(document.getElementById("portal_pass").value.trim()) : props.configData.DevicePassword;

        if (!portalStatic) {        
            const body = JSON.stringify({
                name: deviceName,
                ssid: deviceSSID,
                pass: devicePass,
            });

            postDeviceConfigData(body);

        } else {
            const body = JSON.stringify({
                name: deviceName,
                ssid: deviceSSID,
                pass: devicePass,
                ip: String(document.getElementById("portal_ip").value.trim()),
                subnet: String(document.getElementById("portal_sub").value.trim()),
                gateway: String(document.getElementById("portal_gw").value.trim()),
            });
            
            postDeviceStaticConfigData(body);
            
            // Claering Inputs values
            document.getElementById("portal_ip").value = "";
            document.getElementById("portal_gw").value = "";
            document.getElementById("portal_sub").value = "";
            setPortalStatic(false);
        }
        document.getElementById("device_name").value = "";
        document.getElementById("portal_ssid").value = "";
        document.getElementById("portal_pass").value = "";        
    }

    function updateSensorConfig() {
        
        const sensorRate = document.getElementById("sampling_rate").value ? Number(document.getElementById("sampling_rate").value.trim()) : props.configData.SampelingRate;

        const body = JSON.stringify({
            rate: sensorRate,
        });

        postSensorConfigData(body);

        document.getElementById("sampling_rate").value = "";        
    }

    function updateBrokerConfig() {
        
        const brokerAddr = document.getElementById("broker_address").value ?
            String(document.getElementById("broker_address").value.trim()) : props.configData.MQTTBrokerIP; 
        
        const brokerPort = document.getElementById("broker_port").value ? 
            Number(document.getElementById("broker_port").value.trim()) : props.configData.MQTTBrokerPort; 
        
        const brokerTopic = document.getElementById("broker_topic").value ?
            escape(document.getElementById("broker_topic").value.trim()) : props.configData.MQTTBrokerTopic;
        
        const brokerQoS = document.getElementById("broker_qos").value ? 
            Number(document.getElementById("broker_qos").value.trim()) : props.configData.MQTTBrokerQoS;  
        
        const body = JSON.stringify({
            status: mqttStatus,
            ip: brokerAddr,
            port: brokerPort,
            topic: brokerTopic,
            qos: brokerQoS,
        });

        postBrokerConfigData(body);

        document.getElementById("broker_address").value = "";
        document.getElementById("broker_port").value = "";
        document.getElementById("broker_topic").value = "";
        document.getElementById("broker_qos").value = "";         
    }

    
    let page = <> 
        <h2>{loc.titleConfiguration}</h2>
    </>;

    let portalStaticForm = <></>;

    if (portalStatic) {
        portalStaticForm = <>

            <p><label htmlFor="portal_ip"><CornerDownRight /> {loc.CPStaticIP}:</label>
                <input type="text" id="portal_ip" name="portal_ip" placeholder={props.configData.DeviceIP} autoCapitalize="none" />
            </p>
            <p><label htmlFor="portal_sub"><CornerDownRight /> {loc.wifiSub}:</label>
                <input type="text" id="portal_sub" name="portal_sub" placeholder={props.configData.DeviceSub} autoCapitalize="none" />
            </p>
            <p><label htmlFor="portal_gw"><CornerDownRight /> {loc.wifiGW}:</label>
                <input type="text" id="portal_gw" name="portal_gw" placeholder={props.configData.DeviceGw} autoCapitalize="none" />
            </p>
        </>;
    }    

    let brokerForm = <></>;

    if (mqttStatus) {
        brokerForm = <>
            <div className="flex">
                <p><label htmlFor="broker_address">{loc.ConfBroCardServer}:</label>
                    <input type="text" id="broker_address" name="broker_address" placeholder={props.configData.MQTTBrokerIP} autoCapitalize="none" />
                </p>
                <p><label htmlFor="broker_port">{loc.ConfBroCardPort}:</label>
                    <input type="text" id="broker_port" name="broker_port" placeholder={props.configData.MQTTBrokerPort} autoCapitalize="none" />
                </p>
            </div>
            <div className="flex">
                <p><label htmlFor="broker_topic">{loc.ConfBroCardTopic}:</label>
                    <input type="text" id="broker_topic" name="broker_topic" placeholder={props.configData.MQTTBrokerTopic} autoCapitalize="none" />
                </p>
                <p><label htmlFor="broker_qos">{loc.ConfBroCardQoS}:</label>
                    <input type="number" id="broker_qos" name="broker_qos" placeholder={props.configData.MQTTBrokerQoS} autoCapitalize="none" />
                </p>
            </div>
        </>;
    } else {
        brokerForm = <>
            <div className="flex">
                <p><label htmlFor="broker_address">{loc.ConfBroCardServer}:</label>
                    <input type="text" id="broker_address" name="broker_address" placeholder={props.configData.MQTTBrokerIP} autoCapitalize="none" disabled/>
                </p>
                <p><label htmlFor="broker_port">{loc.ConfBroCardPort}:</label>
                    <input type="text" id="broker_port" name="broker_port" placeholder={props.configData.MQTTBrokerPort} autoCapitalize="none" disabled/>
                </p>
            </div>
            <div className="flex">
                <p><label htmlFor="broker_topic">{loc.ConfBroCardTopic}:</label>
                    <input type="text" id="broker_topic" name="broker_topic" placeholder={props.configData.MQTTBrokerTopic} autoCapitalize="none" disabled/>
                </p>
                <p><label htmlFor="broker_qos">{loc.ConfBroCardQoS}:</label>
                    <input type="number" id="broker_qos" name="broker_qos" placeholder={props.configData.MQTTBrokerQoS} autoCapitalize="none" disabled/>
                </p>
            </div>
        </>;
    }

    const deviceConfigForm = <>
        <Form>
            <div className="name">
                <p><label htmlFor="device_name">{loc.ConfDevCardName}:</label>
                    <input type="text" id="device_name" name="device_name" placeholder={props.configData.DeviceName} autoCapitalize="none" required />
                </p>
            </div>
            <div className="flex">
                <p><label htmlFor="portal_ssid">{loc.wifiSSID}:</label>
                    <input type="text" id="portal_ssid" name="portal_ssid" placeholder={props.configData.DeviceSSID} autoCapitalize="none" required/>
                </p>
                <p><label htmlFor="portal_pass">{loc.wifiPass}:</label>
                    <input type="text" id="portal_pass" name="portal_pass" placeholder={props.configData.DevicePassword} autoCapitalize="none" required/>
                </p>
            </div>
            <p><label htmlFor="static_config">{loc.CPStaticConfig}:</label>
                <input type="checkbox" id="static_config" name="static_config" checked={portalStatic} onChange={()=>setPortalStatic(!portalStatic)} />
            </p>
            {portalStaticForm}
        </Form>
        <Button onClick={() => setDeviceSaveModal(true)}>{loc.globalSave}</Button>
    </>;
    
    const deviceConfigCard = <>
        <Card className="sbox border">
            <h3>{loc.ConfDevCardTitle}</h3>
            {deviceConfigForm}
            <Confirmation active={deviceSaveModal}
                confirm={() => { updateDeviceConfig(); setDeviceSaveModal(false); }}
                cancel={() => setDeviceSaveModal(false)}>{loc.UpdateConfigModal}</Confirmation>
        </Card>
    </>;
    
    const sensorConfigForm = <>
        <Form>
            <div className="block">
                <p><label htmlFor="sampling_rate">{loc.ConfSenCardSR}:</label>
                    <input type="number" id="sampling_rate" name="sampling_rate" placeholder={props.configData.SampelingRate + " Millisecond"} autoCapitalize="none" />
                </p>
            </div>
        </Form>
        <Button onClick={() => setSensorSaveModal(true)}>{loc.globalSave}</Button>
    </>;

    const sensorConfigCard = <>
        <Card className="sbox border">
            <h3>{loc.ConfSenCardTitle}</h3>
            {sensorConfigForm}
            <Confirmation active={sensorSaveModal}
                confirm={() => { updateSensorConfig(); setSensorSaveModal(false); }}
                cancel={() => setSensorSaveModal(false)}>{loc.UpdateConfigModal}</Confirmation>
        </Card>
    </>;
    
    const brokerConfigForm = <>
        <Form>
            <p><label htmlFor="broker_status">{loc.ConfBroCardStatus}:</label>
                <input type="checkbox" id="broker_status" name="broker_status" checked={mqttStatus} onChange={()=>setMqttStatus(!mqttStatus)} />
            </p>
            {brokerForm}
        </Form>
        <Button onClick={() => setBrokerSaveModal(true)}>{loc.globalSave}</Button>
    </>;

    const brokerConfigCard = <>
        <Card className="sbox border">
            <h3>{loc.ConfBroCardTitle}</h3>
            {brokerConfigForm}
            <Confirmation active={brokerSaveModal}
                confirm={() => { updateBrokerConfig(); setBrokerSaveModal(false); }}
                cancel={() => setBrokerSaveModal(false)}>{loc.UpdateConfigModal}</Confirmation>
        </Card>
    </>;
    
    page = <>
        <Card className="box">
            {page}
            {deviceConfigCard}
            {sensorConfigCard}
            {brokerConfigCard}
        </Card>
    </>;

    return page;
    
}

ConfigPage.propTypes = {
    configData: PropTypes.object,
};