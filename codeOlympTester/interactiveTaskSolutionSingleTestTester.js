import {defaultTestOptions, TaskSolutionSingleTestTester} from "./taskSolutionSingleTestTester.js";
import path from "path";
import {spawn} from "child_process";
import fs from "fs";

export class InteractiveTaskSolutionSingleTestTester extends TaskSolutionSingleTestTester {
    process = spawn("node");
    interactorProcess = spawn("node");
    interactorCmd;
    interactorFiles = {};
    interactorInfo;
    interactorTests = [];
    verdictCommand = undefined;


    constructor(cmd, interactor, options = defaultTestOptions) {
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
        this.interactorCmd = interactor.cmd;
        this.interactorFiles = interactor.files;
        this.interactorInfo = interactor.info;
        this.interactorTests = interactor.tests;
    }

    start() {
        this.interactorProcess.kill("SIGINT");
        this.process.kill("SIGINT");
        this.prepareFiles();
        this.interactorProcess = spawn(this.interactorCmd, {
            cwd: this.dir,
            shell: true
        });
        this.process = spawn(this.cmd, {
            cwd: this.dir,
            shell: true
        });
        let verdict = -1, ended = [undefined, undefined], end = (code, interactor) => {
            ended[interactor ? 1 : 0] = code;
            if (ended[0] === undefined || ended[1] === undefined) return;
            if (ended[0] === 0 && ended[1] === 0) {
                fs.readdirSync(this.dir).forEach(filename => this.outputFiles[filename] = fs.readFileSync(this.dir + '/' + filename));
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
            if (this.verdictCommand === undefined) {
                if (data[data.length - 1] === '\n') data = data.substring(0, data.length - 1);
                this.verdictCommand = data;
            }
            else if (data.startsWith(this.verdictCommand)) {
                if (data[data.length - 1] === '\n') data = data.substring(0, data.length - 1);
                verdict = Number(data.substring(this.verdictCommand.length).trim());
            }
            else this.process.stdin.write(data);
        });
        this.process.stdout.on("data", data => this.interactorProcess.stdin.write(data));
    }

    prepareFiles() {
        super.prepareFiles();
        for (let file in this.interactorFiles) {
            let filePath = `${this.dir}/${file}`;
            if (Array.isArray(this.interactorFiles[file])) fs.writeFileSync(filePath, this.interactorFiles[file][0], {encoding: this.interactorFiles[file][1]});
            else fs.writeFileSync(filePath, this.interactorFiles[file]);
        }
    }
}