<p align="center">CodeOlympTester</p>

# Table of Contents
> 1. [Installation](#installation)
> 2. [Task structure](#slot-managers)
> 3. [Solution structure](#solution-structure)
> 4. [Solution running](#solution-running)
> 5. [Slots](#slots)
> 6. [Slot managers](#slot-managers)

# Installation
* Init node project
* Type this in console
```
npm i code-olymp-tester
```

# Task structure
## Normal problem
```json
{
  "title": "test",
  "content": "Test problem",
  "format": "tex || md || html || pdf",
  "timeLimit": 200,
  "ramLimit": 100,
  "tests": [
    {
      "text": "4 4\n0 1\n1 2\n2 3\n3 0\n",
      "files": {}
    },
    {
      "text": "4 3\n0 1\n1 2\n2 3\n",
      "files": {}
    }
  ],
  "interactive": false,
  "checker": {
    "default": true,
    "endls": false,
    "spaces": false,
    "trim": true,
    "structure": [
      {
        "var": "n",
        "type": 1
      },
      {
        "count": "n",
        "value": {
          "count": "n",
          "type": 1
        }
      }
    ],
    "info": null,
    "tests": [
      {
        "correctAnswers": [
          "4\n0 1 0 0\n0 0 1 0\n0 0 0 1\n1 0 0 0"
        ],
        "info": null,
        "vars": {}
      },
      {
        "correctAnswers": [
          "4\n0 1 0 0\n0 0 1 0\n0 0 0 1\n0 0 0 0"
        ],
        "info": null,
        "vars": {}
      }
    ],
    "stdout": true
  }
}
```
## Custom checker problem
```json
{
  "title": "test",
  "content": "Test problem",
  "format": "tex || md || html || pdf",
  "timeLimit": 200,
  "ramLimit": 100,
  "tests": [
    {
      "text": "4 4\n0 1\n1 2\n2 3\n3 0\n",
      "files": {}
    },
    {
      "text": "4 3\n0 1\n1 2\n2 3\n",
      "files": {}
    }
  ],
  "interactive": false,
  "checker": {
    "info": null,
    "tests": [
      {
        "correctAnswers": [
          "4\n0 1 0 0\n0 0 1 0\n0 0 0 1\n1 0 0 0"
        ],
        "info": null,
        "vars": {}
      },
      {
        "correctAnswers": [
          "4\n0 1 0 0\n0 0 1 0\n0 0 0 1\n0 0 0 0"
        ],
        "info": null,
        "vars": {}
      }
    ],
    "default": false,
    "useCorrectAnswers": true,
    "cmd": "checker.exe",
    "files": {
      "checker.exe": "./checker.exe",
      "in.txt": "./in.txt"
    }
  }
}
```
## Interactive problem
```json
{
  "title": "test",
  "content": "Test problem",
  "format": "tex || md || html || pdf",
  "timeLimit": 200,
  "ramLimit": 100,
  "testsCount": 2,
  "interactive": true,
  "interactor": {
    "cmd": "interactor.exe",
    "files": {
      "interactor.exe": "./interactor.exe",
      "in.txt": "./in0.txt"
    },
    "info": null,
    "tests": [
      null,
      null
    ]
  }
}
```
## Solution output structure
problem.checker.structure
```json
[
  {
    "var": "n",
    "type": 1
  },
  {
    "count": "n",
    "value": {
      "count": "n",
      "type": 1
    }
  }
]
```
# Solution structure
```json
{
  "files": {
    "solution.js": "./solution.js"
  },
  "cmd": "node solution.js"
}
```
# Solution running
```javascript
import {runFromJSON} from "code-olymp-tester";
import * as fs from "fs";

runFromJSON(
    fs.readFileSync("./someProblem.json", {encoding: "utf8"}),
    fs.readFileSync("./someSolution.json", {encoding: "utf8"})
).then(response => {
    console.log(response.responsesMainData, response.responses.map(elem => elem.status), response.status);
});
```
# Slots
```javascript
import {Slot} from "code-olymp-tester";
import * as fs from "fs";

let slot = new Slot("./test");

slot.runFromJSON(
    fs.readFileSync("./someProblem.json", {encoding: "utf8"}),
    fs.readFileSync("./someSolution.json", {encoding: "utf8"})
).then(response => {
    console.log(response.responsesMainData, response.responses.map(elem => elem.status), response.status);
});

slot.runFromJSON(
    fs.readFileSync("./someProblem.json", {encoding: "utf8"}),
    fs.readFileSync("./someSolution2.json", {encoding: "utf8"})
).then(response => {
    console.log(response.responsesMainData, response.responses.map(elem => elem.status), response.status);
});

slot.runFromJSON(
    fs.readFileSync("./someProblem2.json", {encoding: "utf8"}),
    fs.readFileSync("./someSolution3.json", {encoding: "utf8"})
).then(response => {
    console.log(response.responsesMainData, response.responses.map(elem => elem.status), response.status);
});
```
# Slot managers
```javascript
import {SlotManager} from "code-olymp-tester";
import * as fs from "fs";

let slotManager = new SlotManager("./test", 2);

slotManager.runFromJSON(
    fs.readFileSync("./someProblem.json", {encoding: "utf8"}),
    fs.readFileSync("./someSolution.json", {encoding: "utf8"})
).then(response => {
    console.log(response.responsesMainData, response.responses.map(elem => elem.status), response.status);
});

slotManager.runFromJSON(
    fs.readFileSync("./someProblem.json", {encoding: "utf8"}),
    fs.readFileSync("./someSolution2.json", {encoding: "utf8"})
).then(response => {
    console.log(response.responsesMainData, response.responses.map(elem => elem.status), response.status);
});

slotManager.runFromJSON(
    fs.readFileSync("./someProblem2.json", {encoding: "utf8"}),
    fs.readFileSync("./someSolution3.json", {encoding: "utf8"})
).then(response => {
    console.log(response.responsesMainData, response.responses.map(elem => elem.status), response.status);
});
```