import { render, html, signal } from 'uhtml/preactive';
import core from "./core";
const {reactive, computed, subscribers} = core();

export default function(componentName = '', componentInit = () => {}){

    customElements.define(componentName, class extends HTMLElement {

        static template;

        constructor(){
            super();
            this.template = componentInit({
                getClass: () => this,
                dataset:this.dataset,
                reactive,
                computed,
                html,
            });
        }
        
        connectedCallback() {
            subscribers.add(() => this.update())
            setTimeout(() => {
                this.innerHTML = '';
                this.update();
            }, 1)
        }

        update(){
            render(this, this.template);
        }
        
    });
    

}