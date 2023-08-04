import * as fs from "fs";
import {customChecker, defaultChecker, runTests} from "./codeOlympTester/index.js";
import * as path from "path";

let testTask = JSON.parse(fs.readFileSync("./testTask.json", {encoding: "utf8"}));
let customCheckerTask = JSON.parse(fs.readFileSync("./customCheckerTask.json", {encoding: "utf8"}));
Object.keys(customCheckerTask.checker.files).forEach(key => customCheckerTask.checker.files[key] = fs.readFileSync(key));

runTests({
    cmd: "test.exe",
    inputFiles: {"test.exe": fs.readFileSync("./test.exe")},
    checker: defaultChecker(testTask.checker)
    // checker: customChecker(customCheckerTask.checker, path.resolve("./checker"))
}, testTask.tests.map(({text, files}) => ({inputText: text, inputFiles: files})), {runFull: true}).then(response => {
    // console.log(response);
    console.log(response.status, response.responses.map(elem => elem.status));
});