import { reactive } from '../reactive'
import { effect, stop } from '../effect'

describe('effect', () => {
    it("happy path", () => {
        const user = reactive({
            age: 10
        })

        let nextAge;
        effect(() => {
            nextAge = user.age + 1;
        })

        expect(nextAge).toBe(11);

        // update
        user.age++;
        expect(nextAge).toBe(12);
    })

    it("should run runner when call effect", () => {

        let foo = 10;
        const runner = effect(() => {
            foo++;
            return 'foo';
        })

        expect(foo).toBe(11);

        const result = runner();
        expect(foo).toBe(12);
        expect(result).toBe('foo');
    })

    it("scheduler", () => {
        let dummy;
        let run: any;
        const scheduler = jest.fn(() => {
            run = runner;
        })
        const obj = reactive({
            foo: 1
        })
        const runner = effect(
            () => {
                dummy = obj.foo;
            },
            { scheduler }
        )

        expect(dummy).toBe(1);
        expect(scheduler).not.toHaveBeenCalled()
        // should be called on first trigger
        obj.foo++;
        expect(dummy).toBe(1);
        expect(scheduler).toBeCalledTimes(1);
        expect(run).toBe(runner);
        run();
        expect(dummy).toBe(2);
    })

    it("stop", () => {
        let dummy;
        const obj = reactive({
            foo: 1
        })
        const runner = effect(
            () => {
                dummy = obj.foo;
            }
        )
        obj.foo = 2
        expect(dummy).toBe(2);
        // stop expect dummy equal 1
        stop(runner);
        obj.foo = 3;
        expect(dummy).toBe(2);
        // stop expect dummy equal 2
        obj.foo++;
        expect(dummy).toBe(2)
        // runner obj.foo equal 4 expect dummy equal 4
        runner();
        obj.foo = 3
        expect(dummy).toBe(4);
    })

    it("onStop", () => {
        let dummy;
        const obj = reactive({
            foo: 1
        })
        const onStop = jest.fn();
        const runner = effect(
            () => {
                dummy = obj.foo;
            },
            {
                onStop
            }
        )

        expect(dummy).toBe(1);

        // expect onStop to be called when stop
        stop(runner);
        expect(onStop).toBeCalledTimes(1);
    })
})