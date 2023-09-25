import { AuthElem } from "./auth-elem.js";

async function init(){
    const authElem = document.querySelector('auth-element');
    // console.log(authElem.shadowRoot.querySelector('#sign-up')); // To get items within the shadowDOM
    console.log(authElem.shadowRoot.querySelector('#login'));
    // authElem.shadowRoot.querySelector('#login').addEventListener('click', login);
    
};

window.addEventListener('load', init);