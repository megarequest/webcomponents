const {defineComponent, defineStore} = window.ReactiveWeb;

const store = defineStore(({reactive, computed}) => {

    const result = reactive({
        age:10
    });

    const count = computed(() => result.value.age + 3);
    const setAge = n => result.value = { ...result.value, age: n };
  
    return {
        count,
        result,
        setAge
    };
})


// defineComponent('example-component', ({reactive, computed, html, dataset, getClass}) => {

//     const data = reactive({count: store.count.value });
//     const newValue = computed(() => data.value.count + 1)
//     const addUser = () => store.addUser(`Пользователь ${data.value.count + 1}`)
//     const users = computed(() => store.result.value.items)
    
//     store.on(() =>  data.value.count = store.count.value);

//     return () => html`
//         <h1>Пользователи - ${data.value.count}</h1>
//         <div>
//             <button onclick=${() => addUser() }>
//                 Будет: ${newValue.value}
//             </button>
//         </div>

//         <ul>
//             ${users.value.map(user => html`<li>${user.name}</li>`)}
//         </ul>
//     `
// })
