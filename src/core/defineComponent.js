import { effect, signal, computed } from '@preact/signals-core';
import { reactive, html } from 'uhtml/reactive';

export default function(componentName = '', componentInit = () => {}) {
    customElements.define(componentName, class extends HTMLElement {
        static template;
        static datasetSignals;

        constructor() {
            super();
            this.template = componentInit({
                getClass: () => this,
                dataset: () => this.dataset,
                computed,
                signal,
                effect,
                html,
            });
            this._cleanupEffects = [];
        }

        connectedCallback() {
            setTimeout(() => {
                this.innerHTML = '';
                this.makeRender();
            }, 1);
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