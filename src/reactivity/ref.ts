import { triggerEffects, trackEffects, isTracking } from './effect'
class RefImpl {
    private _value: any;
    public dep;
    constructor(value) {
        this._value = value;
        this.dep = new Set();
    }
    get value() {
        if (isTracking()) {
            trackEffects(this.dep);
        }
        return this._value
    }
    set value(newValue) {
        this._value = newValue;
        console.log('test commit --amend --no-edit');
        triggerEffects(this.dep);
    }
}

export function ref(value) {
    return new RefImpl(value);
}