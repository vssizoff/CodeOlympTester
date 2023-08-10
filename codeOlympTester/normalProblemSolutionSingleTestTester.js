import {spawn} from "child_process";
import * as fs from "fs";
import * as path from "path";
import {defaultTestOptions, ProblemSolutionSingleTestTester} from "./problemSolutionSingleTestTester.js";
import {BufferToString} from "auto-buffer-encoding";

export class NormalProblemSolutionSingleTestTester extends ProblemSolutionSingleTestTester {
    process;
    inputText = defaultTestOptions.inputText;
    checkerListeners = [];


    constructor(cmd, checker = NormalProblemSolutionSingleTestTester.prototype.checker, options = defaultTestOptions) {
        super();
        options = {...defaultTestOptions, ...options};
        this.checker = checker;
        this.maxTime = options.maxTime;
        this.maxRam = options.maxRam;
        this.runFull = options.runFull;
        this.hardTime = options.hardTime;
        this.hardRam = options.hardRam;
        this.inputText = options.inputText;
        this.inputFiles = options.inputFiles;
        this.dir = path.resolve(options.dir);
        this.cmd = cmd;
    }

    start() {
        this.prepareFiles();
        this.process = spawn(this.cmd, [], {
            cwd: this.dir,
            shell: true
        });
        this.prepareLimits(this.process);
        this.process.stdout.on("data", data => this.response += data.toString());
        this.process.on("exit", async code => {
            this.stopTimeouts();
            this.ended = true;
            this.code = code
            if (this.code === 0 || this.code === undefined || this.code === null) {
                fs.readdirSync(this.dir).forEach(filename => this.outputFiles[filename] = fs.readFileSync(this.dir + '/' + filename));
                this.outputFiles = Object.fromEntries(Object.entries(this.outputFiles).map(([key, value]) => {
                    try {return [key, BufferToString(value).replaceAll("\r\n", '\n').replaceAll('\r', '\n')];}
                    catch (_) {return [key, value];}
                }));
                this.verdict = this.checker.bind(this)(this.response, this.outputFiles, this.inputText, this.inputFiles, this);
                if (this.verdict instanceof Promise) this.verdict = await this.verdict;
            }
            while (true) {
                try {
                    fs.rmSync(this.dir, {recursive: true});
                }
                catch (error) {
                    break;
                }
            }
            // this.afterEndListeners.forEach(callback => callback.bind(this)(this.verdict, this));
            this.runEndListeners(this, this.verdict, this);
        });
        this.process.stdin.write(this.inputText);
        return this;
    }

    checker(response, outputFiles, inputText, inputFiles, testResponse) {
        // this.endListeners.forEach(callback => callback.bind(testResponse)(response, inputText, inputFiles, testResponse));
        this.runCheckerListeners(testResponse, response, inputText, inputFiles, testResponse)
        // console.log(true);
        return true;
    }

    onChecker(callback) {
        this.checkerListeners.push(callback);
        return this;
    }

    runCheckerListeners(bind = this, ...args) {
        this.checkerListeners.forEach(callback => callback.bind(bind)(...args));
    }

    killProcess() {
        super.killProcesses(this.process);
    }
}