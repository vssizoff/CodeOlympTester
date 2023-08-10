import {defaultTestOptions} from "./problemSolutionSingleTestTester.js";

export let defaultOptions = {
    cmd: "",
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
    structure: "Invalid structure on test %test%",
    error: "Error on test %test%"
}

export class ProblemSolutionTester {
    forAllTests = defaultOptions;
    tests = [];
    responses = [];
    runFull = false;
    done = false;
    endListeners = [];

    runTest(onEnd, i = 0) {}

    start() {
        let callback = (verdict, response, i) => {
            this.responses.push(response);
            if (i < this.tests.length - 1 && (this.runFull || !verdict)) {
                this.runTest(callback, i + 1);
            }
            else {
                this.done = true;
                this.runEndListeners();
            }
        };
        this.runTest(callback);
        return this;
    }

    get ok() {
        if (!this.done) return undefined;
        let flag = true;
        this.responses.forEach(elem => {
            if (elem.verdict !== 0) flag = false;
        });
        return flag;
    }

    getStatus(obj = statusObject) {
        obj = {...statusObject, ...obj};
        if (this.ok) return obj.success;
        let ans = "";
        this.responses.forEach((elem, index) => {
            if (ans.length !== 0) return;
            if (elem.timeLimitExpended) ans = obj.time.replaceAll("%test%", index.toString());
            if (elem.ramLimitExpended) ans = obj.ram.replaceAll("%test%", index.toString());
            // if (!elem.code) ans = obj.error.replaceAll("%test%", index.toString());
            if (elem.ended && elem.verdict === 1) ans = obj.failed.replaceAll("%test%", index.toString());
            if (elem.ended && elem.verdict === 2) ans = obj.structure.replaceAll("%test%", index.toString());
            if (elem.ended && elem.verdict !== 0) ans = obj.failed.replaceAll("%test%", index.toString());
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

    runEndListeners() {
        this.endListeners.forEach(callback => callback.bind(this)(this));
    }

    get responsesMainData() {return this.responses.map(response => response.mainData)}
}