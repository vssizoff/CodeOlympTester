import {Slot} from "./slot.js";
import {defaultOptions, defaultTestsOptions} from "./taskSolutionTester.js";

export class SlotManager {
    slots = [];

    constructor(name, n) {
        for (let i = 0; i < n; i++) {
            this.slots.push(new Slot(`${name}${i}`));
        }
    }

    get minSlotIndex() {
        let min = 0, minIndex = -1;
        this.slots.forEach((value, index) => {
            if (minIndex === -1 || min > value) {
                min = value;
                minIndex = index;
            }
        });
        return minIndex;
    }

    get minSlot() {return this.slots[this.minSlotIndex];}

    async runSomething(something) {
        return this.minSlot.runSomething(something);
    }

    async runNormalTaskSolutionTest(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions) {
        return this.minSlot.runNormalTaskSolutionTest(forAllTests, tests, options);
    }

    async runInteractiveTaskSolutionTest(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions) {
        return this.minSlot.runInteractiveTaskSolutionTest(forAllTests, tests, options);
    }

    async runTaskSolutionTest(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions, interactive = false) {
        return this.minSlot.runTaskSolutionTest(forAllTests, tests, options, interactive);
    }
}