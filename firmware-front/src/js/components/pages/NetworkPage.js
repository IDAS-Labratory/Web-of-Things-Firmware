import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Wifi, Lock, Server,Globe , CornerDownRight } from "react-feather";
import { Card, Form, List, Button, Confirmation, Spinner } from "../MainComponents";


import {postNetworkForget, postChangeNetwork, postChangeStaticNetwork} from "../../apis/api";

const loc = require("../../language/en.json");


export function NetworkPage(props) {
    const [forgetModal, setForgetModal] = useState(false);
    const [saveModal, setSaveModal] = useState(false);
    const [staticForm, setStaticForm] = useState(false);

    useEffect(() => {
        document.title = loc.titleNetwork;
    }, []);

    function changeNetwork() {    
        if (!staticForm){
            const body = JSON.stringify({
                ssid: String(document.getElementById("ssid").value.trim()),
                pass: String(document.getElementById("pass").value.trim()),
            });

            postChangeNetwork(body);
        } else {
            const body = JSON.stringify({
                ssid: String(document.getElementById("ssid").value.trim()),
                pass: String(document.getElementById("pass").value.trim()),
                ip: String(document.getElementById("ip").value.trim()),
                subnet: String(document.getElementById("sub").value.trim()),
                gateway: String(document.getElementById("gw").value.trim()),
                dns: String(document.getElementById("dns").value.trim()),
            });
            
            postChangeStaticNetwork(body);
            
            // Claering Inputs values
            document.getElementById("ip").value = "";
            document.getElementById("gw").value = "";
            document.getElementById("sub").value = "";
            document.getElementById("dns").value = "";
            setStaticForm(false);
        }
        document.getElementById("ssid").value = "";
        document.getElementById("pass").value = "";        
    }


    let staticIPForm = <></>;

    if (staticForm) {
        staticIPForm = <>
            <p><label htmlFor="ip"><CornerDownRight /> {loc.wifiIP}:</label>
                <input type="text" id="ip" name="ip" autoCapitalize="none" />
            </p>
            <p><label htmlFor="sub"><CornerDownRight /> {loc.wifiSub}:</label>
                <input type="text" id="sub" name="sub" autoCapitalize="none" />
            </p>
            <p><label htmlFor="gw"><CornerDownRight /> {loc.wifiGW}:</label>
                <input type="text" id="gw" name="gw" autoCapitalize="none" />
            </p>
            <p><label htmlFor="dns"><CornerDownRight /> {loc.wifiDNS}:</label>
                <input type="text" id="dns" name="dns" autoCapitalize="none" />
            </p>
        </>;
    }    

    const form = <><Form>
        <div>
            <p><label htmlFor="ssid"><Wifi /> {loc.wifiSSID}:</label>
                <input type="text" id="ssid" name="ssid" autoCapitalize="none" />
            </p>
            <p><label htmlFor="pass"><Lock /> {loc.wifiPass}:</label>
                <input type="password" id="pass" name="pass" autoCapitalize="none" />
            </p>
        </div> 
        <p><label htmlFor="StaticIP"><Server /> {loc.wifiDHCP}:</label>
            <input type="checkbox" id="StaticIP" name="StaticIP" checked={!staticForm} onChange={()=>setStaticForm(!staticForm)} />
        </p>
        {staticIPForm}
    </Form>
    <Button onClick={() => setSaveModal(true)}>{loc.globalSave}</Button>
    </>;
    
    let page = <>
        <h2>{loc.titleNetwork}</h2>
    </>;
    
    let connectedTo;
    if (props.networkStatus === false) {
        connectedTo = loc.wifiCP;
    } else if (props.networkStatus === true) {
        connectedTo = <> <Globe style={{verticalAlign:"-0.25em"}}/> {loc.wifiConn} {props.networkSSID} (<a onClick={() => setForgetModal(true)}>{loc.wifiForget}</a>)</>;
    }

    const statusCard = <>
        <Card className="sbox border">
            <h3>{loc.NetConCardTitle}</h3>
            <List>
                <li>{connectedTo == null ? <Spinner style={{verticalAlign:"-0.25em"}}/> : connectedTo}</li>
            </List>
        </Card>
    </>;

    const wifiUpdateCard = <>
        <Card className="sbox border">
            <h3>{loc.NetUpCardTitle}</h3> 
            {form}
            <Confirmation active={forgetModal}
                confirm={() => { postNetworkForget() ; setForgetModal(false); }}
                cancel={() => setForgetModal(false)}>{loc.wifiModal1}
            </Confirmation>
            
            <Confirmation active={saveModal}
                confirm={() => { changeNetwork(); setSaveModal(false); }}
                cancel={() => setSaveModal(false)}>{loc.wifiModal2}
            </Confirmation>
        </Card>
    </>;
    
    page = <> 
        <Card className="box">
            {page}
            {statusCard} 
            {wifiUpdateCard}
        </Card>
    </>;
    
    return page;
}

NetworkPage.propTypes = {
    networkStatus: PropTypes.bool,
    networkSSID: PropTypes.string,
};
