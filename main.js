import * as fs from "fs";
import {
    customChecker,
    defaultChecker, fromJSON, runFromJSON,
    runNormalProblemSolutionTester, Slot
} from "./codeOlympTester/index.js";
import * as path from "path";
import {BufferToString} from "auto-buffer-encoding";

// let testProblem = JSON.parse(fs.readFileSync("./testProblem.json", {encoding: "utf8"}));
// let customCheckerProblem = JSON.parse(fs.readFileSync("./customCheckerProblem.json", {encoding: "utf8"}));
// Object.keys(customCheckerProblem.checker.files).forEach(key => customCheckerProblem.checker.files[key] = fs.readFileSync(key));

// runNormalProblemSolutionTester({
//     cmd: "test.exe",
//     inputFiles: {"test.exe": fs.readFileSync("./test.exe")},
//     // runFull: true,
//     checker: defaultChecker(testProblem.checker)
//     // checker: customChecker(customCheckerProblem.checker, path.resolve("./checker"))
// }, testProblem.tests.map(({text, files}) => ({inputText: text, inputFiles: files})), {runFull: true}).then(response => {
//     console.log(response.responsesMainData, response.responses.map(elem => elem.status), response.status);
// });

// runFromJSON(JSON.parse(fs.readFileSync("./testInteractiveProblem.json", {encoding: "utf8"})), {
//     files: {"exe.exe": path.resolve("./untitled.exe")},
//     cmd: "exe.exe"
// }, {
//     runFull: true,
//     dir: "./test0"
// }).then(response => {
//     console.log(response.responsesMainData, response.responses.map(elem => elem.status), response.status);
// });

// fromJSON(JSON.parse(fs.readFileSync("./testInteractiveProblem.json", {encoding: "utf8"})), {
//     files: {"exe.exe": path.resolve("./untitled.exe")},
//     cmd: "exe.exe"
// }, {
//     runFull: true
// }).then(console.log)

let slot = new Slot("./test");
slot.runFromJSON(JSON.parse(fs.readFileSync("./testProblem.json", {encoding: "utf8"})), {
    files: {"test.exe": path.resolve("./test.exe")},
    cmd: "test.exe"
}, {
    // runFull: true,
}).then(response => {
    console.log(response.responsesMainData, response.responses.map(elem => elem.status), response.status);
});
slot.runFromJSON(JSON.parse(fs.readFileSync("./testInteractiveProblem.json", {encoding: "utf8"})), {
    files: {"test.exe": path.resolve("./untitled.exe")},
    cmd: "test.exe"
}, {
    runFull: true,
}).then(response => {
    console.log(response.responsesMainData, response.responses.map(elem => elem.status), response.status);
});