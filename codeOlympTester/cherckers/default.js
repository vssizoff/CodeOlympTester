import checkStructure from "./defaultStructureChecker.js";
import compileStructure from "./defaultStructureCompiler.js";
import {Types} from "../types.js";

export default function defaultChecker(checkerConfig) {
    if (!checkerConfig.default) return;
    return function (response, outputFiles, inputText, inputFiles, testResponse, testNumber) {
        response = response.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
        let test = checkerConfig.tests[testNumber], structure = compileStructure(checkerConfig.structure, response, test.vars, {
            endls: checkerConfig.endls,
            spaces: checkerConfig.spaces,
            trim: checkerConfig.trim,
        });
        if (!checkStructure(structure, response, test.vars, {
            endls: checkerConfig.endls,
            spaces: checkerConfig.spaces,
            trim: checkerConfig.trim,
        })) return 2;

        // let tmp = [];
        // structure.forEach(elem => Array.isArray(elem) ? tmp.push(...elem) : tmp.push(elem));

        let ans = test.correctAnswers.map(correctAnswer => {
            let nextElem = (responseIndex = 0, correctAnswerIndex = 0, si = 0, sj = 0) => {
                if (response.length <= responseIndex || correctAnswer.length <= correctAnswerIndex || si >= structure.length) return true;
                if (response[responseIndex].trim() === "") return nextElem(responseIndex + 1, correctAnswerIndex, si, sj);
                if (correctAnswer[correctAnswerIndex].trim() === "") return nextElem(responseIndex, correctAnswerIndex + 1, si, sj);
                if ((!Array.isArray(structure[si]) && sj !== 0) || sj >= structure[si].length) return nextElem(responseIndex, correctAnswerIndex, si + 1);
                let responseElem = "", correctAnswerElem = "", responseFlag = false, correctAnswerFlag = false;
                while (!responseFlag && !correctAnswerFlag) {
                    if (response.length > responseIndex + responseElem.length && !responseFlag && response[responseIndex + responseElem.length].trim() !== "") {
                        responseElem += response[responseIndex + responseElem.length];
                    }
                    else responseFlag = true;
                    if (correctAnswer.length > correctAnswerIndex + correctAnswerElem.length && !correctAnswerFlag && correctAnswer[correctAnswerIndex + correctAnswerElem.length].trim() !== "") {
                        correctAnswerElem += correctAnswer[correctAnswerIndex + correctAnswerElem.length];
                    }
                    else correctAnswerFlag = true;
                }
                // console.log(responseElem, correctAnswerElem);
                if ((Array.isArray(structure[si]) ? structure[si][sj] : structure[si]) === Types.bool) {
                    responseElem = responseElem.trim(); correctAnswerElem = correctAnswerElem.trim();
                    responseElem = responseElem === '1' || responseElem === 'y' || responseElem === 't' || responseElem === "yes" || responseElem === "true";
                    correctAnswerElem = correctAnswerElem === '1' || correctAnswerElem === 'y' || correctAnswerElem === 't' || correctAnswerElem === "yes" || correctAnswerElem === "true";
                }
                if (responseElem !== correctAnswerElem) return false;
                return nextElem(responseIndex + responseElem.length, correctAnswerIndex + correctAnswerElem.length, si, sj + 1);
            }
            return nextElem();
        });

        for (let a of ans) {
            if (!a) return 1;
        }

        return 0;
    }
}