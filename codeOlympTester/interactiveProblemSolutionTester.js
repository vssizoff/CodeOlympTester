import {defaultOptions, defaultTestsOptions, ProblemSolutionTester} from "./problemSolutionTester.js";
import {defaultInteractorConfig, InteractiveProblemSolutionSingleTestTester} from "./interactiveProblemSolutionSingleTestTester.js";

export let defaultInteractiveOptions = {
    interactorConfig: defaultInteractorConfig,
    ...defaultOptions
}

export class InteractiveProblemSolutionTester extends ProblemSolutionTester {
    forAllTests = defaultInteractiveOptions;

    constructor(forAllTests = defaultInteractiveOptions, tests = [defaultInteractiveOptions], options = defaultTestsOptions) {
        super();
        this.forAllTests = forAllTests;
        this.tests = tests;
        this.runFull = options.runFull;
    }

    runTest(onEnd, i = 0) {
        let interactorConfig = {...defaultInteractorConfig, ...this.forAllTests.interactorConfig, ...this.tests[i].interactorConfig};
        new InteractiveProblemSolutionSingleTestTester(this.tests[i].cmd ?? this.forAllTests.cmd ?? defaultInteractiveOptions.cmd, interactorConfig,
            {
                ...defaultInteractiveOptions, ...this.forAllTests, ...this.tests[i],
                inputFiles: {...this.forAllTests.inputFiles, ...this.tests[i].inputFiles}
            })
            .onEnd((verdict, response) => onEnd(verdict, response, i))
            .start();
    }
}