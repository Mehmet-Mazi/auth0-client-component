

async function init(){
    const authElem = document.querySelector('auth-element');
    // console.log(authElem.getLoggedState());
    // authElem.toggleLoggedState();
    // console.log(authElem.getLoggedState());
    console.log(authElem.shadowRoot.querySelector('#sign-up')); // To get items within the shadowDOM
    await authElem.configureClient();
    authElem.changeUsername("Bob");
    
}

window.addEventListener('load', init);