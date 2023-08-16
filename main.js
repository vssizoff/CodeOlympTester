import * as fs from "fs";
import {SlotManager} from "./codeOlympTester/index.js";
import * as path from "path";

let slotManager = new SlotManager("./test", 3);
slotManager.runFromJSON(JSON.parse(fs.readFileSync("./testProblem.json", {encoding: "utf8"})), {
    files: {"test.exe": path.resolve("./test.exe")},
    cmd: "test.exe"
}).then(response => {
    console.log(response.responsesMainData, response.responses.map(elem => elem.status), response.status);
});
slotManager.runFromJSON(JSON.parse(fs.readFileSync("./testCustomCheckerProblem.json", {encoding: "utf8"})), {
    files: {"test.exe": path.resolve("./test.exe")},
    cmd: "test.exe"
}).then(response => {
    console.log(response.responsesMainData, response.responses.map(elem => elem.status), response.status);
});
slotManager.runFromJSON(JSON.parse(fs.readFileSync("./testInteractiveProblem.json", {encoding: "utf8"})), {
    files: {"test.exe": path.resolve("./untitled.exe")},
    cmd: "test.exe"
}).then(response => {
    console.log(response.responsesMainData, response.responses.map(elem => elem.status), response.status);
});