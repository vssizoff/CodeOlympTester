import {defaultOptions, defaultTestsOptions} from "./problemSolutionTester.js";
import {
    runInteractiveProblemSolutionTester,
    runNormalProblemSolutionTester,
    runProblemSolutionTester
} from "./runers.js";
import {defaultProblem, defaultSolution, defaultSysConfig, runFromJSON} from "./fromJSON.js";

export class Slot {
    dir;
    queue = [];
    busy = false;

    constructor(dir) {
        this.dir = dir;
    }

    async runSomething(something) {
        return new Promise(resolve => {
            this.queue.push(async next => {
                if (typeof something === "function") something = something();
                if (something instanceof Promise) something = await something;
                resolve(something);
                this.busy = false;
                next();
            });
            if (this.queue.length === 1) this.nextTest();
        });
    }

    async runNormalProblemSolutionTester(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions) {
        return this.runSomething(async () => runNormalProblemSolutionTester({dir: this.dir, ...forAllTests}, tests, options));
    }

    async runInteractiveProblemSolutionTester(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions) {
        return this.runSomething(async () => runInteractiveProblemSolutionTester({dir: this.dir, ...forAllTests}, tests, options));
    }

    async runProblemSolutionTester(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions, interactive = false) {
        return this.runSomething(async () => runProblemSolutionTester({dir: this.dir, ...forAllTests}, tests, options), interactive);
    }

    async runFromJSON(problem = defaultProblem, solution = defaultSolution,
                      sysConfig = defaultSysConfig) {
        return this.runSomething(async () => {
            let data = await runFromJSON(problem, solution, sysConfig);
            data[0] = {dir: this.dir, ...data[0]};
            return data;
        });
    }

    nextTest() {
        if (this.queue.length === 0 || this.busy) return;
        this.busy = true;
        let test = this.queue[0];
        this.queue = this.queue.slice(1);
        test(this.nextTest.bind(this));
    }
}