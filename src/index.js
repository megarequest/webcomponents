
import defineStore from './core/defineStore';
import defineNewStore from './core/defineNewStore';
import defineComponent from './core/defineComponent';
window.ReactiveWeb = {defineStore, defineComponent, defineNewStore};


/*
import { effect, signal,  } from '@preact/signals-core';
import { reactive, html} from 'uhtml/reactive';

// create the reactive render function
const render = reactive(effect);

const user = signal({
    name: 'John',
    age: 30,
});

const incrementAge = () => {
    user.value = { ...user.value, age: user.value.age + 1 };
};

// render in the body passing a () => html`...` callback
render(document.body, () => html`
  <button onclick=${incrementAge}>
    Clicks: ${user.value.age}
  </button>
`);

*/