// let stdin = process.openStdin(), i = 0, a;
// stdin.addListener("data", function(data) {
//     i++;
//     if (i === 1) {
//         a = data.toString();
//     }
//     else if (i === 2) {
//
//         for (let j = 0; j < Number(data.toString()); j++) {
//             // console.log(a);
//             process.stdout.write(a);
//         }
//     }
// });

import readline from "readline";

let rl = readline.createInterface({input: process.stdin, output: process.stdout});
rl.question("", a => {
    rl.question("", b => {
        rl.close();
        b = Number(b);
        let str = "";
        for (let i = 0; i < b; i++) {
            str += a;
        }
        console.log(str);
        process.exit();
    });
});
// console.log("test");