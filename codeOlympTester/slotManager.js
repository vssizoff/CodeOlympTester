import {Slot} from "./slot.js";
import {defaultOptions, defaultTestsOptions} from "./problemSolutionTester.js";
import {defaultProblem, defaultSolution, defaultSysConfig} from "./fromJSON.js";

export class SlotManager {
    slots = [];

    constructor(name, n) {
        for (let i = 0; i < n; i++) {
            this.slots.push(new Slot(`${name}${i}`));
        }
    }

    get minSlotIndex() {
        let min = 0, minIndex = -1;
        this.slots.map(elem => elem.queue.length + (elem.busy ? 1 : 0)).forEach((value, index) => {
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

    async runNormalProblemSolutionTest(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions) {
        return this.minSlot.runNormalProblemSolutionTester(forAllTests, tests, options);
    }

    async runInteractiveProblemSolutionTest(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions) {
        return this.minSlot.runInteractiveProblemSolutionTester(forAllTests, tests, options);
    }

    async runProblemSolutionTest(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions, interactive = false) {
        return this.minSlot.runProblemSolutionTester(forAllTests, tests, options, interactive);
    }

    async runFromJSON(problem = defaultProblem, solution = defaultSolution,
                      sysConfig = defaultSysConfig) {
        return this.minSlot.runFromJSON(problem, solution, sysConfig);
    }
}