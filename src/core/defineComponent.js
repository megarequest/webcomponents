import { effect, signal, computed } from '@preact/signals-core';
import { reactive, html } from 'uhtml/reactive';

export default function(componentName = '', componentInit = () => {}) {
    customElements.define(componentName, class extends HTMLElement {
        static template;
        
        constructor() {
            super();
            this._dataset = signal({});
            this._cleanupEffects = [];
            this._datasetSignals = {};
            this.template = componentInit({
                getClass: () => this,
                dataset: () => this._dataset.value,
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
            if (cleanup) {
                this._cleanupEffects.push(cleanup);
            }
        }

    });
}