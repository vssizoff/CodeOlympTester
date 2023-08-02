import checkStructure from "./defaultStructureChecker.js";

export default function defaultChecker(checkerConfig) {
    if (!checkerConfig.default) return;
    return function (response, outputFiles, inputText, inputFiles, testResponse, testNumber) {
        let test = checkerConfig.tests[testNumber];
        if (!checkStructure(checkerConfig.structure, "4\n" + response/*.replaceAll('\n', "\n\n")*/, test.vars, {
            endls: checkerConfig.endls,
            spaces: checkerConfig.spaces,
            trim: checkerConfig.trim,
        })) return false;
        return true;
    }
}