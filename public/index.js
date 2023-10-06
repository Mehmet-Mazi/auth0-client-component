import { AuthElem } from "./auth-elem.js";

const authElem = document.querySelector('auth-element');
let auth0Client;

async function callApi(){
    try{
        const token = await auth0Client.getTokenSilently(); // Gets the access token or id token?
        const response = await fetch("/api/test", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const responseData = await response.json();
        const responseElement = document.querySelector("#api-call-result");
        responseElement.textContent = JSON.stringify(responseData);
    } catch(e){
        console.log(e)
    }

}

async function renderProfile(){
    const profile = await authElem.getUserData(); // Learn promises, try without await
    authElem.shadow.querySelector('#username').textContent = profile.nickname;
    authElem.shadow.querySelector('img').src = profile.picture
    auth0Client = authElem.state.auth0Client;
}

async function init(){
    // authElem.testVar = 'This is a test var';
    // Use the auth0client as the instantiation?
    renderProfile();
    document.querySelector('#btn-call-api').addEventListener('click', callApi);
};

window.addEventListener('load', init);