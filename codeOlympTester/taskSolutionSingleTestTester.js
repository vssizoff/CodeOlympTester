import fs from "fs";
import pidUsage from "pidusage";

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

export class TaskSolutionSingleTestTester {
    response = "";
    time = 0;
    ram;
    timeLimitExpended = false;
    ramLimitExpended = false;
    ended = false;
    verdict = -1;
    code;
    endListeners = [];
    cmd;
    maxTime = defaultTestOptions.maxTime;
    maxRam = defaultTestOptions.maxRam;
    runFull = defaultTestOptions.runFull;
    hardTime = defaultTestOptions.hardTime;
    hardRam = defaultTestOptions.hardRam;
    inputFiles = defaultTestOptions.inputFiles;
    dir = defaultTestOptions.dir;
    outputFiles = {};
    ramIntervalId;
    timeTimeoutId;
    timeCounterId;


    start() {}

    prepareFiles() {
        try {
            fs.accessSync(this.dir);
        }
        catch (error) {
            fs.mkdirSync(this.dir);
        }
        for (let file in this.inputFiles) {
            let filePath = `${this.dir}/${file}`;
            if (Array.isArray(this.inputFiles[file])) fs.writeFileSync(filePath, this.inputFiles[file][0], {encoding: this.inputFiles[file][1]});
            else fs.writeFileSync(filePath, this.inputFiles[file]);
        }
    }

    prepareTimeLimit(process) {
        let stopTime = this.runFull ? this.hardTime : this.maxTime;
        this.timeTimeoutId = setTimeout(() => {
            this.killProcesses(process);
            this.timeLimitExpended = true;
        }, stopTime);
        this.timeCounterId = setInterval(() => {
            this.time++;
        }, 1);
    }

    prepareRamLimit(process) {
        let stopRam = (this.runFull ? this.hardRam : this.maxRam) * 1024 * 1024;
        this.ramIntervalId = setInterval(async () => {
            try {
                let ram = (await pidUsage(process.pid)).memory;
                if (ram > stopRam) {
                    this.killProcesses(process);
                    this.ramLimitExpended = true;
                }
                if (ram > this.ram) {
                    this.ram = ram;
                }
            }
            catch (error) {}
        }, 100);
    }

    prepareLimits(process) {
        this.prepareTimeLimit(process);
        this.prepareRamLimit(process);
    }

    stopTimeouts(intervalId1 = this.ramIntervalId, timeoutId = this.timeTimeoutId, intervalId2 = this.timeCounterId) {
        clearInterval(intervalId1);
        clearTimeout(timeoutId);
        clearInterval(intervalId2);
    }

    killProcesses(...processes) {
        this.stopTimeouts();
        processes.forEach(process => process.kill("SIGINT"));
    }

    getStatus(obj = testStatusObject) {
        obj = {...testStatusObject, ...obj};
        if (this.timeLimitExpended) return obj.time;
        if (this.ramLimitExpended) return obj.ram;
        if (this.ended && this.verdict === 0) return obj.success;
        if (this.ended && this.verdict === 2) return obj.structure;
        if (this.ended) return obj.failed;
        return obj.testing;
    }

    get status() {
        return this.getStatus();
    }

    onEnd(callback) {
        this.endListeners.push(callback);
        return this;
    }

    runEndListeners(bind = this, ...args) {
        this.endListeners.forEach(callback => callback.bind(this)(this.verdict, this));
    }
}