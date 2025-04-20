const usersStore = defineStore('users', ({signal, computed, effect}) => {

    const data = signal([{ 
        name:'Иван',
        birth:'10.01.2000' 
    }]);

    const users = computed(() => {
        let userData = JSON.parse(JSON.stringify(data?.value));
        return userData.map(user => {
            let birth = new Date(user.birth);
            user.age = (new Date()).getFullYear() - birth.getFullYear();
            return user;
        });
    });

    const count = computed(() => users.value.length)

    const addUser = (
        name = 'Имя', 
        birth = '01.01.2000'
    ) => {
        data.value = [...data.value, {name, birth}]
    };
  
    effect(() => {
        console.log('Изменилась инфа', users.value)
    });
  
    return {
        users,
        count,
        addUser,
    };
})

defineComponent('users-list', ({html, signal, self, useStore }) => {

    setTimeout(() => {
        self.setAttribute('name', 'ivan')
        console.log(self)
    }, 2)

    const {users, count, addUser} = useStore('users')

    const newUser = signal({
        name:'',
        birth:'',
    })

    const addNewUser = e => {
        e.preventDefault();
        addUser(newUser.value.name, newUser.value.birth)
        newUser.value.name = '';
        newUser.value.birth = ''
    }

    return () => html`
        <div>Всего - ${count.value}</h1>
        <br>
        <div>
            <h3>Добавить пользователя</h3>
            <form @submit="${addNewUser}" >
                <input type="text" placeholder="Имя" class="input" required oninput=${(e) => newUser.value.name = e.target.value} >
                <br>
                <input type="date" placeholder="Д.р" class="input" required onchange=${(e) => newUser.value.birth = e.target.value}>
                <br>
                <button type="submit" >Добавить</button>
            </form>
        </div>

        <br><br>
        
        <table border="1">
            <tr>
                <td>Имя</td>
                <td>Д/Р</td>
                <td>Возраст</td>
            </tr>
            ${users.value.map(user => html`<tr>
                <td>${user.name}</td>
                <td>${user.birth}</td>
                <td>${user.age}</td>
            </tr>`)}
        </table>
    `
})
