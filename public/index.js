import { AuthElem } from "./auth-elem.js";

function login(){
    console.log('click')
}

async function init(){
    const authElem = document.querySelector('auth-element');
    // console.log(authElem.shadowRoot.querySelector('#sign-up')); // To get items within the shadowDOM
    console.log(authElem.shadowRoot.querySelector('#login'));
    // authElem.shadowRoot.querySelector('#login').addEventListener('click', login);
    
    await authElem.configureClient();

    const isAuthenticated = await authElem.state.auth0Client.isAuthenticated();

    if (isAuthenticated) {
        // show the gated content
        return;
    }

    // NEW - check for the code and state parameters
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {

        // Process the login state
        await authElem.state.auth0Client.handleRedirectCallback();

        // Use replaceState to redirect the user away and remove the querystring parameters
        window.history.replaceState({}, document.title, "/");
    }
    
};

window.addEventListener('load', init);