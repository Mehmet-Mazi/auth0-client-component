// import { createAuth0Client } from '@auth0/auth0-spa-js';

class AuthElem extends HTMLElement{
    constructor(){
        super();
        let loggedIn = true;
        let username = "Mehmet Mazi";
        const shadow = this.attachShadow({mode:"open"});
        const link = document.createElement('link');
        link.setAttribute('href', "custom-elem-style.css");
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        shadow.append(link);
        if (!loggedIn){
            const unauthenticated = document.querySelector("#unauthenticated");
            const cloned = unauthenticated.content.cloneNode(true);
            shadow.append(cloned);
        } else{
            const authenticated = document.querySelector('#authenticated');
            const cloned = authenticated.content.cloneNode(true);
            cloned.querySelector("#username").textContent = username;
            shadow.append(cloned);
        }
       
    }
}

customElements.define('auth-element', AuthElem);