import { isReadonly, readonly } from '../reactive'
describe("readonly", () => {
    it("should make nested values readonly", () => {
        const original = { foo: 1, bar: { baz: 2 } };
        const wrapped = readonly(original);
        expect(wrapped).not.toBe(original);
        expect(wrapped.foo).toBe(1)

        // test isReadonly
        expect(isReadonly(wrapped)).toBe(true);
        expect(isReadonly(wrapped.bar)).toBe(true);
        expect(isReadonly(wrapped.bar.baz)).toBe(false);
    })
    it("should call console.warn when call set", () => {
        console.warn = jest.fn();
        const wrapped = readonly({
            foo: 3
        });
        wrapped.foo = 2;
        expect(console.warn).toBeCalled();

    })
})