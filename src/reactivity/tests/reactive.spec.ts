import { reactive, isReactive } from '../reactive'

describe('reactive', () => {
    
    it('should make nested values reactive', () => {
        const original = {
            foo: 1,
            net: {
                foo: 1
            }
        }
        const observed = reactive(original);
        expect(original).not.toBe(observed);
        expect(observed.foo).toBe(1);
        expect(isReactive(observed)).toBe(true);
        expect(isReactive(original)).toBe(false);
        expect(isReactive(observed.net)).toBe(true);
        expect(isReactive(observed.net.foo)).toBe(false);
        expect(isReactive(original.net)).toBe(false);
    })
})