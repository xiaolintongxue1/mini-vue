import { track, trigger } from "./effect"
import { reactive, ReactiveFlags, readonly } from "./reactive";
import { isObject, extend } from '../shared'

function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
        let res = Reflect.get(target, key, receiver);

        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly
        }
        if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly
        }

        if (shallow) {
            return res;
        }

        // whether object
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        // collect effect
        if (!isReadonly) {
            track(target, key);
        }
        return res;
    }
}

function createSetter() {
    return function set(target, key, value, receiver) {
        let res = Reflect.set(target, key, value, receiver);
            
        // trigger effect
        trigger(target, key);

        return res;
    }
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true)

export const mutableHandles = {
    get,set
}

export const readonlyHandles = {
    get: readonlyGet,
    set(target, key, value, receiver) {
        console.warn(`set failure, ${target} is readonly!`, key)
        return true;
    }
}

export const shallowReadonlyHandles = extend({}, readonlyHandles, {
    get: shallowReadonlyGet
})