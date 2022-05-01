const {
  Minimax,
  getAverageBranchingFactor,
  getOptimalPath,
} = require("./minimax");

// In this file, some example function calls can be found.
const miniMax = new Minimax();

console.time("solve3x3Time");
console.log("Solving 3x3 Pylos:");
const [bestOpeningMove, score] = miniMax.getBestTurn(
  "3333333333333333000000000000003"
);
console.log("Best opening move: " + bestOpeningMove);
console.log("Leads to forced win in " + (10000 - score) + " moves.");
console.log("Max Depth: " + miniMax.maxDepth);
console.log("# of states visited: " + miniMax.totalStates);
console.timeEnd("solve3x3Time");

console.time("avgBranching3x3Time");
console.log("\nAverage branching factor for 3x3 Pylos:");
console.log(
  "Avg. branching factor: " +
    getAverageBranchingFactor("3333333333333333000000000000003", 100000)
);
console.timeEnd("avgBranching3x3Time");

console.time("optimalPath3x3Time");
console.log("\nSample game with optimal play for both players in 3x3 Pylos:");
console.log("This might take a moment...");
console.log(getOptimalPath("3333333333333333000000000000003"));
console.timeEnd("optimalPath3x3Time");
