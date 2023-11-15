export class AutoRender extends HTMLElement{
    constructor(){
        super()
        let self = this;
        this.state = new Proxy({}, {
            set(obj, prop, newVal){
                Reflect.set(...arguments);
                self.render();
                return true;
            }
        })
    }

    render(){
        console.log("Over ride this method");
    }
}

customElements.define('render-elem', AutoRender);