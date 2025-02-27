const store = defineStore(({signal, computed, effect}) => {

    const result = signal({
        age:10
    });

    const count = computed(() => result.value.age + 3);
    const setAge = n => result.value = { ...result.value, age: n };

    effect(() => console.log(count.value));
  
    return {
        count,
        result,
        setAge
    };
})

defineComponent('example-component-attrs', ({html, dataset}) => {
    const data = dataset(['data-name']);
    return () => html`
        <div>
        ${data.name}
        </div>
    `
})


defineComponent('example-component', ({signal, computed, html, dataset, effect}) => {
    
    const ageValue = computed(() => store.count.value)
    const users = signal([ {name:'Иван'}  ])
    const usersCount = computed(() => users.value.length)
    const addUser = () => {
      users.value = [...users.value, {name:`Пользователь ${usersCount.value + 1}` }]
    }

    const lastUser = computed(() => {
        const length = users.value.length;
        if(length < 1) return 'Нет пользователей'
        return users.value[length - 1]['name'];
    } )

    setInterval(() => {
        store.setAge( ageValue.value + 1)
    }, 2000)


    effect(() => 'Пользователь добавлен!');

    return () => html`
        <h1>Пользователи - ${usersCount.value}</h1>
        <example-component-attrs data-name="${lastUser.value}"></example-component-attrs>
        <div>
            <button onclick=${() => addUser() }>
                Будет: ${ageValue.value}
            </button>
        </div>
        <ul>
            ${users.value.map(user => html`<li>${user.name}</li>`)}
        </ul>
    `
})
