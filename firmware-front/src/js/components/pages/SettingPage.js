import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Zap, Power, RefreshCcw, Repeat} from "react-feather";

import { Card, FUCard, Flex, WizardBox,Wizard, Button, DisabledButton, Confirmation, Alert, Spinner } from "../MainComponents";

import { FileListing } from "./FileListing";

import { postReset, postRestart, getUpdateStatus, postFlashRequest } from "../../apis/api";

const loc = require("../../language/en.json");

export function SettingPage(props) {

    useEffect(() => {
        document.title = loc.titleSetting;
    }, []);

    const [state, setState] = useState(1);
    const [filename, setFilename] = useState("");
    const [modal, setModal] = useState(false);
    const [restart, setRestart] = useState(false);
    const [reset, setReset] = useState(false);
    const [failed, setFailed] = useState(false);
    const [busy, setBusy] = useState(false);

    function pollStatus() {
        getUpdateStatus()
            .then((data) => {
                if (data.status == 1) {
                    setBusy(false);
                    setState(3);
                } else if (data.status == 254) {
                    setTimeout(pollStatus,2000);
                } else {
                    setBusy(false);
                    setState(1);
                    setFailed(true);
                }
            });      
    }

    function startFlashing() {
        postFlashRequest(filename)
            .then((status) => {
                if (status == 200) {
                    setBusy(true);
                    pollStatus();                                        
                }                    
            });
    }

    let step;
    let buttons;
    if (state == 2) {        
        if (!busy) {
            buttons = <Flex><Button onClick={() => setState(1)}>{loc.globalBack}</Button><Button onClick={() => setModal(true)}>{loc.fwBtn}</Button></Flex>;
            step = <WizardBox><h1><Zap /></h1><p>{loc.fwStep1a_preFilename} <b>{filename}</b> {loc.fwStep1b_postFilename}</p></WizardBox>;
        } else {
            buttons = <Flex><DisabledButton>{loc.globalBack}</DisabledButton><DisabledButton>{loc.fwBtn}</DisabledButton></Flex>;
            step = <WizardBox><h1><Spinner /></h1><p>{loc.fwStep2a_preFilename} <b>{filename}</b> {loc.fwStep2b_postFilename}</p><p><small>{loc.fwStep2c}</small></p></WizardBox>;
        }
    } else if (state == 3) {
        step = <WizardBox><h1><Power /></h1>
            <p>{loc.fwStep3a_preFilename} 
                <b>{filename}</b>  
                {loc.fwStep3b_postFilename}
            </p>
            <p>{loc.fwStep3c}</p>            
        </WizardBox>;
        buttons = <Button onClick={() => setState(1)}>{loc.globalFinish}</Button>;
    } else {step = <FileListing API={props.API} selectable={true} onSelect={(name) => {setFilename(name);setState(2);}} filter="bin" />;}
    
    const firmwareUpdateCard = <>
        <Card className="sbox border">
            <h3>{loc.SetUpgCardTitle}</h3>
            <Wizard>
                <h3 className={state == 1 ? "active" : ""}>1. {loc.fwSelect}</h3>
                <h3 className={state == 2 ? "active" : ""}>2. {loc.fwFlash}</h3>
                <h3 className={state == 3 ? "active" : ""}>3. {loc.fwReboot}</h3>
            </Wizard>

            <FUCard>
                {step}
            </FUCard>

            {buttons}

            <Confirmation active={modal}
                confirm={() => { setModal(false);startFlashing(); }}
                cancel={() => setModal(false)}>{loc.fwModal1}</Confirmation>

            <Alert active={failed}
                confirm={() => setFailed(false)}>
                {loc.fwModal2}
            </Alert>

        </Card>
    </>;

    const resetCard = <>
        <Card className="sbox border">
            <h3>{loc.SetRstCardTitle}</h3>
            <Button className="restart" id="reset_button" name="reset_button" onClick={() => {setRestart(true);}
            }><RefreshCcw /> {loc.RestartBtn}</Button>
           
            <Confirmation active={restart}
                confirm={() => { setRestart(false); postRestart(); }}
                cancel={() => setRestart(false)}>{loc.RestartModal}
            </Confirmation>

            <Button className="reset" onClick={() => {setReset(true);}
            }><Repeat /> {loc.ResetBtn}</Button>
            
            <Confirmation active={reset}
                confirm={() => { setReset(false); postReset(); }}
                cancel={() => setReset(false)}>{loc.ResetModal}
            </Confirmation>
        </Card>
    </>;
    
    const page = <>
        <Card className="box">
            <h2>{loc.titleSetting}</h2>
            {firmwareUpdateCard}
            {resetCard}
        </ Card>
    </>;

    return page;
}

SettingPage.propTypes = {
    API: PropTypes.string,
};

