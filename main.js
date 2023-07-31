import * as fs from "fs";
// import("./test.cjs");
import {defaultChecker, runTests} from "./codeOlympTester/index.js";

let testTask = JSON.parse(fs.readFileSync("./testTask.json", {encoding: "utf8"}));

runTests({
    cmd: "test.exe",
    inputFiles: {"test.exe": fs.readFileSync("./test.exe")},
    checker: defaultChecker(testTask.checker)
}, testTask.tests.map(({text, files}) => ({inputText: text, inputFiles: files})), {runFull: true}).then(response => {
    // console.log(response);
    console.log(response.status, response.responses.map(elem => elem.status));
});

// runTest("node test.js", TestResponse.prototype.checker, {
//     inputFiles: {"test.js": fs.readFileSync("./test.js")},
//     inputText: "test \r4\r",
//     dir: "./test0"
// }).onEnd(function (response) {
//     console.log(response);
// });