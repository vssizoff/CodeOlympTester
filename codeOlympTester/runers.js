import {defaultOptions, defaultTestsOptions} from "./taskSolutionTester.js";
import {NormalTaskSolutionTester} from "./normalTaskSolutionTester.js";
import {InteractiveTaskSolutionTester} from "./interactiveTaskSolutionTester.js";
import {defaultTestOptions} from "./taskSolutionSingleTestTester.js";
import {NormalTaskSolutionSingleTestTester} from "./normalTaskSolutionSingleTestTester.js";
import {InteractiveTaskSolutionSingleTestTester} from "./interactiveTaskSolutionSingleTestTester.js";

export async function runNormalTaskSolutionSingleTest(cmd, checker = NormalTaskSolutionSingleTestTester.prototype.checker, options = defaultTestOptions) {
    return new Promise(resolve => {
        new NormalTaskSolutionSingleTestTester(cmd, checker, options).onEnd((checkerResponse, testResponse) => resolve({checkerResponse, testResponse})).start();
    });
}

export async function runInteractiveTaskSolutionSingleTest(cmd, checker = NormalTaskSolutionSingleTestTester.prototype.checker, options = defaultTestOptions) {
    return new Promise(resolve => {
        new InteractiveTaskSolutionSingleTestTester(cmd, checker, options).onEnd((checkerResponse, testResponse) => resolve({checkerResponse, testResponse})).start();
    });
}

export async function runTaskSolutionSingleTest(cmd, checker = NormalTaskSolutionSingleTestTester.prototype.checker, options = defaultTestOptions, interactive = false) {
    return interactive ? runInteractiveTaskSolutionSingleTest(cmd, checker, options) : runNormalTaskSolutionSingleTest(cmd, checker, options);
}

export async function runNormalTaskSolutionTest(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions) {
    return new Promise(resolve => {
        new NormalTaskSolutionTester(forAllTests, tests, options).onEnd(resolve).start();
    });
}

export async function runInteractiveTaskSolutionTest(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions) {
    return new Promise(resolve => {
        new InteractiveTaskSolutionTester(forAllTests, tests, options).onEnd(resolve).start();
    });
}

export async function runTaskSolutionTest(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions, interactive = false) {
    return interactive ? runInteractiveTaskSolutionTest(forAllTests, tests, options) : runNormalTaskSolutionTest(forAllTests, tests, options);
}