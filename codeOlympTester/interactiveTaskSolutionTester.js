import {defaultOptions, defaultTestsOptions, TaskSolutionTester} from "./taskSolutionTester.js";
import {defaultInteractorConfig, InteractiveTaskSolutionSingleTestTester} from "./interactiveTaskSolutionSingleTestTester.js";

export let defaultInteractiveOptions = {
    interactorConfig: defaultInteractorConfig,
    ...defaultOptions
}

export class InteractiveTaskSolutionTester extends TaskSolutionTester {
    forAllTests = defaultInteractiveOptions;

    constructor(forAllTests = defaultInteractiveOptions, tests = [defaultInteractiveOptions], options = defaultTestsOptions) {
        super();
        this.forAllTests = forAllTests;
        this.tests = tests;
        this.runFull = options.runFull;
    }

    runTest(i = 0) {
        let interactorConfig = {...defaultInteractorConfig, ...this.forAllTests.interactorConfig, ...this.tests[i].interactorConfig};
        new InteractiveTaskSolutionSingleTestTester(this.tests[i].cmd ?? this.forAllTests.cmd ?? defaultInteractiveOptions.cmd, interactorConfig,
            {
                ...defaultInteractiveOptions, ...this.forAllTests, ...this.tests[i],
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