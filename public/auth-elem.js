import { Component } from "./Render.js";

export class AuthElem extends Component{
    // static get observedAttributes() { return ['auth0Client', 'username', 'random']; } // Doesn't work for object properties

    constructor(){
        super();
        this.state.auth0Client = null;
        this.shadow = this.attachShadow({mode:"open"});
        // this.useState = new state(this, this.auth0Client); // Pass this so  that we can call the render method in this class
        // this.state = {username: "Mehmet Mazi"};
        // this.set();
        this.state.location = 'london'
        console.log(this.state.location)
    }

    async view(){

        console.log("Updated UI", this.shadow.shadowRoot);
        this.shadow.shadowRoot.textContent = '';
        const link = document.createElement('link');
        link.setAttribute('href', "custom-elem-style.css");
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        this.shadow.shadowRoot.append(link);
        
        const authentication = await this.getLoggedState();
        console.log(authentication)
        if (!(authentication)){
            const unauthenticated = document.querySelector("#unauthenticated");
            const cloned = unauthenticated.content.cloneNode(true);
            this.shadow.shadowRoot.append(cloned);
        } else{
            const authenticated = document.querySelector('#authenticated');
            const cloned = authenticated.content.cloneNode(true);
            cloned.querySelector("#username").textContent = this.username;
            this.shadow.shadowRoot.append(cloned);
        }
    }
    
    async getLoggedState(){
        console.log(await this.state.auth0Client.isAuthenticated());
        return await this.state.auth0Client.isAuthenticated();
    }

    async fetchAuthConfig(authConfigURL='/auth_config.json'){
        const response = await fetch(authConfigURL);
        if (response.ok){
            return response.json();
        } else {
            throw response;
        }
    }

    async configureClient(){
        const config = await this.fetchAuthConfig();
        // Initializes the auth0 sdk with the items downloaded from the server
        // This will allow us to create a communication channel with the auth0 
        // domain/application
        this.state.auth0Client = await createAuth0Client({
            domain: config.domain,
            clientId: config.clientId
        })
        // console.log(this.auth0Client);
        // this.view()
    }
    
}

customElements.define('auth-element', AuthElem);