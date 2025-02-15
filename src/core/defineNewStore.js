import { render, html, signal } from 'uhtml/preactive';
import { reactive } from 'uhtml/reactive';
export default function(stateInit = () => ({})){
    return stateInit({
        reactive,
        signal,
    }); 

};