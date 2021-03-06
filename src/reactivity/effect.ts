import { extend } from "../shared";

let activeEffect;
let shouldTrack;
class ReactiveEffect {
    private _fn: any;
    deps = [];
    isClean = false;
    onStop?:() => void

    constructor(fn, public scheduler?) {
        this._fn = fn;
    }

    run() {
        if (this.isClean) {
            return this._fn();
        }
        shouldTrack = true;
        activeEffect = this;

        const result = this._fn();

        shouldTrack = false;

        return result;
    }

    stop() {
        if(!this.isClean) {
            cleanEffect(this);
            if (this.onStop) {
                this.onStop();
            }
            this.isClean = true
        }
    }
}

function cleanEffect(effect) {
    effect.deps.forEach((dep: any) => {
        dep.delete(effect)
    })
    effect.deps.length = 0;
}

export function effect(fn, options?) {
    let _effect = new ReactiveEffect(fn, options?.scheduler);

    extend(_effect, options);

    _effect.run();

    let runner: any = _effect.run.bind(_effect);
    runner.effect = _effect;

    return runner;
}

let targetMap = new WeakMap();

export function track(target, key) {
    if (!isTracking()) return;

    // target => key => dep
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }

    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    trackEffects(dep);
   
}

export function trackEffects(dep) {
    if (dep.has(activeEffect)) return;
    
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
}

export function isTracking() {
    return shouldTrack && activeEffect !== undefined
}

export function trigger(target, key) {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);

    triggerEffects(dep);
}

export function triggerEffects(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}

export function stop(runner:any) {
    runner.effect.stop();
}