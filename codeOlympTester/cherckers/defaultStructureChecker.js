import {Types} from "../types.js";
import compileStructure from "./defaultStructureCompiler.js";

export default function checkStructure(structure, response, vars, config) {
    response = response.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
    structure = compileStructure(structure, response, vars, config);
    console.log(structure);
    if (config.trim) response = response.trim();
    if (!config.spaces && !config.endls) {
        response = response.split('\n').map(elem => config.trim ? elem.trim() : elem);
        let newStructure = [];
        // for (let structureElement of structure) {
        //     newStructure.push(...structureElement);
        // }
        for (let i = 0; i < structure.length; i++) {
            if (Array.isArray(structure[i])) newStructure.push(...structure[i]);
            else response.splice(i, 1);
        }
        response = Array.from(response.join('\n').replaceAll(' \n', ' ').replaceAll('\n', ' '))
            .filter((value, index, array) => value !== ' ' || (index <= 0 || array[index - 1] !== ' '));
        if (newStructure.length > response.length) return false;
        response = response.join("").split(' ');
        for (let i = 0; i < newStructure.length; i++) {
            switch (newStructure[i]) {
                case Types.bool:
                    let value = response[i].trim().toLowerCase();
                    if (value !== "true" && value !== "yes" && value !== "1" && value !== "t" && value !== "y" && value !== "false" && value !== "no" && value !== "0" && value !== "f" && value !== "n") {
                        return false;
                    }
                    break;
                case Types.int:
                    if (!response[i].trim().length || isNaN(Number(response[i])) || response[i].includes('.')) return false;
                    break;
                case Types.float:
                    if (!response[i].trim().length || isNaN(Number(response[i]))) return false;
                    break;
                case Types.string:
                    break;
            }
        }
    }
    else if (!config.spaces) {
        response = response.split('\n').map(elem => Array.from(config.trim ? elem.trim() : elem)
            .filter((value, index, array) => value !== ' ' || (index <= 0 || array[index - 1] !== ' ')));
        if (response.length < structure.length) return false;
        response = response.map((value, index) => Array.isArray(structure[index]) ? value.join("").split(' ') : value.join(""));
        for (let index = 0; index < response.length; index++) {
            let row = response[index];
            if (!Array.isArray(row)) break;
            if (row.length < structure[index].length) return false;
            for (let i = 0; i < structure[index].length; i++) {
                switch (structure[index][i]) {
                    case Types.bool:
                        let value = row[i].trim().toLowerCase();
                        if (value !== "true" && value !== "yes" && value !== "1" && value !== "t" && value !== "y" && value !== "false" && value !== "no" && value !== "0" && value !== "f" && value !== "n") {
                            return false;
                        }
                        break;
                    case Types.int:
                        if (!row[i].trim().length || isNaN(Number(row[i])) || row[i].includes('.')) return false;
                        break;
                    case Types.float:
                        if (!row[i].trim().length || isNaN(Number(row[i]))) return false;
                        break;
                    case Types.string:
                        break;
                }
            }
        }
    }
    else if (!config.endls) {
        response = response.split('\n').map(elem => config.trim ? elem.trim() : elem);
        let newStructure = [];
        for (let i = 0; i < structure.length; i++) {
            if (Array.isArray(structure[i])) newStructure.push(...structure[i]);
            else response.splice(i, 1);
        }
        response = Array.from(response.join('\n').replaceAll(' \n', ' ').replaceAll('\n', ' '));
        if (newStructure.length > response.length) return false;
        response = response.join("").split(' ');
        for (let i = 0; i < newStructure.length; i++) {
            switch (newStructure[i]) {
                case Types.bool:
                    let value = response[i].trim().toLowerCase();
                    if (value !== "true" && value !== "yes" && value !== "1" && value !== "t" && value !== "y" && value !== "false" && value !== "no" && value !== "0" && value !== "f" && value !== "n") {
                        return false;
                    }
                    break;
                case Types.int:
                    if (!response[i].trim().length || isNaN(Number(response[i])) || response[i].includes('.')) return false;
                    break;
                case Types.float:
                    if (!response[i].trim().length || isNaN(Number(response[i]))) return false;
                    break;
                case Types.string:
                    break;
            }
        }
    }
    else {
        response = response.split('\n').map(elem => Array.from(config.trim ? elem.trim() : elem));
        if (response.length < structure.length) return false;
        response = response.map((value, index) => Array.isArray(structure[index]) ? value.join("").split(' ') : value.join(""));
        for (let index = 0; index < response.length; index++) {
            let row = response[index];
            if (!Array.isArray(row)) break;
            if (row.length < structure[index].length) return false;
            for (let i = 0; i < structure[index].length; i++) {
                switch (structure[index][i]) {
                    case Types.bool:
                        let value = row[i].trim().toLowerCase();
                        if (value !== "true" && value !== "yes" && value !== "1" && value !== "t" && value !== "y" && value !== "false" && value !== "no" && value !== "0" && value !== "f" && value !== "n") {
                            return false;
                        }
                        break;
                    case Types.int:
                        if (!row[i].trim().length || isNaN(Number(row[i])) || row[i].includes('.')) return false;
                        break;
                    case Types.float:
                        if (!row[i].trim().length || isNaN(Number(row[i]))) return false;
                        break;
                    case Types.string:
                        break;
                }
            }
        }
    }
    return true;
}