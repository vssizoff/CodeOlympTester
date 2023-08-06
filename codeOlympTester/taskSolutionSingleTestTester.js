import fs from "fs";

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