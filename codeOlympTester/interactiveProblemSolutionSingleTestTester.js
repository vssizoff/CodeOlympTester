import {defaultTestOptions, ProblemSolutionSingleTestTester} from "./problemSolutionSingleTestTester.js";
import path from "path";
import {spawn} from "child_process";
import fs from "fs";
import pidUsage from "pidusage";
import {BufferToString} from "auto-buffer-encoding";

export let defaultInteractorConfig = {
    cmd: "node",
    files: {},
    info: null,
    tests: []
}

export class InteractiveProblemSolutionSingleTestTester extends ProblemSolutionSingleTestTester {
    process;
    interactorProcess;
    interactorCmd;
    interactorFiles = {};
    interactorInfo;
    interactorTests = [];
    commandPrefix = undefined;
    interactorRamIntervalId;
    interactorTimeTimeoutId;
    testNumber = 0;


    constructor(cmd, testNumber = 0, interactorConfig = defaultInteractorConfig, options = defaultTestOptions) {
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
        this.interactorCmd = interactorConfig.cmd;
        this.interactorFiles = interactorConfig.files;
        this.interactorInfo = interactorConfig.info;
        this.interactorTests = interactorConfig.tests;
        this.testNumber = testNumber;
    }

    start() {
        this.prepareFiles();
        this.interactorProcess = spawn(this.interactorCmd, {
            cwd: this.dir,
            shell: true
        });
        this.process = spawn(this.cmd, {
            cwd: this.dir,
            shell: true
        });
        this.prepareLimits(this.process);
        this.prepareInteractorLimits();
        let verdict = -1, ended = [undefined, undefined], end = (code, interactor) => {
            ended[interactor ? 1 : 0] = code;
            if (ended[0] === undefined || ended[1] === undefined) return;
            this.ended = true;
            this.code = ended[0];
            this.stopTimeouts();
            if (ended[0] === 0 && ended[1] === 0) {
                fs.readdirSync(this.dir).forEach(filename => this.outputFiles[filename] = fs.readFileSync(this.dir + '/' + filename));
                this.outputFiles = Object.fromEntries(Object.entries(this.outputFiles).map(([key, value]) => {
                    try {return [key, BufferToString(value).replaceAll("\r\n", '\n').replaceAll('\r', '\n')];}
                    catch (_) {return [key, value];}
                }));
                this.verdict = verdict;
            }
            while (true) {
                try {
                    fs.rmSync(this.dir, {recursive: true});
                }
                catch (error) {
                    break;
                }
            }
            this.runEndListeners(this, this.verdict, this);
        };
        this.interactorProcess.on("exit", code => end(code, true));
        this.process.on("exit", code => end(code, false));
        this.interactorProcess.stdout.on("data", data => {
            data = data.toString();
            // if (data[data.length - 1] === '\n') data = data.substring(0, data.length - 1);
            if (this.commandPrefix === undefined) {
                if (data[data.length - 1] === '\n') data = data.substring(0, data.length - 1);
                this.commandPrefix = data;
            }
            else if (!data.startsWith(this.commandPrefix)) {
                this.process.stdin.write(data);
                return;
            }
            if (data[data.length - 1] === '\n') data = data.substring(0, data.length - 1);
            data = data.substring(this.commandPrefix.length);
            if (data.startsWith("config.cmd")) {
                this.interactorProcess.stdin.write(`${this.interactorCmd}\n`);
            }
            else if (data.startsWith("config.files.")) {
                this.interactorProcess.stdin.write(this.interactorFiles[data.substring("config.files.".length)] + '\n');
            }
            else if (data.startsWith("config.files")) {
                this.interactorProcess.stdin.write(JSON.stringify(this.interactorFiles) + '\n');
            }
            else if (data.startsWith("config.filesKeys")) {
                this.interactorProcess.stdin.write(Object.keys(this.interactorFiles).join(data.substring("config.filesKeys".length)) + '\n');
            }
            else if (data.startsWith("config.info")) {
                this.interactorProcess.stdin.write(`${this.interactorInfo}\n`);
            }
            else if (data.startsWith("config.tests.")) {
                this.interactorProcess.stdin.write(this.interactorTests[data.substring("config.tests.".length)] + '\n');
            }
            else if (data.startsWith("config.tests")) {
                this.interactorProcess.stdin.write(JSON.stringify(this.interactorTests) + '\n');
            }
            else if (data.startsWith("config.tests.length")) {
                this.interactorProcess.stdin.write(`${this.interactorTests.length}\n`);
            }
            else if (data.startsWith("testNumber")) {
                this.interactorProcess.stdin.write(`${this.testNumber}\n`);
            }
            else if (data.startsWith("-1") || data.startsWith("0") || data.startsWith("1") || data.startsWith("2")) {
                verdict = data[0] === '-' ? -1 : Number(data[0]);
            }
            // verdict = Number(data.substring(this.commandPrefix.length).trim());
        });
        this.process.stdout.on("data", data => this.interactorProcess.stdin.write(data));
    }

    prepareInteractorLimits() {
        this.interactorTimeTimeoutId = setTimeout(() => {
            this.killProcesses();
            this.timeLimitExpended = true;
        }, defaultTestOptions.hardTime);
        let stopRam = defaultTestOptions.hardRam * 1024 * 1024;
        this.interactorRamIntervalId = setInterval(async () => {
            try {
                let ram = (await pidUsage(this.interactorProcess.pid)).memory;
                if (ram > stopRam) {
                    this.killProcesses();
                    this.ramLimitExpended = true;
                }
            }
            catch (error) {}
        }, 100);
    }

    prepareFiles() {
        super.prepareFiles();
        for (let file in this.interactorFiles) {
            let filePath = `${this.dir}/${file}`;
            if (Array.isArray(this.interactorFiles[file])) fs.writeFileSync(filePath, this.interactorFiles[file][0], {encoding: this.interactorFiles[file][1]});
            else fs.writeFileSync(filePath, this.interactorFiles[file]);
        }
    }

    stopTimeouts() {
        super.stopTimeouts(this.ramIntervalId, this.timeTimeoutId, this.timeCounterId);
        clearTimeout(this.interactorTimeTimeoutId);
        clearInterval(this.interactorRamIntervalId);
    }

    killProcesses() {
        super.killProcesses(this.process, this.interactorProcess);
    }

    get mainData() {
        return {
            ...super.mainData,
            interactorCmd: this.interactorCmd,
            interactorInfo: this.interactorInfo,
            commandPrefix: this.commandPrefix,
            testNumber: this.testNumber
        }
    }
}