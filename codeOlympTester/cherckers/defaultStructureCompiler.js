export default function compileStructure (structure, response, vars, config) {
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