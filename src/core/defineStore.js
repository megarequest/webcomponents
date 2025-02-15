
import { effect, signal, computed  } from '@preact/signals-core';
export default function(stateInit = () => ({})){
    return stateInit({
        signal, 
        effect,
        computed
    }); 
};