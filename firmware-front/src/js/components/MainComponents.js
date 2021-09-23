import React from "react";
import styled, { createGlobalStyle, css } from "styled-components";
import { normalize } from "styled-normalize";
import { Loader, Menu as MenuIcon } from "react-feather";
import PropTypes from "prop-types";

const loc = require("./../language/en.json");

export const cPrimary = "#0055ff"; 
export const cPrimaryHover = "#0066ee"; 
export const cHeader = "#111";
export const cHeaderHover = "#333"; 
export const cSecondary = "#ff00cc";
export const cSecondaryHover = "#cc0099"; 

//Defining Components
export const GlobalStyle = createGlobalStyle`
  
    ${normalize}

    body {
        background-color: #F5F5F5;
        font-size:1.1em;
        line-height:1.4em;

        @media (max-width: 500px) 
        { 
            font-size:1em;
        }
    }

    * {
        
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: Poppins ,Arial, sans-serif;
    }

    a {
        color: red;
        text-decoration: none;
        cursor:pointer;
    
        &:hover {
            
        }
    }

    label > svg, button > svg, h1 > svg {
        width:0.9em;
        height:0.9em;
        vertical-align: -0.05em;
    }

    label {
        @media (max-width: 760px) {
            display: block !important;
            max-width: initial !important;
        }
    }
`;

const NavbarSrc = ({className, children}) => (
    <nav className={className}>{children}</nav>
);

NavbarSrc.propTypes = {
    className: PropTypes.string,
    children: PropTypes.any,
};

export const Navbar = styled(NavbarSrc)`
    display: flex;
    height: 80px;
    width: 100%;
    background: #1b1b1b;
    align-items: center;
    justify-content: space-between;
    padding: 0 50px 0 100px;
    flex-wrap: wrap;
    margin-bottom: 50px;

    .logo{
        color: #fff;
        font-size: 35px;
        font-weight: 600;
        margin-left: -40px;

      }
`;

export const Menubar = styled.ul`
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    margin: auto 10px;

    li{
        margin: 0 5px;
      }
    li a{
        color: #cacaca;
        text-decoration: none;
        font-size: 18px;
        font-weight: 500;
        padding: 8px 10px;
        border-radius: 20px;
        letter-spacing: 1px;
        transition: all 0.3s ease;
      }
    
    li a.active,
    li a:hover{
        text-decoration: underline;
        color: white;
      }

      @media (max-width: 1024px) 
      {   
          display:block;
          width:100%;
          background-color:#444;
          margin:0px -1em;
          padding:0em 1em;    
  
          a {
              display:block;
              line-height:3.5em;
              margin:0px -1em;
              padding:0px 1em;
              border-radius:0;
              width:100%;
          }
  
          a.active {
              background-color:#555;
              color:#fff;
          }
  
          &.menuHidden 
          {
              display:none;
          }
      }
`;

const HamburgerSrc = ({ className, onClick }) => (
    <a onClick={onClick} className={className}><MenuIcon /></a>
);

HamburgerSrc.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
};

export const Hamburger = styled(HamburgerSrc)`
    display:none;
    margin-right:0px !important;
    
    svg 
    {
        color: white;
        width: 3em;
        height: 4em;
        vertical-align: -0.25em;
    }

    @media (max-width: 1024px) 
    {    
        display:inline;
    }

`;

export const SetupButton = styled.a`
    a:link, a:visited {
        
        color: black;    
        background-color: #cacaca;
        text-decoration: none;
        text-align: center;
        font-size: 17px;
        font-weight: 550;
        padding: 8px 20px;
        border-radius: 20px;
        letter-spacing: 0.5px;
        margin-left:40px;
        
    }

    a.active,
    a:hover{
        background-color: white;
      }
    @media (max-width: 1024px) 
      {    
          display:inline;
          font-size: 17px;
          font-weight: 550;
          padding: 8px 20px;
      }
`;

export const Page = styled.div`
        margin:0px auto;
        padding:0em 1em;
        max-width:1024px;
        clear:both;
`;

export const CardContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const CardSrc = ({className, children}) => (
    <div className={className}>{children}</div>
);

CardSrc.propTypes = {
    className: PropTypes.string,
    children: PropTypes.any,
};

