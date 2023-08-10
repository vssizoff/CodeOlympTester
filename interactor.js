import fs from "fs";

console.log("! ");
console.log("test\ntest\n");
process.stdin.on("data", data => {
    fs.writeFileSync("../test.txt", data.toString(), {encoding: "utf8"});
    console.log("! 0");
    process.exit();
});