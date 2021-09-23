import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

import { getFile } from "../../apis/api";

import { File, Trash2, Download } from "react-feather";
import {Fetch, FileLine ,Flex, Button, buttonStyle, Alert, Spinner } from "../MainComponents";

const loc = require("../../language/en.json");


export function FileListing(props) {
    const [state, setState] = useState({ files: [], used: 0, max: 0});

    useEffect(() => {
        fetchFile();
    }, []);

    function fetchFile() {
        getFile().then(data => {
            setState(data);
        });
    }

    let list;
        
    if (state.max > 0) {
        let filtered = 0;
        for (let i = 0; i < state.files.length; i++) {
            if (typeof props.filter === "undefined"
                || state.files[i].substr(state.files[i].length - (props.filter.length + 1)) == `.${props.filter}`) {filtered++;}
        }

        if (filtered == 0) {
            list = <FileLine><div>{loc.filesEmpty}</div></FileLine>;
        } else {
            for (let i = 0; i < state.files.length; i++) {
                if (typeof props.filter === "undefined" ||
                    state.files[i].substr(state.files[i].length - (props.filter.length + 1)) == `.${props.filter}`) {       
                    const name = state.files[i];         
                    list = <>{list}                        
                        <FileLine className={props.selectable ? "selectable" : ""} onClick={() => {if (typeof props.onSelect !== "undefined") {props.onSelect(name);}}}>
                            <div><File /><span>{state.files[i]}</span></div>
                            <div>
                                <a href={`${props.API}/download/${state.files[i]}`} rel="noreferrer" target="_blank" onClick={(e) => { e.stopPropagation();}}>
                                    <Button className="download" title={loc.filesDl}><Download /></Button>
                                </a>                
                                <Fetch href={`${props.API}/api/files/remove?filename=${state.files[i]}`} POST onFinished={fetchFile}>
                                    <Button className="delete" title={loc.filesRm} ><Trash2 /></Button>
                                </Fetch>   
                            </div>
                        </FileLine></>;
                }
            }   
        }  
    } else {
        list = <FileLine><div><Spinner /></div></FileLine>;
    }


    let header;
    if (props.selectable) {
        header = loc.filesFwTitle + ":";
    } else {
        header = loc.filesTitle;
    }

    return <><Flex>
        <div><Upload action={`${props.API}/upload`} onFinished={fetchFile} filter={props.filter} /></div>
        {parseInt(state.max) > 0 ? <div>{Math.round(state.used / 1000)} / {Math.round(state.max / 1000)} kB {loc.filesUsed}</div> : ""}
    </Flex><h3>{header}</h3>{list}</>;
    
}

FileListing.propTypes = {
    API: PropTypes.string,
    onSelect: PropTypes.func,
    filter: PropTypes.string,
    selectable: PropTypes.bool,
};


function Upload(props) {
    const [state, setState] = useState("");

    let status;
    if (state == "busy") {status = <><Spinner /></>;} else {status = <>{loc.filesBtn}</>;}

    const render =
        <><form action={props.action} method="post" name="upload" encType="multipart/form-data">
            <FileLabel id="uploadLabel" className={state}>{status}<input type="file" id="file"
                onClick={(e) => {
                    if (state == "busy") {
                        e.preventDefault();
                    }
                }}
                onChange={(e) => {
                    const form = document.forms.namedItem("upload");
                    const files = e.target.files;
                    const formData = new FormData();

                    if (files.length > 0) {
                        if (typeof props.filter === "undefined"
                            || files[0].name.substr(files[0].name.length - (props.filter.length + 1)) == `.${props.filter}`) {
                            setState("busy");

                            formData.append("myFile", files[0]);

                            fetch(form.action, {
                                method: "POST",
                                body: formData,
                            }).then((response) => { return response.json(); })
                                .then((data) => {
                                    if (data.success == true) {
                                        setState("ok");
                                        props.onFinished();
                                    } else {
                                        setState("nok");
                                    }
                                });
                        } else {
                            setState("wrongtype");
                        }

                    }
                }} />
            </FileLabel>
        </form>
        <Alert active={state == "nok"}
            confirm={() => setState("")}>
            {loc.filesMsg1}</Alert>
        <Alert active={state == "wrongtype"}
            confirm={() => setState("")}>
            {loc.filesMsg2} (.{props.filter})</Alert>
        </>;

    return render;
}

const FileLabel = styled.label`
    ${buttonStyle}  

    display:inline-block;
    width:100px;
    text-align:center;
    
    @media (max-width: 500px) 
    {
        width:90px; 
    }

    &.busy 
    {
        cursor: default;
        :hover
        {
            background-color: blue;
        }
    }

    svg {
        width:1.2em;
        height:1.2em;
        vertical-align:-0.25em;
    }

    input[type="file"] {
        display: none;
    } 
`;