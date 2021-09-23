import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { FileListing } from "./FileListing";  

const loc = require("../../language/en.json");

export function FilePage(props) {

    useEffect(() => {
        document.title = loc.titleFile;
    }, []);

    return <><h2>{loc.titleFile}</h2><FileListing API={props.API} /></>;
    
}

FilePage.propTypes = {
    API: PropTypes.string,
};

