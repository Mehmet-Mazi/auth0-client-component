import { Component } from "./Render.js";

export class AuthElem extends Component{
    // static get observedAttributes() { return ['auth0Client', 'username', 'random']; } // Doesn't work for object properties

    constructor(){
        super();
        this.state.auth0Client = null;
        this.shadow = this.attachShadow({mode:"open"}); // Sets and returns this.shadowRoot
        // this.useState = new state(this, this.auth0Client); // Pass this so  that we can call the render method in this class
        this.unauthenticatedTag = document.querySelector('#unauthenticated');
        this.authenticatedTag = document.querySelector('#authenticated');
        
        this.setup();

    }

    async setup(){
        await this.configureClient();

        const isAuthenticated = await this.state.auth0Client.isAuthenticated();
        console.log(isAuthenticated)
        if (isAuthenticated) {
            // show the gated content
            this.view()
            return;
        }

        // NEW - check for the code and state parameters
        const query = window.location.search;
        if (query.includes("code=") && query.includes("state=")) {

            // Process the login state
            await this.state.auth0Client.handleRedirectCallback();

            // Use replaceState to redirect the user away and remove the querystring parameters
            window.history.replaceState({}, document.title, "/");
        }
        
    }
        
    async view(){
        if (!this.shadow) return null;
        // console.log("Updated UI", this.shadow);
        this.shadow.textContent = '';
        const link = document.createElement('link');
        link.setAttribute('href', "custom-elem-style.css");
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        this.shadow.append(link);
        
        const isAuthenticated = await this.isAuthenticated();
        if (!(isAuthenticated)){
            const cloned = this.unauthenticatedTag.content.cloneNode(true);
            this.shadow.append(cloned);
            this.shadow.querySelector('#login').addEventListener("click", async () => {
                this.login()});
            console.log(this.shadow.querySelector('#login'));
        } else{
            const cloned = this.authenticatedTag.content.cloneNode(true);
            cloned.querySelector("#username").textContent = this.username;
            this.shadow.append(cloned);
            this.shadow.querySelector('.logout').addEventListener("click", async () => {
                this.logout()});
        }
    }
    
    async isAuthenticated(){
        if (this.state.auth0Client){
            return await this.state.auth0Client.isAuthenticated();
        }
        return false;
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
            client_id: config.clientId
        })
        // console.log(this.state.auth0Client);
    }

    async login(){
        let authParams = {
                redirect_uri: window.location.origin
        }
        // authParams = JSON.stringify(authParams);
        await this.state.auth0Client.loginWithRedirect(authParams);
    }

    async logout(){
        this.state.auth0Client.logout({
            logoutParams: {
              returnTo: window.location.origin
            }
          });
    }
    
}

customElements.define('auth-element', AuthElem);