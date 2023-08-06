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
    checkerResponse = -1;
    code;
    endListeners = [];
    afterEndListeners = [];
    cmd;


    start() {}

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