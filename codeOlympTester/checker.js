export function defaultChecker(checkerConfig) {
    if (!checkerConfig.default) return;
    return function (response, outputFiles, inputText, inputFiles, testResponse, testNumber) {
        let test = checkerConfig.tests[testNumber];
        console.log(testNumber, test);
    }
}