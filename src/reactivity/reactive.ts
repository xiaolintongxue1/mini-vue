import { mutableHandles, readonlyHandles, shallowReadonlyHandles } from './baseHandlers'

export enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY = "__v_isReadonly"
}

export function reactive(raw) {
    return createActiveObject(raw, mutableHandles)
}

export function readonly(raw) {
    return createActiveObject(raw, readonlyHandles)
}

export function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandles)
}

export function isReactive(value) {
    return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
    return !!value[ReactiveFlags.IS_READONLY]
}

function createActiveObject(raw, baseHandlers) {
    return new Proxy(raw, baseHandlers)
}