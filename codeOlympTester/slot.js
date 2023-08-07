import {defaultOptions, defaultTestsOptions} from "./problemSolutionTester.js";
import {runInteractiveProblemSolutionTester, runNormalProblemSolutionTester, runProblemSolutionTester} from "./runers.js";

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

    async runNormalProblemSolutionTester(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions) {
        return this.runSomething(async () => runNormalProblemSolutionTester(forAllTests, tests, options));
    }

    async runInteractiveProblemSolutionTester(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions) {
        return this.runSomething(async () => runInteractiveProblemSolutionTester(forAllTests, tests, options));
    }

    async runProblemSolutionTester(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions, interactive = false) {
        // return new Promise(resolve => {
        //     this.queue.push(async next => {
        //         resolve();
        //         next();
        //     });
        //     if (this.queue.length === 1) this.nextTest();
        // });
        return this.runSomething(async () => runProblemSolutionTester({dir: this.dir, ...forAllTests}, tests, options), interactive);
    }

    nextTest() {
        if (this.queue.length === 0) return;
        let test = this.queue[0];
        this.queue = this.queue.slice(1);
        test(this.nextTest);
    }
}