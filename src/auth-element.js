import { AutoRender } from "./Render.js";

class AuthElem extends AutoRender{
    constructor(){
        super();
        this.state.auth0Client = null;
        this.shadow = this.attachShadow({mode:"open"});
    }
        
    async getUserData(){
        if (await this.isAuthenticated()) return this.state.auth0Client.getUser();
        else return "Login Required!";   
    }
    
    async isAuthenticated(){
        if (this.state.auth0Client){
            return await this.state.auth0Client.isAuthenticated();
        }
        return false;
    }

    async fetchAuthConfig(){
        let authConfigURL = '/auth_config';
        if (this.hasAttribute("data-auth-config")) authConfigURL = this.getAttribute("data-auth-config");
        const response = await fetch(authConfigURL);
        if (response.ok){
            return response.json();
        } else {
            throw response;
        }
    }

    async configureClient(){
        try {
            const config = await this.fetchAuthConfig();
            // Initializes the auth0 sdk with the items downloaded from the server
            // This will allow us to create a communication channel with the auth0 
            // domain/application
            this.state.auth0Client = await createAuth0Client({
                domain: config.domain,
                client_id: config.clientId,
                audience: config.audience,
            })
            return [true, null];
        } catch (error) {
            return [false, error];
        }
    }

    async signUp(){
        let authParams = {
            screen_hint: 'signup',
            redirect_uri: this.hasAttribute("data-login-redirect") ? this.getAttribute("data-login-redirect") : window.location.origin
    }
    await this.state.auth0Client.loginWithRedirect(authParams);
    }
    
    async login(){
        let authParams = {
                redirect_uri: this.hasAttribute("data-login-redirect") ? this.getAttribute("data-login-redirect") : window.location.origin
        }
        await this.state.auth0Client.loginWithRedirect(authParams);
    }

    async logout(){
        this.state.auth0Client.logout({
            logoutParams: {
              returnTo: this.hasAttribute("data-login-redirect") ? this.getAttribute("data-login-redirect") : window.location.origin
            }
          });
        }
        

    async render(){
        if (!this.shadow) return null;
        try{
            this.unauthenticatedTemplate = document.querySelector('#unauthenticated');
            this.authenticatedTemplate = document.querySelector('#authenticated');
            
            this.shadow.textContent = '';
            
            const link = document.createElement('link');
            let stylesheet = "auth-element-style";
            if (this.hasAttribute("data-stylesheet")){
                stylesheet = this.getAttribute("data-stylesheet");
            }
            link.setAttribute('href', stylesheet+".css");
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('type', 'text/css');
            this.shadow.append(link);
            
            const isAuthenticated = await this.isAuthenticated();
            if (!(isAuthenticated)){
                const cloned = this.unauthenticatedTemplate.content?.cloneNode(true);
                this.shadow.append(cloned);
                this.shadow.querySelector('[data-login]').addEventListener("click", async () => {
                    this.login()});
                this.shadow.querySelector('[data-signup]').addEventListener("click", async () => {
                    this.signUp()});                
            } else{
                const cloned = this.authenticatedTemplate.content?.cloneNode(true);
                this.shadow.append(cloned);
                this.shadow.querySelector('[data-logout]').addEventListener("click", async () => {
                    this.logout()});
            }
        } catch(e){
            return e;
        }
    }

    async connectedCallback(){
        const success = await this.configureClient();

        if (!success[0]){
            return `failed to connect to server: ${success[1]}`
        }

        const query = window.location.search;
        if (query.includes("code=") && query.includes("state=")) {
            await this.state.auth0Client.handleRedirectCallback();
            window.history.replaceState({}, document.title, "/");
            this.render()
        }
        this.dispatchEvent(new Event("load"))
    }
}

customElements.define('auth-element', AuthElem);
