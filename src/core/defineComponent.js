import { effect, signal, computed } from '@preact/signals-core';
import { reactive, html } from 'uhtml/reactive';
import { useStore } from './defineStore';

const DEFAULT_DELAY = 1;
const eventBus = new Map();
const parentContext = new WeakMap();
const componentRegistry = new WeakMap();

export default function defineComponent(componentName = '', componentInit = () => {}) {
    return customElements.define(componentName, class extends HTMLElement {
        #cleanupEffects = [];
        #observer = null;
        #dataset = signal({});
        #innerHTMLRaw = '';
        #context = new Map();

        constructor() {
            super();
            const self = this;

            // Установка родительского компонента
            let parent = this.findParentComponent();
            parentContext.set(this, parent);

            // Инициализация компонента
            this.template = componentInit({
                // Реактивность
                signal, computed, effect, html,
                // Хуки и контекст
                onRender: (fn) => this.onRender = fn,
                useStore,
                // Шина событий
                $on: this.$on.bind(this),
                $off: this.$off.bind(this),
                $emit: this.$emit.bind(this),
                // Иерархия компонентов
                $parent: () => parentContext.get(this),
                $root: () => this.getRootComponent(),
                // Контекст
                $provide: (key, value) => this.#context.set(key, value),
                $inject: (key) => this.injectFromContext(key),
                // Ссылка на себя
                self,
            });

            componentRegistry.set(this, true);
        }

        // ========== Публичные методы ========== //

        /** Подписка на событие */
        $on(event, callback) {
            if (!eventBus.has(event)) eventBus.set(event, new Set());
            eventBus.get(event).add(callback);
            this.#cleanupEffects.push(() => eventBus.get(event)?.delete(callback));
        }

        /** Отписка от события */
        $off(event, callback) {
            eventBus.get(event)?.delete(callback);
        }

        /** Глобальное событие */
        $emit(event, ...args) {
            eventBus.get(event)?.forEach(cb => {
                try { cb(...args); } 
                catch (e) { console.error(`Event error (${event}):`, e); }
            });
        }

        // ========== Приватные методы ========== //

        /** Поиск родительского компонента */
        findParentComponent() {
            let parent = this.parentElement;
            while (parent && !componentRegistry.has(parent)) {
                parent = parent.parentElement;
            }
            return parent || null;
        }

        /** Поиск корневого компонента */
        getRootComponent() {
            let root = this;
            while (parentContext.get(root)) root = parentContext.get(root);
            return root === this ? null : root;
        }

        /** Внедрение данных из контекста */
        injectFromContext(key) {
            let current = this;
            while (current) {
                if (current.#context.has(key)) return current.#context.get(key);
                current = parentContext.get(current);
            }
            return undefined;
        }

        // ========== Жизненный цикл ========== //

        connectedCallback() {
            setTimeout(() => {
                this.#innerHTMLRaw = this.innerHTML;
                this.innerHTML = '';
                this.#makeRender();
                if (this.onRender) this.#cleanupEffects.push(this.onRender(this));
            }, DEFAULT_DELAY);

            this.#setupDatasetObserver();
            this.#initializeDatasetSignals();
        }

        disconnectedCallback() {
            this.#cleanupEffects.forEach(fn => fn());
            this.#cleanupEffects = [];
            this.#observer?.disconnect();
        }

        #setupDatasetObserver() {
            this.#observer = new MutationObserver(() => this.#updateDatasetSignals());
            this.#observer.observe(this, { attributes: true });
        }

        #initializeDatasetSignals() {
            Object.entries(this.dataset).forEach(([k, v]) => {
                this.#dataset.value[k] = signal(v);
            });
        }

        #updateDatasetSignals() {
            Object.entries(this.dataset).forEach(([k, v]) => {
                if (this.#dataset.value[k]) this.#dataset.value[k].value = v;
            });
        }

        #makeRender() {
            const render = reactive(effect);
            const cleanup = render(this, this.template);
            if (cleanup) {
                const slot = cleanup.querySelector('slot');
                if (slot) slot.outerHTML = this.#innerHTMLRaw;
                this.#cleanupEffects.push(cleanup);
            }
        }
    });
}