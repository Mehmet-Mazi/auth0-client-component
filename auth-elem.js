console.log("loaded")
class AuthElem extends HTMLElement{
    constructor(){
        super();
        let loggedIn = true;
        let username = "Mehmet Mazi";
        const shadow = this.attachShadow({mode:"closed"});
        const link = document.createElement('link');
        link.setAttribute('href', "style.css");
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        shadow.append(link);
        if (!loggedIn){
            console.log("ping");
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