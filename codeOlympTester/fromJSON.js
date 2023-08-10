import getFile from "s-get-file";
import {customChecker, defaultChecker} from "./cherckers/index.js";
import {runProblemSolutionTester} from "./runers.js";
import path from "path";

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
                             sysConfig = defaultSysConfig) {
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
            inputText: !problem.interactive ? problem.tests[i].text : undefined,
            inputFiles: problem.tests[i].files
        });
    }
    return [{
        cmd: solution.cmd,
        checker: !problem.interactive ? (problem.checker.default ? defaultChecker(problem.checker) : customChecker(problem.checker, sysConfig.dir)) : undefined,
        interactorConfig: problem.interactive ? problem.interactor : undefined,
        inputFiles: solution.files,
        hardTime: sysConfig.hardTime,
        hardRam: sysConfig.hardRam,
        dir: sysConfig.dir
    }, arr, {
        runFull: sysConfig.runFull
    }, problem.interactive];
}

export async function fromJSON(problem = defaultProblem, solution = defaultSolution,
                               sysConfig = defaultSysConfig) {
    for (let i = 0; i < problem.tests.length; i++) {
        for (let filesKey in problem.tests[i].files) {
            if (typeof problem.tests[i].files[filesKey] !== "string") continue;
            problem.tests[i].files[filesKey] = await getFile(problem.tests[i].files[filesKey]);
        }
    }
    if ("checker" in problem && !problem.checker.default) {
        for (let filesKey in problem.checker.files) {
            if (typeof problem.checker.files[filesKey] !== "string") continue;
            problem.checker.files[filesKey] = await getFile(problem.checker.files[filesKey]);
        }
    }
    if ("interactor" in problem) {
        for (let filesKey in problem.interactor.files) {
            if (typeof problem.interactor.files[filesKey] !== "string") continue;
            problem.interactor.files[filesKey] = await getFile(problem.interactor.files[filesKey]);
        }
    }
    for (let filesKey in solution.files) {
        if (typeof solution.files[filesKey] !== "string") continue;
        solution.files[filesKey] = await getFile(solution.files[filesKey]);
    }
    return fromJSONSync(problem, solution, sysConfig);
}

export async function runFromJSON(problem = defaultProblem, solution = defaultSolution,
                                  sysConfig = defaultSysConfig) {
    return runProblemSolutionTester(...(await fromJSON(problem, solution, sysConfig)));
}