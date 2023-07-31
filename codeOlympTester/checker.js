import {Types} from "./types.js";

function compileStructure(structure, response, vars, config) {
    response = response.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
    let newStructure = [], parsedResponse = !config.endls ? (!config.spaces ?
        Array.from(response.replaceAll('\n', ' '))
        .filter((value, index, array) => value !== ' ' || (index <= 0 || array[index - 1] !== ' '))
        .join("") : response.replaceAll(' \n', ' ').replaceAll('\n', ' ')) :
        (!config.spaces ? Array.from(response)
        .filter((value, index, array) => value !== ' ' || (index <= 0 || array[index - 1] !== ' '))
        .join("") : response),
        lineData = response.split('\n').map(elem => elem.trim().split(' ')
            .filter((value, index, array) => value !== ' ' || (index <= 0 || array[index - 1] !== ' ')).length);
    if (config.trim) parsedResponse = parsedResponse.trim();
    let splitedResponse = parsedResponse.replaceAll(" \n", ' ').replaceAll('\n', ' ').split(' ');
    // console.log(structure, vars, lineData);
    // console.log(parsedResponse);
    // console.log(splitedResponse);

    function getVar(a) {
        return splitedResponse[a];
    }

    let a = 0;
    for (let i = 0; i < structure.length; i++)  {
        let structureRow = structure[i], rows = [];
        if (!Array.isArray(structureRow)) {
            if (typeof structureRow === "number") rows = [structureRow];
            else if ("var" in structureRow) {
                vars[structureRow.var] = getVar(a);
                rows = [structureRow.type];
            }
            else if ("count" in structureRow) {
                for (let j = 0; j < vars[structureRow.count]; j++) {
                    rows.push([structureRow.value]);
                }
            }
        }
        else rows = [structureRow];
        let flag = false;
        rows.forEach(row => {
            if (flag) return;
            if (!Array.isArray(row)) {
                a++;
                newStructure.push(row);
                flag = true; return;
            }
            let newRow = [];
            for (let elem of row) {
                let newElements = [];
                if (!Array.isArray(elem)) {
                    if (typeof elem === "number") newElements = [elem];
                    else if ("var" in elem) {
                        vars[elem.var] = getVar(a);
                        newElements = [elem.type];
                    }
                    else if ("count" in elem) {
                        for (let j = 0; j < vars[elem.count]; j++) {
                            newElements.push(elem.type);
                            a++;
                        }
                        a--;
                    }
                }
                else newElements = [elem];
                newRow.push(...newElements);
                a++;
            }
            newStructure.push(newRow);
        });
    }
    return newStructure;
}

function checkStructure(structure, response, vars, config) {
    response = response.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
    structure = compileStructure(structure, response, vars, config);
    if (config.trim) response.trim();
    if (config.spaces && config.endls) {
        response = response.split('\n');
        let newStructure = [];
        for (let structureElement of structure) {

            newStructure.push(...structureElement);
        }
        for (let i = 0; i < structure.length; i++) {
            if (Array.isArray(structure[i])) newStructure.push(...structure[i]);
            else response.splice(i, 1);
        }
        response = Array.from(response.join('\n').replaceAll(' \n', ' ').replaceAll('\n', ' '))
            .filter((value, index, array) => value !== ' ' || (index <= 0 || array[index - 1] !== ' '));
        if (newStructure.length > response.length) return false;
        for (let i = 0; i < newStructure.length; i++) {
            switch (newStructure[i]) {
                case Types.bool:
                    let value = response[i].toLowerCase();
                    if (value !== "true" && value !== "yes" && value !== "1" && value !== "t" && value !== "y" && value !== "false" && value !== "no" && value !== "0" && value !== "f" && value !== "n") {
                        return false;
                    }
                    break;
                case Types.int:
                    if (isNaN(Number(response[i])) || response[i].includes('.')) return false;
                    break;
                case Types.float:
                    if (isNaN(Number(response[i]))) return false;
                    break;
                case Types.string:
                    break;
            }
        }
    }
    else if (config.endls) {
        response = response.split('\n').map(elem => Array.from(elem.trimEnd())
            .filter((value, index, array) => value !== ' ' || (index <= 0 || array[index - 1] !== ' ')));

    }
    else if (config.spaces) {

    }
    else {

    }
    return true;
}

export function defaultChecker(checkerConfig) {
    if (!checkerConfig.default) return;
    return function (response, outputFiles, inputText, inputFiles, testResponse, testNumber) {
        let test = checkerConfig.tests[testNumber];
        if (checkStructure(checkerConfig.structure, response, test.vars, {
            endls: checkerConfig.endls,
            spaces: checkerConfig.spaces,
            trim: checkerConfig.trim,
        })) return false;
        return true;
    }
}