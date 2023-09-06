class AuthElem extends HTMLElement{
    static get observedAttributes() { return ['name']; }

    constructor(){
        super();
        this.auth0Client = null;
        this.loggedIn = false;
        this.username = "Mehmet Mazi";
        this.shadow = this.attachShadow({mode:"open"});
        this.view();
    }

    view(){
        this.shadow.textContent = '';
        const link = document.createElement('link');
        link.setAttribute('href', "custom-elem-style.css");
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        this.shadow.append(link);
        if (!this.loggedIn){
            const unauthenticated = document.querySelector("#unauthenticated");
            const cloned = unauthenticated.content.cloneNode(true);
            this.shadow.append(cloned);
        } else{
            const authenticated = document.querySelector('#authenticated');
            const cloned = authenticated.content.cloneNode(true);
            cloned.querySelector("#username").textContent = this.username;
            this.shadow.append(cloned);
        }
    }

    toggleLoggedState(){
        this.loggedIn = !this.loggedIn;
        this.view()
    }

    getLoggedState(){
        return this.loggedIn;
    }
    
    attributeChangedCallback(name, oldValue, newValue){
        console.log(name, oldValue, newValue, "ping");
    }
    
}

customElements.define('auth-element', AuthElem);