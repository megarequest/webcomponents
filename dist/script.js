const {defineComponent, defineStore} = window.ReactiveWeb;

const useFetch = async (path, config = []) => {
    const result = await fetch('https://lui.feelcode.ru' + path, config).then(r => r.json());
    if(result.status == 'success'){
        return result?.data;
    }else{
        console.error(result.errors);
    }
}


window.setLoading = (name, value) => {
    if(!window.loadingHistory) window.loadingHistory = {};
    window.loadingHistory[name] = value;
    const isLoading = Object.values(window.loadingHistory).find(v => v == true);
    document.body.classList.toggle('waiting', isLoading)
}

window.wishlist = defineStore((reactive) => {

    let items = reactive([]);

    const fromStorage = () => {
        try {
            const json = window.localStorage.getItem('wishlist');
            items.value = json ? JSON.parse(json) : [];
        }catch (e) {
            console.error(e);
        }
    }

    const toStorage = () => {
        window.localStorage.setItem('wishlist', JSON.stringify(items.value))
    }

    const includes = (id) => items.value.find(i => parseInt(i) == parseInt(id)) > 0;

    const getCount = () => items.value.length

    const add = (id) => {
        if(includes(id)) return ;
        window.setLoading('wishlistUpdate', true)
        items.value.push(parseInt(id));
        window.setLoading('wishlistUpdate', false)
        toStorage();
    }

    const remove = (id) => {
        if(!includes(id)) return ;
        window.setLoading('wishlistUpdate', true)
        items.value.splice(items.value.indexOf(parseInt(id)), 1);
        window.setLoading('wishlistUpdate', false)
        toStorage();
    }

    const toggle = (id) => {
        if(includes(id)){
            remove(id)
        }else{
            add(id)
        }
    }
    const init  = () => {
        fromStorage();
    }

    init();

    return {items, add, remove, toggle, includes, getCount};

})


window.basket = defineStore((reactive) => {

    let result = reactive({});

    const readLocalStorage = () => {
        try {
            setTimeout(() => {
                let store = window.localStorage.getItem('userBasket');
                result.value = store ? JSON.parse(store) : null;
            }, 10)

        }catch (e) {
            console.error(e)
        }
        return  null;
    }

    const writeLocalStorage = () => {
        if(!result.value) return ;
        window.localStorage.setItem('userBasket', JSON.stringify(result.value))
    }

    const loadData = async () => {
        const fetchResult = await useFetch('/api/basket/');
        result.value = fetchResult;
        writeLocalStorage();
    }

    const init = async () => {
        readLocalStorage();
        loadData();
    }

    const plus = async (productId = null) => {
        if(!productId) return ;
        window.setLoading('basketUpdate', true)
        const fetchResult = await useFetch('/api/basket/plus/', {
            method:'POST',
            body: JSON.stringify({productId})
        });
        window.setLoading('basketUpdate', false)
        result.value = fetchResult;
        writeLocalStorage();
    }

    const minus = async (productId = null) => {
        if(!productId) return ;
        window.setLoading('basketUpdate', true)
        const fetchResult = await useFetch('/api/basket/minus/', {
            method:'POST',
            body: JSON.stringify({productId})
        });
        window.setLoading('basketUpdate', false)
        result.value = fetchResult;
        writeLocalStorage();
    }

    const add = async (productId = null) => {
        if(!productId) return ;
        window.setLoading('basketUpdate', true)
        const fetchResult = await useFetch('/api/basket/add/', {
            method:'POST',
            body: JSON.stringify({productId})
        });
        window.setLoading('basketUpdate', false)
        result.value = fetchResult;
        writeLocalStorage();
    }

    init();

    return {result, add, plus, minus};

})

defineComponent('wishlist-header-informer', ({reactive, computed, html, dataset, getClass}) => {


    const data = reactive({count:0});
    data.value.count = wishlist.getCount()
    wishlist.on(() =>  data.value.count = wishlist.getCount());

    return () => html`
        <a href="/wishlist/" class="wishlist-count" data-count="${data.value.count}">
            <svg class="icon">
            <use xlink:href="/local/templates/luys/img/spritemap.svg#heart"></use>
            </svg>
        </a>
    `
})
