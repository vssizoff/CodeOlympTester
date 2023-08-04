// import {spawn} from "node-pty";
import {spawn} from "child_process";
import pidUsage from "pidusage";
import * as fs from "fs";
import * as path from "path";
// import * as os from "os";

JSON.safeStringify = (obj, indent = 2) => {
    let cache = [];
    const retVal = JSON.stringify(
        obj,
        (key, value) =>
            typeof value === "object" && value !== null
                ? cache.includes(value)
                    ? undefined
                    : cache.push(value) && value
                : value,
        indent
    );
    cache = null;
    return retVal;
};

export let defaultTestOptions = {
    maxTime: 100,
    maxRam: 10000,
    runFull: false,
    hardTime: 10000,
    hardRam: 1024,
    inputText: "",
    inputFiles: {},
    dir: "./test"
}

export let testStatusObject = {
    time: "Time limit expended",
    ram: "RAM limit expended",
    success: "Success",
    failed: "Failed",
    testing: "Testing",
    structure: "Invalid structure"
}

export class TestResponse {
    process;
    response = "";
    maxTime = defaultTestOptions.maxTime;
    maxRam = defaultTestOptions.maxRam;
    runFull = defaultTestOptions.runFull;
    hardTime = defaultTestOptions.hardTime;
    hardRam = defaultTestOptions.hardRam;
    inputText = defaultTestOptions.inputText;
    inputFiles = defaultTestOptions.inputFiles;
    dir = defaultTestOptions.dir;
    time = 0;
    ram;
    timeLimitExpended = false;
    ramLimitExpended = false;
    ended = false;
    checkerResponse = -1;
    code;
    intervalId;
    timeoutId;
    timeIntervalId;
    endListeners = [];
    afterEndListeners = [];
    cmd;
    outputFiles = {};

    constructor(cmd, checker = TestResponse.prototype.checker, options = defaultTestOptions) {
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

    prepareFiles() {
        try {
            fs.accessSync(this.dir);
        }
        catch (error) {
            fs.mkdirSync(this.dir);
        }
        // Object.keys(this.inputFiles).forEach(file => {
        //     let filePath = `${this.dir}/${file}`;
        //     if (Array.isArray(this.inputFiles)) fs.writeFileSync(filePath, this.inputFiles[file][0], {encoding: this.inputFiles[file][1]});
        //     else fs.writeFileSync(filePath, this.inputFiles[file]);
        // });
        for (let file in this.inputFiles) {
            let filePath = `${this.dir}/${file}`;
            if (Array.isArray(this.inputFiles[file])) fs.writeFileSync(filePath, this.inputFiles[file][0], {encoding: this.inputFiles[file][1]});
            else fs.writeFileSync(filePath, this.inputFiles[file]);
        }
    }

    checker(response, outputFiles, inputText, inputFiles, testResponse) {
        this.endListeners.forEach(callback => callback.bind(testResponse)(response, inputText, inputFiles, testResponse));
        // console.log(true);
        return true;
    }

    onEnd(callback) {
        this.endListeners.push(callback);
        return this;
    }

    getStatus(obj = testStatusObject) {
        obj = {...testStatusObject, ...obj};
        if (this.timeLimitExpended) return obj.time;
        if (this.ramLimitExpended) return obj.ram;
        if (this.ended && this.checkerResponse === 0) return obj.success;
        if (this.ended && this.checkerResponse === 2) return obj.structure;
        if (this.ended) return obj.failed;
        return obj.testing;
    }

    get status() {
        return this.getStatus();
    }

    onAfterEnd(callback) {
        this.afterEndListeners.push(callback);
        return this;
    }
}

export async function runTest(cmd, checker = TestResponse.prototype.checker, options = defaultTestOptions) {
    // options = {...defaultTestOptions, ...options};
    // try {
    //     return new TestResponse(cmd, checker, options);
    // }
    // catch (error) {}
    // throw new Error("Error during running test");
    return new Promise(resolve => {
        new TestResponse(cmd, checker, options).onAfterEnd((checkerResponse, testResponse) => resolve({checkerResponse, testResponse})).start();
    });
}