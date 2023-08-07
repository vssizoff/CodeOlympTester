JSON.safeStringify = (obj, indent = 2) => {
    let cache = [];
    const retVal = JSON.stringify(
        obj,
        (key, value) =>
            typeof value === "object" && value !== null
                ? cache.includes(value)
                    ? undefined
                    : cache.push(value) && value
                : value,
        indent
    );
    cache = null;
    return retVal;
};

export * from "./problemSolutionSingleTestTester.js";
export * from "./normalProblemSolutionSingleTestTester.js";
export * from "./interactiveProblemSolutionSingleTestTester.js";

export * from "./problemSolutionTester.js";
export * from "./normalProblemSolutionTester.js";
export * from "./interactiveProblemSolutionTester.js";

export * from "./slot.js";
export * from "./slotManager.js";
export * from "./types.js";
export * from "./cherckers/index.js";
export * from "./runers.js";