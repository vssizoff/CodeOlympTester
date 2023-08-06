import {defaultTestOptions} from "./taskSolutionSingleTestTester.js";
import {NormalTaskSolutionSingleTestTester} from "./normalTaskSolutionSingleTestTester.js";

export let defaultOptions = {
    cmd: "",
    checker: NormalTaskSolutionSingleTestTester.prototype.checker,
    ...defaultTestOptions
}

export let defaultTestsOptions = {
    runFull: false
}

export let statusObject = {
    time: "Time limit expended on test %test%",
    ram: "RAM limit expended on test %test%",
    success: "Success",
    failed: "Failed test %test%",
    testing: "Testing on test %test%",
    structure: "Invalid structure on test %test%"
}

export class TaskSolutionTester {
    forAllTests = defaultOptions;
    responses = [];
    runFull = false;
    done = false;
    endListeners = [];

    runTest(i = 0) {}

    start() {}

    get ok() {
        if (!this.done) return undefined;
        let flag = true;
        this.responses.forEach(elem => {
            if (elem.checkerResponse !== 0) flag = false;
        });
        return flag;
    }

    getStatus(obj = statusObject) {
        obj = {...statusObject, ...obj};
        if (this.ok) return obj.success;
        let ans = "";
        this.responses.forEach((elem, index) => {
            if (ans.length !== 0) return;
            if (elem.timeLimitExpended) ans = obj.time.replace("%test%", index.toString());
            if (elem.ramLimitExpended) ans = obj.ram.replace("%test%", index.toString());
            if (elem.ended && elem.checkerResponse === 1) ans = obj.failed.replace("%test%", index.toString());
            if (elem.ended && elem.checkerResponse === 2) ans = obj.structure.replace("%test%", index.toString());
            if (elem.ended && elem.checkerResponse !== 0) ans = obj.failed.replace("%test%", index.toString());
        });
        if (ans.length !== 0) return ans;
        return obj.testing.replace("%test%", (this.responses.length - 1).toString());
    }

    get status() {
        return this.getStatus();
    }

    onEnd(callback) {
        this.endListeners.push(callback);
        return this;
    }
}