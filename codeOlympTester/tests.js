import {defaultTestOptions, runTest, TestResponse} from "./test.js";

export let defaultOptions = {
    cmd: "",
    checker: TestResponse.prototype.checker,
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
    testing: "Testing on test %test%"
}

export class TestsResponse {
    forAllTests = defaultOptions;
    tests = [];
    responses = [];
    runFull = false;
    done = false;
    endListeners = [];

    constructor(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions) {
        this.forAllTests = forAllTests;
        this.tests = tests;
        this.runFull = options.runFull;
    }

    runTest(i = 0) {
        new TestResponse(this.tests[i].cmd ?? this.forAllTests.cmd ?? defaultOptions.cmd,
            this.tests[i].checker ?? this.forAllTests.checker ?? defaultOptions.checker,
            {...defaultOptions, ...this.forAllTests, ...this.tests[i]})
            .onAfterEnd((checkerResponse, response) => {
                // console.log(i);
                this.responses.push(response);
                // console.log(i < this.tests.length - 1, this.runFull, response.ok, response.checker === TestResponse.prototype.checker);
                if (i < this.tests.length - 1 && (this.runFull || response.ok)) {
                    this.runTest(i + 1);
                }
                else {
                    this.done = true;
                    this.endListeners.forEach(callback => callback.bind(this)(this));
                }
            })
            .start();
    }

    start() {
        this.runTest();
        return this;
    }

    get ok() {
        if (!this.done) return undefined;
        let flag = true;
        this.responses.forEach(elem => {
            if (elem.ok !== true) flag = false;
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
            if (elem.ended) ans = obj.failed.replace("%test%", index.toString());
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

export async function runTests(forAllTests = defaultOptions, tests = [], options = defaultTestsOptions) {
    // return new TestsResponse(forAllTests, tests, options).start();
    return new Promise(resolve => {
        new TestsResponse(forAllTests, tests, options).onEnd(resolve).start();
    });
}