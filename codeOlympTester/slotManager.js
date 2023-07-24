import {Slot} from "./slot.js";
import {defaultOptions, defaultTestsOptions} from "./tests.js";

export class SlotManager {
    slots = [];

    constructor(name, n) {
        for (let i = 0; i < n; i++) {
            this.slots.push(new Slot(`${name}${i}`));
        }
    }

    async runTests(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions) {
        let min = 0, minIndex = -1;
        this.slots.forEach((value, index) => {
            if (minIndex === -1 || min > value) {
                min = value;
                minIndex = index;
            }
        });
        return this.slots[minIndex].runTests(forAllTests, tests, options);
    }
}