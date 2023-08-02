import checkStructure from "./defaultStructureChecker.js";
import compileStructure from "./defaultStructureCompiler.js";

export default function defaultChecker(checkerConfig) {
    if (!checkerConfig.default) return;
    return function (response, outputFiles, inputText, inputFiles, testResponse, testNumber) {
        let test = checkerConfig.tests[testNumber], structure = compileStructure(checkerConfig.structure, response, test.vars, {
            endls: checkerConfig.endls,
            spaces: checkerConfig.spaces,
            trim: checkerConfig.trim,
        });
        response = "4\n" + response
        if (!checkStructure(structure, response, test.vars, {
            endls: checkerConfig.endls,
            spaces: checkerConfig.spaces,
            trim: checkerConfig.trim,
        })) return false;

        let tmp = [];
        structure.forEach(elem => Array.isArray(elem) ? tmp.push(...elem) : tmp.push(elem));

        let ans = test.correctAnswers.map(correctAnswer => {
            let nextElem = (responseIndex = 0, correctAnswerIndex = 0) => {
                if (response.length <= responseIndex || correctAnswer.length <= correctAnswerIndex) return true;
                if (response[responseIndex].trim() === "") return nextElem(responseIndex + 1, correctAnswerIndex);
                if (correctAnswer[correctAnswerIndex].trim === "") return nextElem(responseIndex, correctAnswerIndex + 1);

            }
            return nextElem();
        });

        for (let a of ans) {
            if (!a) return false;
        }

        return true;
    }
}