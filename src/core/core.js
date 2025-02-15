export default function (){
    
    let activeComputed = null;
    const dependencies = new Map();
    const subscribers = new Set();
    
    const reactive = (target) => {            
        const getHandler = (target, key) => {
            if (typeof target[key] === 'object' && target[key] !== null) {
                return new Proxy(target[key], { get: getHandler, set: setHandler });
            }
    
            if (activeComputed) {
                if (!dependencies.has(key)) {
                    dependencies.set(key, new Set());
                }
                dependencies.get(key).add(activeComputed);
            }
    
            return target[key];
        };
    
        const setHandler = (target, key, value) => {
            target[key] = value;
            if (dependencies.has(key)) {
                dependencies.get(key).forEach(computed => computed());
            }
            subscribers.forEach(callback => callback(value))
            return true;
        };
    
        return new Proxy({ value: target }, { get: getHandler, set: setHandler });
    };
    
    const computed = (getter) => {
        let value;
        const compute = () => {
            activeComputed = compute;
            value = getter();
            activeComputed = null;
        };
        compute();
        return {
            get value() {
                if (activeComputed) {
                    if (!dependencies.has(compute)) {
                        dependencies.set(compute, new Set());
                    }
                    dependencies.get(compute).add(activeComputed);
                    subscribers.forEach(callback => callback(value));
                }
                return value;
            }
        };
    };


    return {
        reactive,
        computed,
        subscribers
    }
}