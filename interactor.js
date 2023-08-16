import fs from "fs";
import * as readline from "readline";

let rl = readline.createInterface({input: process.stdin, output: process.stdout});
console.log("! ");
console.log("test\ntest\n");
process.stdin.on("data", data => {
    let output = data.toString();
    fs.readFileSync("./in.txt", {encoding: "utf8"}).split('\n').forEach(elem => {
        if (elem.startsWith('0')) return console.log("! 0");
        rl.question("! " + elem + '\n', data => output += `\n${elem}: ${data}`);
    });
    // fs.writeFileSync("../test.txt", output, {encoding: "utf8"});
    // process.exit();
});