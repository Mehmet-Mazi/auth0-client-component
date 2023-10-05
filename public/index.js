import { AuthElem } from "./auth-elem.js";

const authElem = document.querySelector('auth-element');

async function renderProfile(){
    const profile = await authElem.getUserData(); // Learn promises, try without await
    authElem.shadow.querySelector('#username').textContent = profile.nickname;
    authElem.shadow.querySelector('img').src = profile.picture
}

async function init(){
    // authElem.testVar = 'This is a test var';
    renderProfile();
};

window.addEventListener('load', init);