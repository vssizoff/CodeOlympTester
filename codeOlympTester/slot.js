import {defaultOptions, defaultTestsOptions, runTests} from "./tests.js";

export class Slot {
    dir;
    queue = [];

    constructor(dir) {
        this.dir = dir;
    }

    async runTests(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions) {
        return new Promise(resolve => {
            this.queue.push(async next => {
                resolve(await runTests({dir: this.dir, ...forAllTests}, tests, options));
                next();
            });
            if (this.queue.length === 1) this.nextTest();
        });
    }

    nextTest() {
        if (this.queue.length === 0) return;
        let test = this.queue[0];
        this.queue = this.queue.slice(1);
        test(this.nextTest);
    }
}