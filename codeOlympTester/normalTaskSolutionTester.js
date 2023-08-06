import {NormalTaskSolutionSingleTestTester} from "./normalTaskSolutionSingleTestTester.js";
import {TaskSolutionTester, defaultOptions, defaultTestsOptions} from "./taskSolutionTester.js";

export let defaultNormalOptions = {
    checker: NormalTaskSolutionSingleTestTester.prototype.checker,
    ...defaultOptions
}

export class NormalTaskSolutionTester extends TaskSolutionTester {
    forAllTests = defaultNormalOptions;

    constructor(forAllTests = defaultNormalOptions, tests = [defaultNormalOptions], options = defaultTestsOptions) {
        super();
        this.forAllTests = forAllTests;
        this.tests = tests;
        this.runFull = options.runFull;
    }

    runTest(i = 0) {
        let checker = (...args) => (this.tests[i].checker ?? this.forAllTests.checker ?? defaultNormalOptions.checker)(...args, i)
        new NormalTaskSolutionSingleTestTester(this.tests[i].cmd ?? this.forAllTests.cmd ?? defaultNormalOptions.cmd, checker,
            {
                ...defaultNormalOptions, ...this.forAllTests, ...this.tests[i],
                inputFiles: {...this.forAllTests.inputFiles, ...this.tests[i].inputFiles}
            })
            .onEnd((verdict, response) => {
                this.responses.push(response);
                if (i < this.tests.length - 1 && (this.runFull || response.checkerResponse)) {
                    this.runTest(i + 1);
                }
                else {
                    this.done = true;
                    this.runEndListeners();
                }
            })
            .start();
    }
}