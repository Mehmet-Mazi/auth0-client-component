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
    }

    test(){
        console.log('test')
        console.log(this.testVar);
    }
        
    async getUserData(){
        // console.log(this.isAuthenticated())
        console.log("getUserData called");
        if (await this.isAuthenticated()) return this.state.auth0Client.getUser();
        else return "Not Logged in ";
        // No Longer Needed
        // return new Promise((resolve, reject) => {
        //     document.addEventListener("processed", async () => {
        //         if (await this.isAuthenticated()) resolve(this.state.auth0Client.getUser());
        //         else reject("Not Logged in ")
        //     });
        // })         
    }
    
    async isAuthenticated(){
        if (this.state.auth0Client){
            return await this.state.auth0Client.isAuthenticated();
        }
        return false;
    }

    async fetchAuthConfig(authConfigURL='/auth_config'){
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
            client_id: config.clientId,
            audience: config.audience
        })
        console.log("client configuration setup - ", this.state.auth0Client);
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
        } else{
            const cloned = this.authenticatedTag.content.cloneNode(true);
            cloned.querySelector("#username").textContent = this.username;
            this.shadow.append(cloned);
            this.shadow.querySelector('.logout').addEventListener("click", async () => {
                this.logout()});
        }
    }

    async connectedCallback(){
        await this.configureClient();
        const isAuthenticated = await this.state.auth0Client.isAuthenticated();
        console.log(isAuthenticated) // This is false when the page initially loades because the this.state.auth0client is null at this stage.
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
        this.dispatchEvent(new Event("load")) // Change the name for the event to be something more accurate
    }
}

customElements.define('auth-element', AuthElem);
