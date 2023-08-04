import {spawn} from "child_process";
import * as fs from "fs";

export default function customChecker (checkerConfig, cwd) {
    return function (response, outputFiles, inputText, inputFiles, testResponse, testNumber) {
        return new Promise(async resolve => {
            response = response.replaceAll("\r\n", '\n').replaceAll('\r', '\n');
            try {
                fs.accessSync(cwd);
            }
            catch (error) {
                fs.mkdirSync(cwd);
            }
            Object.keys(checkerConfig.files).forEach(key => fs.writeFileSync(`${cwd}/${key}`, checkerConfig.files[key]));
            let subProcess = spawn(checkerConfig.cmd, {
                cwd,
                shell: true
            });
            let verdict = -1;
            subProcess.on("exit", code => {
                while (true) {
                    try {
                        fs.rmSync(cwd, {recursive: true});
                    }
                    catch (error) {
                        break;
                    }
                }
                resolve(verdict);
            });
            subProcess.stdout.on("data", data => {
                data = data.toString().replaceAll("\r\n", '\n').replaceAll('\r', '\n');
                if (data[data.length - 1] === '\n') data = data.substring(0, data.length - 1);
                // console.log(data);
                let key = data.split(' ')[0];
                if (key.startsWith("config.files.")) {
                    subProcess.stdin.write(checkerConfig.files[key.substring("config.files.".length)].toString().replaceAll("\r\n", "\\n").replaceAll('\r', '\\n').replaceAll('\n', '\\n') + "\n");
                    return;
                }
                if (key.startsWith("config.tests.correctAnswers.")) {
                    subProcess.stdin.write(checkerConfig.tests[Number(key.substring("config.tests.correctAnswers.".length))].correctAnswers.map(elem => elem.replaceAll('\n', "\\n")).join(data.substring(key.length + 1)) + '\n');
                    return;
                }
                if (key.startsWith("config.tests.info.")) {
                    subProcess.stdin.write(checkerConfig.tests[Number(key.substring("config.tests.info.".length))].info.join(data.substring(key.length + 1)) + '\n');
                    return;
                }
                if (key.startsWith("config.tests.")) {
                    subProcess.stdin.write(JSON.stringify(checkerConfig.tests[Number(key.substring("config.tests.".length))]) + '\n');
                    return;
                }
                if (key.startsWith("config.inputFiles.")) {
                    subProcess.stdin.write(inputFiles[key.substring("config.inputFiles.".length)].toString().replaceAll("\r\n", "\\n").replaceAll('\r', '\\n').replaceAll('\n', '\\n') + '\n');
                    return;
                }
                if (key.startsWith("config.outputFiles.")) {
                    subProcess.stdin.write(outputFiles[key.substring("config.outputFiles.".length)].toString().replaceAll("\r\n", "\\n").replaceAll('\r', '\\n').replaceAll('\n', '\\n') + '\n');
                    return;
                }
                switch (key) {
                    case "verdict":
                        verdict = Number(data.split(' ')[1]);
                        break;
                    case "config":
                        subProcess.stdin.write(JSON.stringify({...checkerConfig, files: "to see files request config.files"}) + '\n');
                        break;
                    case "config.default":
                        subProcess.stdin.write("0\n");
                        break;
                    case "config.useCorrectAnswers":
                        subProcess.stdin.write(checkerConfig.useCorrectAnswers ? "1\n" : "0\n");
                        break;
                    case "config.cmd":
                        subProcess.stdin.write(checkerConfig.cmd + '\n');
                        break;
                    case "config.files":
                        subProcess.stdin.write(JSON.stringify(checkerConfig.files) + '\n');
                        break;
                    case "config.filesKeys":
                        subProcess.stdin.write(Object.keys(checkerConfig.files).join(data.substring(key.length + 1)) + '\n');
                        break;
                    case "config.info":
                        subProcess.stdin.write(`${checkerConfig.info}\n`);
                        break;
                    case "config.tests":
                        subProcess.stdin.write(JSON.stringify(checkerConfig.tests) + '\n');
                        break;
                    case "config.tests.length":
                        subProcess.stdin.write(`${checkerConfig.tests.length}\n`);
                        break;
                    case "config.tests.correctAnswers":
                        subProcess.stdin.write(checkerConfig.tests.map(elem => elem.correctAnswers.map(elem => elem.replaceAll('\n', "\\n"))).join(data.substring(key.length + 1)) + '\n');
                        break;
                    case "config.tests.info":
                        subProcess.stdin.write(checkerConfig.tests.map(elem => elem.info).join(data.substring(key.length + 1)) + '\n');
                        break;
                    case "outputFiles":
                        subProcess.stdin.write(JSON.stringify(outputFiles) + '\n');
                        break;
                    case "outputFilesKeys":
                        subProcess.stdin.write(Object.keys(outputFiles).join(data.substring(key.length + 1)) + '\n');
                        break;
                    case "inputFiles":
                        subProcess.stdin.write(JSON.stringify(inputFiles) + '\n');
                        break;
                    case "inputFilesKeys":
                        subProcess.stdin.write(Object.keys(inputFiles).join(data.substring(key.length + 1)) + '\n');
                        break;
                    case "inputText":
                        subProcess.stdin.write(inputText.replaceAll("\n", "\\n") + '\n');
                        break;
                    case "test":
                        subProcess.stdin.write(JSON.stringify(checkerConfig.tests[testNumber]) + '\n');
                        break;
                    case "test.correctAnswers":
                        subProcess.stdin.write(checkerConfig.tests[testNumber].correctAnswers.join(data.substring(key.length + 1)) + '\n');
                        break;
                    case "test.info":
                        subProcess.stdin.write(checkerConfig.tests[testNumber].info + '\n');
                        break;
                    case "testNumber":
                        subProcess.stdin.write(`${testNumber}\n`);
                        break;
                    default:
                        subProcess.stdin.write("undefined\n");
                }
            });
            subProcess.stdin.write(response.replaceAll("\n", "\\n") + '\n');
        });
    }
}