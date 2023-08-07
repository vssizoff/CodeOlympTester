import * as fs from "fs";
import {customChecker, defaultChecker, runProblemSolutionTester} from "./codeOlympTester/index.js";
import * as path from "path";

let testProblem = JSON.parse(fs.readFileSync("./testTask.json", {encoding: "utf8"}));
let customCheckerProblem = JSON.parse(fs.readFileSync("./customCheckerProblem.json", {encoding: "utf8"}));
Object.keys(customCheckerProblem.checker.files).forEach(key => customCheckerProblem.checker.files[key] = fs.readFileSync(key));

runProblemSolutionTester({
    cmd: "test.exe",
    inputFiles: {"test.exe": fs.readFileSync("./test.exe")},
    checker: defaultChecker(testProblem.checker)
    // checker: customChecker(customCheckerProblem.checker, path.resolve("./checker"))
}, testProblem.tests.map(({text, files}) => ({inputText: text, inputFiles: files})), {runFull: true}).then(response => {
    // console.log(response);
    console.log(response.status, response.responses.map(elem => elem.status), response.responses.map(({process, inputFiles, ...a}) => a));
});