import {defaultOptions, defaultTestsOptions} from "./taskSolutionTester.js";
import {runInteractiveTaskSolutionTest, runNormalTaskSolutionTest, runTaskSolutionTest} from "./runers.js";

export class Slot {
    dir;
    queue = [];

    constructor(dir) {
        this.dir = dir;
    }

    async runSomething(something) {
        return new Promise(resolve => {
            this.queue.push(async next => {
                if (typeof something === "function") something = something();
                if (something instanceof Promise) something = await something;
                resolve(something); next();
            });
            if (this.queue.length === 1) this.nextTest();
        });
    }

    async runNormalTaskSolutionTest(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions) {
        return this.runSomething(async () => runNormalTaskSolutionTest(forAllTests, tests, options));
    }

    async runInteractiveTaskSolutionTest(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions) {
        return this.runSomething(async () => runInteractiveTaskSolutionTest(forAllTests, tests, options));
    }

    async runTaskSolutionTest(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions, interactive = false) {
        // return new Promise(resolve => {
        //     this.queue.push(async next => {
        //         resolve();
        //         next();
        //     });
        //     if (this.queue.length === 1) this.nextTest();
        // });
        return this.runSomething(async () => runTaskSolutionTest({dir: this.dir, ...forAllTests}, tests, options), interactive);
    }

    nextTest() {
        if (this.queue.length === 0) return;
        let test = this.queue[0];
        this.queue = this.queue.slice(1);
        test(this.nextTest);
    }
}