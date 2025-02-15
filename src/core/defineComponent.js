import { effect, signal, computed  } from '@preact/signals-core';
import { reactive, html} from 'uhtml/reactive';

export default function(componentName = '', componentInit = () => {}){
    customElements.define(componentName, class extends HTMLElement {
        static template;
        constructor(){
            super();
            this.template = componentInit({
                getClass: () => this,
                dataset: () => this.dataset,
                computed,
                signal,
                effect,
                html,
            });
        }
        connectedCallback() {
            setTimeout(() => {
                this.innerHTML = '';
                this.makeRender();
            }, 1)
        }
        makeRender(){
            const render = reactive(effect);
            render(this, this.template);
        }
    });
}