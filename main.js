import * as fs from "fs";
import {Slot} from "./codeOlympTester/index.js";
import * as path from "path";

let slot = new Slot("./test");
slot.runFromJSON(JSON.parse(fs.readFileSync("./testProblem.json", {encoding: "utf8"})), {
    files: {"test.exe": path.resolve("./test.exe")},
    cmd: "test.exe"
}).then(response => {
    console.log(response.responsesMainData, response.responses.map(elem => elem.status), response.status);
});
slot.runFromJSON(JSON.parse(fs.readFileSync("./testInteractiveProblem.json", {encoding: "utf8"})), {
    files: {"test.exe": path.resolve("./untitled.exe")},
    cmd: "test.exe"
}).then(response => {
    console.log(response.responsesMainData, response.responses.map(elem => elem.status), response.status);
});