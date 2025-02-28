# 🚀 Создание реактивных веб-компонентов с использованием `@preact/signals-core` и `uhtml/reactive`

Этот проект позволяет легко создавать реактивные веб-компоненты с помощью `@preact/signals-core` и `uhtml/reactive`.

## 📌 Установка и сборка

1. Установите зависимости:
   ```sh
   npm install @preact/signals-core uhtml
   ```
   
2. Скомпилируйте код с помощью Webpack, Rollup или другого сборщика.

3. Подключите скомпилированный `bundle.js` в HTML-файле:
   ```html
   <script src="bundle.js"></script>
   ```

## 🎯 Преимущества

- **Реактивность:** Используется `@preact/signals-core`, что делает компоненты мгновенно обновляемыми.
- **Легкость:** Минимальные зависимости (`uhtml/reactive` и `@preact/signals-core`).
- **Гибкость:** Простая API для определения компонентов и управления состоянием.

## 📜 Пример использования

### Определение компонента

```js
defineComponent('example-component', ({signal, computed, html, dataset, effect}) => {
    
    const users = signal([{ name: 'Иван' }]);
    const usersCount = computed(() => users.value.length);
    const addUser = () => {
        users.value = [...users.value, { name: `Пользователь ${usersCount.value + 1}` }];
    };

    return () => html`
        <h1>Пользователи - ${usersCount.value}</h1>
        <button onclick=${addUser}>Добавить пользователя</button>
        <ul>
            ${users.value.map(user => html`<li>${user.name}</li>`)}
        </ul>
    `;
});
```

### Использование в HTML

```html
<example-component></example-component>
```

## 🛠 Требования

- Node.js 16+
- Современный браузер с поддержкой `Custom Elements`

## 🔗 Лицензия

MIT License
