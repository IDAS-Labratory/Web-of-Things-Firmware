import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {Cpu} from "react-feather";
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";
import {GlobalStyle ,Page ,Navbar, Menubar, Hamburger} from "./components/MainComponents";

import { ConfigPage } from "./components/pages/ConfigPage";
import { DashboardPage } from "./components/pages/DashboardPage";
import { NetworkPage } from "./components/pages/NetworkPage";
import { SettingPage } from "./components/pages/SettingPage";

import {getProfile, getConfigData} from "./apis/api";

const loc = require("./language/en.json");

// Set ESP url for Developing Proccess
let url = "http://192.168.1.90";
if (process.env.NODE_ENV === "production") {url = window.location.origin;}
if (process.env.NODE_ENV === "development") {require("preact/debug");}


function Root() {
    
    const [menu, setMenu] = useState(false);
    const [dashboardData, setDashboardData] = useState(new Object());
    const [dashboardStatusData, setDashboardStatusData] = useState(new Object());
    const [configData, setConfigData] = useState(new Object());
    const [socket, setSocket] = useState({});

    useEffect(() => {
        const ws = new WebSocket(url.replace("http://","ws://").concat("/ws"));
        ws.addEventListener("message", wsMessage);
        setSocket(ws);
        fetchDashboardData();
        fetchConfigData();      
    }, []);

    function wsMessage(event) { 
        const data = JSON.parse(event.data);
        setDashboardStatusData(data);
    }
    
    function fetchDashboardData() {
        getProfile().then(response => {
            setDashboardData(response);
        });
    }

    function fetchConfigData(){
        getConfigData().then((data) => {
            setConfigData(data);
        });
    }
    
    const firmwareName = loc.projectName;

    return <><GlobalStyle />
        <BrowserRouter>
            <Navbar>
                <div className="logo"><Cpu /> {firmwareName}</div>
                <div><Hamburger onClick={() => setMenu(!menu)} /></div>
                <Menubar className={menu ? "" : "menuHidden"}>   
                    <li><NavLink onClick={() => setMenu(false)} exact to="/">{loc.titleDashboard}</NavLink></li>
                    <li><NavLink onClick={() => setMenu(false)} exact to="/network">{loc.titleNetwork}</NavLink></li>
                    <li><NavLink onClick={() => setMenu(false)} exact to="/config">{loc.titleConfiguration}</NavLink></li>
                    <li><NavLink onClick={() => setMenu(false)} exact to="/setting">{loc.titleSetting}</NavLink></li>
                </Menubar>
            </Navbar>
            
            <Page>
                <Switch>
                    <Route exact path="/">
                        <DashboardPage 
                            socket={socket}
                            dashboardData = {dashboardData}
                            dashboardStatusData={dashboardStatusData}
                        />
                    </Route>
                    <Route exact path="/network">
                        <NetworkPage 
                            networkStatus={dashboardStatusData.networkstatus}
                            networkSSID = {dashboardData.networkSSID}
                        />
                    </Route>
                    <Route exact path="/config">
                        <ConfigPage 
                            configData={configData} />
                    </Route>
                    <Route exact path= "/setting">
                        <SettingPage API={url} />
                    </Route>
                </Switch>
            </Page>
        </BrowserRouter>
    </>;

}


ReactDOM.render(
    <Root />, 
    document.getElementById("root"),
);