import { effect } from '../effect'
import { ref } from '../ref'

describe("ref", () => {
    it("happy path", () => {
        const a = ref(1);
        //
        expect(a.value).toBe(1);
    })

    it("should be reactive", () => {
        const a = ref(1);
        let call = 0;
        let dummy;
        effect(() => {
            call++;
            dummy = a.value;
        })

        //
        expect(call).toBe(1);
        expect(dummy).toBe(1);

        a.value = 3;
        expect(call).toBe(2);
        expect(dummy).toBe(3);

        // same value not trigger
        // a.value = 3;
        // expect(call).toBe(2);
        // expect(dummy).toBe(3);
    })
})