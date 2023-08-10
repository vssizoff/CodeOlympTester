import * as fs from "fs";
import {
    customChecker,
    defaultChecker, fromJSON, runFromJSON,
    runNormalProblemSolutionTester
} from "./codeOlympTester/index.js";
import * as path from "path";
import {BufferToString} from "auto-buffer-encoding";

let testProblem = JSON.parse(fs.readFileSync("./testProblem.json", {encoding: "utf8"}));
let customCheckerProblem = JSON.parse(fs.readFileSync("./customCheckerProblem.json", {encoding: "utf8"}));
Object.keys(customCheckerProblem.checker.files).forEach(key => customCheckerProblem.checker.files[key] = fs.readFileSync(key));

// runNormalProblemSolutionTester({
//     cmd: "test.exe",
//     inputFiles: {"test.exe": fs.readFileSync("./test.exe")},
//     checker: defaultChecker(testProblem.checker)
//     // checker: customChecker(customCheckerProblem.checker, path.resolve("./checker"))
// }, testProblem.tests.map(({text, files}) => ({inputText: text, inputFiles: files})), {runFull: true}).then(response => {
//     // console.log(response);
//     console.log(response.status, response.responses.map(elem => elem.status), response.responses.map(({process, inputFiles, ...a}) => a));
// });

runFromJSON(JSON.parse(fs.readFileSync("./testInteractiveProblem.json", {encoding: "utf8"})), {
    files: {"exe.exe": path.resolve("./untitled.exe")},
    cmd: "exe.exe"
}, {
    runFull: true
}).then(response => {
    // console.log(response);
    console.log(response.responses.map(res => res.mainData), response.responses.map(elem => elem.status), response.status);
});

// fromJSON(JSON.parse(fs.readFileSync("./testInteractiveProblem.json", {encoding: "utf8"})), {
//     files: {"exe.exe": path.resolve("./untitled.exe")},
//     cmd: "exe.exe"
// }, {
//     runFull: true
// }).then(console.log)