import { effect, signal, computed } from '@preact/signals-core';
import { reactive, html } from 'uhtml/reactive';
import { useStore } from './defineStore';

export default function(componentName = '', componentInit = () => {}) {
    customElements.define(componentName, class extends HTMLElement {
        static innerHTMLRaw;
        static template;
        static onRender;

        constructor() {
            super();
            const self = this;
            this._dataset = signal({});
            this._cleanupEffects = [];
            this._datasetSignals = {};
            this.template = componentInit({
                onRender: f => this.onRender = f,
                useStore,
                computed,
                signal,
                effect,
                html,
                self,
            });
        }

        connectedCallback() {
            setTimeout(() => {
                this.innerHTMLRaw = this.innerHTML;
                this.innerHTML = '';
                this.makeRender();
            }, 1);
            this._observer = new MutationObserver(() => this.updateDatasetSignals());
            this._observer.observe(this, { attributes: true });
            let dataset = Object.assign({}, this.dataset);
            Object.keys(dataset).forEach(k => this._dataset.value[k] = signal(dataset[k]))
        }

        updateDatasetSignals() {
            let dataset = Object.assign({}, this.dataset);
            Object.keys(dataset).forEach(k => this._dataset.value[k].value = dataset[k])
        }

        disconnectedCallback() {
            this._cleanupEffects.forEach(cleanup => cleanup());
            this._cleanupEffects = [];
        }


        makeRender() {
            const render = reactive(effect);
            const cleanup = render(this, this.template);
            const slot = cleanup?.querySelector('slot');
            if(slot) slot.outerHTML = this.innerHTMLRaw;
            if(this.onRender) this.onRender(this)
            if (cleanup) this._cleanupEffects.push(cleanup);

        }

    });
}