export const Card = styled(CardSrc)`
    &.box{
        background-color: white;
        border-radius: 8px;
        padding: 30px;
        margin: 20px;
        width: 100%; 
    }
    &.border {
        border-top: 3px solid #d7d7d7;
      }

    &.cyanBox {
        border-top: 3px solid cyan;
        background-color: #f5feff;
      }
    &.redBox {
        border-top: 3px solid red;
        background-color: #fff5f5;
      }
    &.blueBox {
        border-top: 3px solid blue;
        background-color: #f5f6ff;
      }
    &.orangeBox {
        border-top: 3px solid orange;
        background-color: #fffbf5;
      }
    
   label {
        display: inline-block;
        min-width: 150px;
        max-width: 170px;
        padding-right:1em;
        margin-top: 10px;
   }
   &.sbox {
    display: block;    
    padding: 30px;
    margin: 20px 0px 0px 0px;
   }
`;

export const FUCard = styled.div`

    border-radius:5px;
    border:1px solid #ddd;
    box-shadow:0px 0px 4px #eee;
    padding:2em;
    margin-bottom:1em;

    @media (max-width: 500px) 
    { 
        padding:1em;
    }

`;

export const Form = styled.form` 
    margin-top: 20px; 
    margin-bottom: 20px;
    
    .flex {
        display: flex;
        justify-content: center;
        align-items: center;
        
    }

    .block {
        display: block;
    }

    label {
        display: inline-block;
        min-width: 150px;
        max-width: 170px;
        padding-right:1em;
        margin-top: 10px;
    }

    select,
    input[type=password],
    input[type=number],
    input[type=checkbox],
    input[type=text] {
        
        border-radius: 7px;
        width:290px;
        max-width:50%;
        box-sizing: border-box;
        margin-bottom: 10px;
        padding:0.3em;    
    }

    input[type=checkbox] {
        width: 1rem;
        margin:20px 0px;
    }
`;

export const List = styled.ul`
    margin: 10px; 
    list-style: none;

    label {
        display: inline-block;
        min-width: 150px;
        max-width: 170px;
        padding-right:1em;
        margin-top: 10px;
    }

`;

export const buttonStyle = css` 
    
    float: right;
    margin: auto;
    background-color: #323781;
    color:#fff;
    border:none;
    width: 10rem;
    padding:10px; 
    border-radius: 5px;
    cursor:pointer;

    &:hover {
        background-color: #484da1;
    }

    &.delete{
        background-color:#cc2200;
        margin-right: 5px;
        width: 40px;

        :hover {
            background-color:#bb3300;
        }
    }

    &.download{
        background-color:#1957ff;
        margin-right: 5px;
        width: 40px;

        :hover {
            background-color:#3269ff;
        }
    }

    &.reset{
        background-color:#e60000;
        margin-right:10px;
        width: 160px;
        height: 40px;
        
        :hover {
            background-color:#e62b2b;
        }    
    
    }

    &.restart{
        background-color:#e86500;
        width: 160px;
        height: 40px;
        
        :hover {
            background-color:#f2832f;
        }
        
    }
    

`;

export const Button = styled.button` 
    ${buttonStyle}
`;

export const DisabledButton = styled.button`
        ${buttonStyle}
        cursor:not-allowed;
        background-color:#bbddff;
        :hover {
            background-color:#bbddff;
        }
`;

const modal = css`
    position:absolute;
    width:100%;
    height:100%;
    top:0px;
    left:0px;
    z-index:0;
    background-color:#000000e0;

    div:first-child {
        border-radius:6px;
        text-align:center;
        position:relative;
        max-width:calc(100vw - 100px);
        width:400px;
        background-color:#fff;
        padding:1em;
        top:20vh;
        margin:0px auto;
        box-shadow: 0px 0px 50px;

        p {
            margin-top: 0px;
            padding: 1em 0em;
        }

        div {
            display:flex;
            justify-content:flex-end;    
            align-items: flex-end;

            Button {
                width: 20em;
                margin-left:0.4em;
                margin-right:0.6em;
                padding: 0.5em;
            }
        }
    }
`;

const ConfirmationSrc = ({ active, confirm, cancel, className, children }) => (
    active ? <div className={className}
        onClick={() => cancel()}>
        <div onClick={(e) => e.stopPropagation()}><p>{children}</p>
            <div>
                <CancelButton onClick={() => cancel()}>{loc.globalCancel}</CancelButton>
                <Button onClick={() => confirm()}>{loc.globalContinue}</Button>
            </div>
        </div>
    </div> : ""
);

