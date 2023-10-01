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
        
        // receive a callback that says something the proxy can detect
        
        // this.setup()
        this.profile;
    }

    test(){
        console.log('test')
        console.log(this.testVar);
    }
    
    async setup(){
        console.log('In setup')
        await this.configureClient();
        const isAuthenticated = await this.state.auth0Client.isAuthenticated();

        if (isAuthenticated) {
            console.log("authenticated content")
            document.querySelector('#gated-content').classList.remove("hidden");
            document.querySelector('#ipt-access-token').textContent = await this.state.auth0Client.getTokenSilently();
            document.querySelector('#ipt-user-profile').textContent = JSON.stringify(await this.state.auth0Client.getUser());
        } else{
            document.querySelector('#gated-content').classList.add('hidden');
        }

        const query = window.location.search;
        if (query.includes("code=") && query.includes("state=")) {

            // Process the login state
            await this.state.auth0Client.handleRedirectCallback();

            this.view()
            // Use replaceState to remove the querystring parameters and so that if the page refreshes for any reason it doesn't request to parse the state and code again
            window.history.replaceState({}, document.title, "/");
        }

        this.profile = await this.getUserData();
        console.log(this.profile)
    }
        
    async getUserData(){
        return await this.state.auth0Client.getUser();
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
        console.log(this.state.auth0Client);
    }

    async login(){
        let authParams = {
                redirect_uri: window.location.origin
        }
        await this.state.auth0Client.loginWithRedirect(authParams);
    }

    async logout(){
        this.state.auth0Client.logout({
            logoutParams: {
              returnTo: window.location.origin
            }
          });
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

    async connectedCallback(){
        await this.setup();
    }
}

customElements.define('auth-element', AuthElem);
