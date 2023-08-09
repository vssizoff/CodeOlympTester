import getFile from "s-get-file";
import {customChecker, defaultChecker} from "./cherckers/index.js";
import {defaultTestOptions} from "./problemSolutionSingleTestTester.js";
import {runProblemSolutionTester} from "./runers.js";

export let defaultProblem = {
    title: "default",
    content: "text",
    format: "md",
    timeLimit: 100,
    ramLimit: 100,
    interactive: false,
    tests: [
        {text: "", files: {}},
        {text: "", files: {}}
    ],
    checker: {
        info: "",
        tests: [
            {
                correctAnswers: [""],
                info: null,
                vars: {
                    n: 8,
                    m: 6
                }
            }
        ],
        default: true,
        endls: false,
        spaces: false,
        trim: true,
        structure: [],
        stdout: true,
        file: "out.txt",
        useCorrectAnswers: true,
        cmd: "checker.exe",
        files: {
            "checker.exe": "./checker.exe",
            "in.txt": "./in.txt"
        }
    },
    interactor: {
        cmd: "node checker.js",
        files: {
            "checker.js": "path"
        },
        info: null,
        tests: [
            null
        ]
    }
}, defaultSolution = {
    cmd: "node",
    files: {}
}, defaultSysConfig = {
    hardTime: 10000,
    hardRam: 1024,
    dir: "./test",
    runFull: false
}

export function fromJSONSync(problem = defaultProblem, solution = defaultSolution,
                             sysConfig = defaultSysConfig, testOptions = defaultTestOptions) {
    problem = {...defaultProblem, ...problem};
    solution = {...defaultSolution, ...solution};
    sysConfig = {...defaultSysConfig, ...sysConfig};
    // if (!problem.interactive) {
    //     delete problem.interactor;
    //     if (problem.checker.default) {
    //         delete problem.checker.useCorrectAnswers;
    //         delete problem.checker.cmd;
    //         delete problem.checker.files;
    //     }
    //     else {
    //         delete problem.checker.endls;
    //         delete problem.checker.spaces;
    //         delete problem.checker.trim;
    //         delete problem.checker.structure;
    //         delete problem.checker.stdout;
    //         delete problem.checker.file;
    //     }
    // }
    // else {
    //     delete problem.checker;
    // }
    let arr = [];
    for (let i = 0; i < problem.tests.length; i++) {
        arr.push({
            maxTime: problem.tests[i].timeLimit ?? problem.timeLimit,
            maxRam: problem.tests[i].ramLimit ?? problem.ramLimit,
            inputText: problem.tests[i].text,
            inputFiles: problem.tests[i].files
        });
    }
    return [{
        ...sysConfig,
        cmd: solution.cmd,
        checker: !problem.interactive ? (problem.checker.default ? defaultChecker(problem.checker) : customChecker(problem.checker, sysConfig.dir)) : undefined,
        interactor: problem.interactive ? problem.interactor : undefined,
        inputFiles: solution.files
    }, arr, testOptions, problem.interactive];
}

export async function fromJSON(problem = defaultProblem, solution = defaultSolution,
                               sysConfig = defaultSysConfig, testOptions = defaultTestOptions) {
    for (let i = 0; i < problem.tests.length; i++) {
        for (let filesKey in problem.tests[i].files) {
            problem.tests[i].files[filesKey] = await getFile(problem.tests[i].files[filesKey]);
        }
    }
    if ("checker" in problem && !problem.checker.default) {
        for (let filesKey in problem.checker.files) {
            problem.checker.files[filesKey] = await getFile(problem.checker.files[filesKey]);
        }
    }
    if ("interactor" in problem) {
        for (let filesKey in problem.interactor.files) {
            problem.interactor.files[filesKey] = await getFile(problem.interactor.files[filesKey]);
        }
    }
    for (let filesKey in solution.files) {
        solution.files[filesKey] = await getFile(solution.files[filesKey]);
    }
    return fromJSONSync(problem, solution, sysConfig, testOptions);
}

export async function runFromJSON(problem = defaultProblem, solution = defaultSolution,
                                  sysConfig = defaultSysConfig, testOptions = defaultTestOptions) {
    return runProblemSolutionTester(...(await fromJSON(problem, solution, sysConfig, testOptions)));
}