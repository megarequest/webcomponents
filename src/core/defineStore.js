
import { effect, signal, computed  } from '@preact/signals-core';
export default function(stateInit = () => ({})){
    return stateInit({
        reactive:signal, 
        wathc:effect,
        computed
    }); 
};