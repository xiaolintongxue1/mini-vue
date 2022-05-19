import { isReadonly, shallowReadonly, readonly } from "../reactive"

describe("shallowReadonly", () => {

    it("should not make non-reactive properties readonly", () => {
        const props = shallowReadonly({ foo: { a: 1 } })

        expect(isReadonly(props)).toBe(true);
        expect(isReadonly(props.foo)).toBe(false);

        console.warn = jest.fn();
        const wrapped = readonly({
            foo: 3
        });
        wrapped.foo = 2;
        expect(console.warn).toBeCalled();
    })
})