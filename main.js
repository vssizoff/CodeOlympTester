import * as fs from "fs";
// import("./test.cjs");
import {defaultChecker, runTests} from "./codeOlympTester/index.js";

runTests({
    cmd: "node test.js",
    inputFiles: {"test.js": fs.readFileSync("./test.js")},
    checker: defaultChecker(JSON.parse(fs.readFileSync("./task.json", {encoding: "utf8"})).checker)
}, [
    {inputText: "test \n4\n"},
    {inputText: "qwerty \n10\n"},
    {inputText: "qwertyuiopasdfghjklzxcvbnm \n100\n"},
    {inputText: "abcd \n1000\n"}
], {runFull: true}).then(response => {
    // console.log(response);
    // console.log(response.responses.map(elem => elem.response).join("\n"));
});

// runTest("node test.js", TestResponse.prototype.checker, {
//     inputFiles: {"test.js": fs.readFileSync("./test.js")},
//     inputText: "test \r4\r",
//     dir: "./test0"
// }).onEnd(function (response) {
//     console.log(response);
// });