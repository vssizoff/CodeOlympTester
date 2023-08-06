import {defaultTestOptions, TaskSolutionSingleTestTester} from "./taskSolutionSingleTestTester.js";
import path from "path";

export class InteractiveTaskSolutionSingleTestTester extends TaskSolutionSingleTestTester {
    process;
    interactorProcess;

    constructor(cmd, interactor, options = defaultTestOptions) {
        super();
        options = {...defaultTestOptions, ...options};
        this.maxTime = options.maxTime;
        this.maxRam = options.maxRam;
        this.runFull = options.runFull;
        this.hardTime = options.hardTime;
        this.hardRam = options.hardRam;
        this.inputFiles = options.inputFiles;
        this.dir = path.resolve(options.dir);
        this.cmd = cmd;
    }

    start() {

    }
}