import {NormalTaskSolutionSingleTestTester} from "./normalTaskSolutionSingleTestTester.js";
import {TaskSolutionTester, defaultOptions, defaultTestsOptions} from "./taskSolutionTester.js";

export class NormalTaskSolutionTester extends TaskSolutionTester {
    tests = [];

    constructor(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions) {
        super();
        this.forAllTests = forAllTests;
        this.tests = tests;
        this.runFull = options.runFull;
    }

    runTest(i = 0) {
        let checker = (...args) => (this.tests[i].checker ?? this.forAllTests.checker ?? defaultOptions.checker)(...args, i)
        new NormalTaskSolutionSingleTestTester(this.tests[i].cmd ?? this.forAllTests.cmd ?? defaultOptions.cmd, checker,
            {
                ...defaultOptions, ...this.forAllTests, ...this.tests[i],
                inputFiles: {...this.forAllTests.inputFiles, ...this.tests[i].inputFiles}
            })
            .onEnd((checkerResponse, response) => {
                // console.log(i);
                this.responses.push(response);
                // console.log(i < this.tests.length - 1, this.runFull, response.checkerResponse, response.checker === TestResponse.prototype.checker);
                if (i < this.tests.length - 1 && (this.runFull || response.checkerResponse)) {
                    this.runTest(i + 1);
                }
                else {
                    this.done = true;
                    this.endListeners.forEach(callback => callback.bind(this)(this));
                }
            })
            .start();
    }

    start() {
        this.runTest();
        return this;
    }
}