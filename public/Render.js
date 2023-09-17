// Implementation failed. More R&D needed for implementation. TO-DO

export class Render extends HTMLElement{
    constructor(){
        super();
        this.name = "test"
        let self = this
        const handler = {
            get(target, prop, receiver){
                console.log("in proxy get");
                Reflect.get(...arguments);
            },
            set(target, prop, receiver){
                console.log("in Proxy set")
                Reflect.set(...arguments);
                self.view();
                return true;
            }
        }
        this.proxy = new Proxy(this, handler);
        return this;
    }
    
    view(){
        console.log('Override this method');
    }
}


const test1 = {some: 213}

export const LibElementProxy = new Proxy(Render, {
    set(target, prop, receiver){
      console.log("in Proxy")
      Reflect.set(...arguments);
      // self.view();
      return true;
    },
    get(target, au){
      console.log('in get proxy')
      return Reflect.get(...arguments);
    }

  })

  
  customElements.define('re-render', Render)
  
  const myElem = new Render();