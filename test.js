import {spawn} from "child_process";

let subProcess = spawn("test.exe", [], {
    // stdio: "inherit",
    shell: true
}), response = "";
subProcess.stdout.on("data", chunk => response += chunk.toString());
subProcess.on("exit", code => {
    console.log(response);
});
subProcess.stdin.write("4 4\n0 1\n1 2\n2 3\n3 0\n");