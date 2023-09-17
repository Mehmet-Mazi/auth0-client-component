import { AuthElem } from "./auth-elem.js";

async function init(){
    const authElem = document.querySelector('auth-element');
    // console.log(authElem.shadowRoot.querySelector('#sign-up')); // To get items within the shadowDOM
    await authElem.configureClient();
    
}

window.addEventListener('load', init);