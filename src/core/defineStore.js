export default function(stateInit = () => ({})){
    const subscribers = new Set();
    const reactive = (target = {}) => {
        const handler = {
            get(target, key) {
                const prop = target[key];
                if (typeof prop === 'object' && prop !== null) {
                    return new Proxy(prop, handler);
                }
                return prop;
            },
            set(target, key, value) {
                target[key] = value;
                subscribers.forEach(callback => callback(target));
                return true;
            }
        };
        return new Proxy({ value: target }, handler); 
    };

    const proxy = stateInit(reactive); 
    proxy.on = (callback) => subscribers.add(callback);
    proxy.off = (callback) => subscribers.delete(callback);

    return proxy;
};