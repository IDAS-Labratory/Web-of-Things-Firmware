import axios from "axios";

let url = "http://192.168.1.90";
if (process.env.NODE_ENV === "production") {url = window.location.origin;}
if (process.env.NODE_ENV === "development") {require("preact/debug");}


export function optionIndex() {
    return axios.options(url + "/api/index")
        .then(response => response.data);
}

export function getProfile() {
    return axios.get(url + "/api/dashboard/get")
        .then(response => response.data);
}

export function getNetworkStatus() {
    return axios.get(url + "/api/network/get")
        .then(response => response.data);
}

export function postNetworkForget() {
    return axios.post(url + "/api/network/forget")
        .then(response => response.data);
}

export function postChangeNetwork(body) {
    return axios.post(url + "/api/network/set", body, {
        headers: {
            "Content-Type": "application/json",  
        },
    }).then(response => { 
        if (response.data.status !== "successed"){
            throw new Error(`ESP responed with error. Error message is: ${response.data.message}`);
        }
        return response.data;
    });
}

export function postChangeStaticNetwork(body) {
    return axios.post(url + "/api/network/setStaticIP", body, {
        headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
        },
    }).then(response => { 
        if (response.data.status !== "successed"){
            throw new Error(`ESP responed with error. Error message is: ${response.data.message}`);
        }
        return response.data;
    });
}

export function getConfigData(){
    return axios.get(url + "/api/config/get")
        .then(response => response.data);
}

export function postDeviceConfigData(body){
    return axios.post(url + "/api/config/device/set", body, {
        headers: {
            "Content-Type": "application/json",  
        },
    }).then(response => { 
        if (response.data.status !== "successed"){
            throw new Error(`ESP responed with error. Error message is: ${response.data.message}`);
        }
        return response.data;
    });
}

export function postDeviceStaticConfigData(body){
    return axios.post(url + "/api/config/device/setStatic", body, {
        headers: {
            "Content-Type": "application/json",  
        },
    }).then(response => { 
        if (response.data.status !== "successed"){
            throw new Error(`ESP responed with error. Error message is: ${response.data.message}`);
        }
        return response.data;
    });
}

export function postSensorConfigData(body){
    return axios.post(url + "/api/config/sensor/set", body, {
        headers: {
            "Content-Type": "application/json",  
        },
    }).then(response => { 
        if (response.data.status !== "successed"){
            throw new Error(`ESP responed with error. Error message is: ${response.data.message}`);
        }
        return response.data;
    }); 
}

export function postBrokerConfigData(body){
    return axios.post(url + "/api/config/broker/set", body, {
        headers: {
            "Content-Type": "application/json",  
        },
    }).then(response => { 
        if (response.data.status !== "successed"){
            throw new Error(`ESP responed with error. Error message is: ${response.data.message}`);
        }
        return response.data;
    }); 
}

export function postRestart() {
    return axios.post(url + "/api/restart")
        .then(response => response.data);
}

export function postReset() {
    return axios.post(url + "/api/reset")
        .then(response => response.data);
}

export function getFile() {
    return axios.get(url + "/api/files/get")
        .then(response => response.data);
}

export function postFile() {
    return axios.get(url + "/api/files/get")
        .then(response => response.data);
}

export function getUpdateStatus() {
    return axios.get(url + "/api/update-status")
        .then(response => response.data);
}

export function postFlashRequest(filename) {
    return axios.post(url + `/api/update?filename=${filename}`)
        .then(response => response.status);
}