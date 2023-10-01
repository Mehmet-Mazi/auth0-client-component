import { AuthElem } from "./auth-elem.js";

async function init(){
    const authElem = document.querySelector('auth-element');
    authElem.testVar = 'This is a test var';
    console.log(authElem.profile); // Learn promises
    // document.querySelector('#username').textContent = profile.nickname;
};

window.addEventListener('load', init);