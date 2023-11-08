const authElem = document.querySelector('auth-element');
let auth0Client;

async function callApi(){
    try{
        const token = await auth0Client.getTokenSilently(); // Gets the access token or id token?
        const response = await fetch("/api/test", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const responseData = await response.json();
        const responseElement = document.querySelector("#api-call-result");
        responseElement.textContent = JSON.stringify(responseData);
    } catch(e){
        console.log(e)
    }

}

async function renderProfile(){
    console.log("RenderProfile")
    const profile = await authElem.getUserData(); 
    authElem.shadow.querySelector('#username').textContent = profile.nickname;
    authElem.shadow.querySelector('img').src = profile.picture
    auth0Client = authElem.state.auth0Client;
    const token = await auth0Client.getTokenSilently();
    // The following will get someone elses balance which means the logged in user can access anyones account detail so figure out how to fix this (server problem)
    // const response = await fetch("/api/balance/test123", {
    //     headers: {
    //         Authorization: `Bearer ${token}`
    //     }
    // });
    const response = await fetch("/api/balance/"+profile.nickname, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const responseData = await response.json();
    console.log(responseData, authElem.state.auth0Client)
    // document.querySelector('#balance').textContent = responseData.balance.Balance;
}

async function init(){
    // Use the auth0client as the instantiation?
    console.log("init", authElem.shadowRoot.querySelector('[data-login]'));
    if (authElem.authenticated) await renderProfile();

    document.querySelector('#btn-call-api').addEventListener('click', callApi);
};

authElem.addEventListener('load', init);