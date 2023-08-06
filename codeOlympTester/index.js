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

export * from "./taskSolutionSingleTestTester.js";
export * from "./normalTaskSolutionSingleTestTester.js";

export * from "./taskSolutionTester.js";
export * from "./normalTaskSolutionTester.js";

export * from "./slot.js";
export * from "./slotManager.js";
export * from "./types.js";
export * from "./cherckers/index.js";
export * from "./runers.js";