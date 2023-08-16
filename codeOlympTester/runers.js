import {defaultOptions, defaultTestsOptions} from "./problemSolutionTester.js";
import {NormalProblemSolutionTester} from "./normalProblemSolutionTester.js";
import {InteractiveProblemSolutionTester} from "./interactiveProblemSolutionTester.js";
import {defaultTestOptions} from "./problemSolutionSingleTestTester.js";
import {NormalProblemSolutionSingleTestTester} from "./normalProblemSolutionSingleTestTester.js";
import {defaultInteractorConfig, InteractiveProblemSolutionSingleTestTester} from "./interactiveProblemSolutionSingleTestTester.js";

export async function runNormalProblemSolutionSingleTest(cmd, checker = NormalProblemSolutionSingleTestTester.prototype.checker, options = defaultTestOptions) {
    return new Promise(resolve => {
        new NormalProblemSolutionSingleTestTester(cmd, checker, options).onEnd((checkerResponse, testResponse) => resolve({checkerResponse, testResponse})).start();
    });
}

export async function runInteractiveProblemSolutionSingleTest(cmd, testNumber = 0, interactorConfig = defaultInteractorConfig, options = defaultTestOptions) {
    return new Promise(resolve => {
        new InteractiveProblemSolutionSingleTestTester(cmd, testNumber, interactorConfig, options).onEnd((checkerResponse, testResponse) => resolve({checkerResponse, testResponse})).start();
    });
}

export async function runProblemSolutionSingleTest(cmd, checkerOrInteractorConfig = NormalProblemSolutionSingleTestTester.prototype.checker, options = defaultTestOptions, interactive = false) {
    return interactive ? runInteractiveProblemSolutionSingleTest(cmd, 0, checkerOrInteractorConfig, options) : runNormalProblemSolutionSingleTest(cmd, checkerOrInteractorConfig, options);
}

export async function runNormalProblemSolutionTester(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions) {
    return new Promise(resolve => {
        new NormalProblemSolutionTester(forAllTests, tests, options).onEnd(resolve).start();
    });
}

export async function runInteractiveProblemSolutionTester(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions) {
    return new Promise(resolve => {
        new InteractiveProblemSolutionTester(forAllTests, tests, options).onEnd(resolve).start();
    });
}

export async function runProblemSolutionTester(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions, interactive = false) {
    return interactive ? runInteractiveProblemSolutionTester(forAllTests, tests, options) : runNormalProblemSolutionTester(forAllTests, tests, options);
}