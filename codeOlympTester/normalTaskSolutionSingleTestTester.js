// import {spawn} from "node-pty";
import {spawn} from "child_process";
import pidUsage from "pidusage";
import * as fs from "fs";
import * as path from "path";
import {defaultTestOptions, TaskSolutionSingleTestTester} from "./taskSolutionSingleTestTester.js";
// import * as os from "os";

export class NormalTaskSolutionSingleTestTester extends TaskSolutionSingleTestTester {
    process;
    inputText = defaultTestOptions.inputText;
    intervalId;
    timeoutId;
    timeIntervalId;


    constructor(cmd, checker = NormalTaskSolutionSingleTestTester.prototype.checker, options = defaultTestOptions) {
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
        // this.prepareTimeRamLimit();
        this.process.stdout.on("data", data => {
            this.response += data.toString();
            // console.log(data.toString());
        });
        this.process.on("exit", async code => {
            clearInterval(this.intervalId);
            clearTimeout(this.timeoutId);
            clearInterval(this.timeIntervalId);
            this.ended = true;
            this.code = code
            if (this.code === 0 || this.code === undefined || this.code === null) {
                fs.readdirSync(this.dir).forEach(filename => this.outputFiles[filename] = fs.readFileSync(this.dir + '/' + filename));
                this.checkerResponse = this.checker.bind(this)(this.response, this.outputFiles, this.inputText, this.inputFiles, this);
                if (this.checkerResponse instanceof Promise) this.checkerResponse = await this.checkerResponse;
            }
            while (true) {
                try {
                    fs.rmSync(this.dir, {recursive: true});
                }
                catch (error) {
                    break;
                }
            }
            this.afterEndListeners.forEach(callback => callback.bind(this)(this.checkerResponse, this));
        });
        this.process.stdin.write(this.inputText);
        return this;
    }

    prepareTimeRamLimit() {
        let stopTime = this.runFull ? this.hardTime : this.maxTime, stopRam = (this.runFull ? this.hardRam : this.maxRam) * 1024 * 1024;
        this.intervalId = setInterval(async () => {
            try {
                let ram = (await pidUsage(this.process.pid)).memory;
                if (ram > stopRam) {
                    this.process.kill();
                    this.ramLimitExpended = true;
                }
                if (ram > this.ram) {
                    this.ram = ram;
                }
            }
            catch (error) {}
        }, 100);
        this.timeoutId = setTimeout(() => {
            this.process.kill();
            this.timeLimitExpended = true;
        }, stopTime);
        this.timeIntervalId = setInterval(() => {
            this.time++;
        }, 1);
    }

    checker(response, outputFiles, inputText, inputFiles, testResponse) {
        this.endListeners.forEach(callback => callback.bind(testResponse)(response, inputText, inputFiles, testResponse));
        // console.log(true);
        return true;
    }
}

// export async function runTest(cmd, checker = NormalTaskSolutionSingleTestTester.prototype.checker, options = defaultTestOptions) {
    // options = {...defaultTestOptions, ...options};
    // try {
    //     return new TestResponse(cmd, checker, options);
    // }
    // catch (error) {}
    // throw new Error("Error during running test");
    // return new Promise(resolve => {
    //     new NormalTaskSolutionSingleTestTester(cmd, checker, options).onAfterEnd((checkerResponse, testResponse) => resolve({checkerResponse, testResponse})).start();
    // });
// }