ConfirmationSrc.propTypes = {
    active: PropTypes.bool,
    confirm: PropTypes.func,
    cancel: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.any,
};

export const Confirmation = styled(ConfirmationSrc)`
    ${modal}
`;

const AlertSrc = ({ active, confirm, className, children }) => (
    active ? <div className={className}
        onClick={() => confirm()}>
        <div onClick={(e) => e.stopPropagation()}><p>{children}</p>
            <div>
                <Button onClick={() => confirm()}>{loc.globalOk}</Button>
            </div>
        </div>
    </div> : ""
);

AlertSrc.propTypes = {
    active: PropTypes.bool,
    confirm: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.any,
};

export const Alert = styled(AlertSrc)`
    ${modal}
`;

export const CancelButton = styled(Button)` 
    color:#cc2200;
    background-color:#fff;
    border:1px solid #cc2200;

    :hover {
        color:#bb3300;
        background-color:#ffeeee;
        border:1px solid #bb3300;
    }
`;

export const Spinner = styled(Loader)`    
    
    animation-name: spin;
    animation-duration: 3000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear; 

    @keyframes spin {
        from {
            transform:rotate(0deg);
        }
        to {
            transform:rotate(360deg);
        }
    }
`;

export const Live = styled.span`
    color:#5ee052;
    border: 1px solid #c4e052;
    background-color:#e6f9b8;     
    border-radius:5px;
    font-size:0.5em !important;  
    padding:0.2em; 
    vertical-align:0.3em;
`;

export const Connecting = styled.span`
    color:#b5b8b5;
    border: 1px solid #ddd;
    background-color:#f4f4f4;
    border-radius:5px;
    font-size:0.5em !important;
    padding:0.2em;
    vertical-align:0.3em;
`;

export const Disconnected = styled.span`
    color:#e90a0a;
    border: 1px solid #ff3333;
    background-color:#ffb3b3;
    border-radius:5px;
    font-size:0.5em !important;
    padding:0.2em;
    vertical-align:0.3em;
`;

export const Flex = styled.div`
    display:flex;
    margin-bottom: 20px;
    justify-content:space-between;  
    align-items: center;
`;

export const WizardBox = styled.div`

    text-align:center;
    
    Button {
        display: block;
        align-items: center;
    }
`;

export const Wizard = styled(Flex)`
    
    h3 {
        margin-top:20px;
        width:32%;
        padding-bottom:0.3em;
        border-bottom:3px solid #000;

        svg {
            float:right;
        }
    }
    
    .active {
        color: ${cSecondary};
        border-color: ${cSecondary};
    }

    @media (max-width: 750px) 
    {
        flex-wrap:wrap;
        h3 
        {
            width:100%;
        }
    }
`;

export const FileLine = styled(Flex)`
    padding:0.35em 0em;
    border-bottom:1px solid #ddd;
    
    :last-child 
    {
        border-bottom:0px;
    }

    &.selectable {
        span {
            text-decoration:underline;
        }
        cursor:pointer;
        padding-left:0.35em;
        padding-right:0.35em;
    }

    &.selectable:hover {
        background-color:#ff00cc11;
    }

    span
    {
        margin-left:0.6em;
    }

    Button
    {
        padding:0.4em 0.5em;        
    }

    div:first-child
    {
        padding:0.4em 0em;
    }

    svg 
    {
        vertical-align: -0.15em;
    }

    @media (max-width: 500px) 
    {
        flex-wrap:wrap;
        div:first-child {
            width:100%;
            margin-bottom:0.4em;
        }
    }
`;

export function Fetch(props) {
    return <span onClick={(e) => {
        e.stopPropagation();
        if (typeof props.POST !== undefined) {
            fetch(props.href,
                {
                    method: "POST",
                })
                .then((response) => { return response.status; })
                .then((status) => { 
                    if (status == 200) {
                        if (typeof props.onFinished === "function") {props.onFinished();}
                    } 
                });
        } else {
            fetch(props.href)
                .then((response) => { return response.status; })
                .then((status) => {
                    if (status == 200) {
                        if (typeof props.onFinished === "function") { props.onFinished(); }
                    }
                });  
        }
    }}>{props.children}</span>;
}

Fetch.propTypes = {
    href: PropTypes.string,
    POST: PropTypes.bool,
    onFinished: PropTypes.func,
    children: PropTypes.any,
};