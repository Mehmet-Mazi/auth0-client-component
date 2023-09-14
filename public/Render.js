class Render extends HTMLElement{
    constructor(){
        super();
        let self = this;
        const handler = {
            set(target, prop, receiver){
                Reflect.set(...arguments);
                self.view();
                return true;
            }
        }
        console.log(handler)
        return [new Proxy(this, handler), this];
    }

    view(){
        console.log('Override this method');
    }
}

export default Render;