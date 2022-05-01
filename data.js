// func for storing data in csv
const fs = require("fs");

const version = 7;
const filename = `3x3_bfs_v${version}_15reserve_rotationElimination`;
const folder = "output/";

const writeStatesToCsv = (states) => {
  console.log("writing states to csv...");
  const logger = fs.createWriteStream(`${folder}${filename}.csv`, {
    flags: "a",
  });
  states.forEach((state) => {
    logger.write(state + "\n");
  });

  console.log("write states to csv completed!");
};

const writePredecessorMapToJson = (predecessorMap) => {
  console.log("writing predecessormap to json...");
  const logger = fs.createWriteStream(
    `${folder}PREDECESSORS_${filename}.json`,
    {
      flags: "a",
    }
  );

  logger.write(JSON.stringify(predecessorMap));
  console.log("successfully written predecessormap to json!");
};

const writeSuccessorMapToJson = (successorMap) => {
  console.log("writing successorMap to json...");
  const logger = fs.createWriteStream(`${folder}SUCCESSORS_${filename}.json`, {
    flags: "a",
  });

  logger.write(JSON.stringify(successorMap));
  console.log("successfully written successorMap to json!");
};

const writeWinnerMapToJson = (winnerMap) => {
  console.log("writing winnerMap to json...");
  const logger = fs.createWriteStream(`${folder}WINNERS_${filename}.json`, {
    flags: "a",
  });

  logger.write(JSON.stringify(winnerMap));
  console.log("successfully written winnerMap to json!");
};

const writeVisitedMapToJson = (visitedMap) => {
  console.log("writing visitedMap to json...");
  const logger = fs.createWriteStream(`${folder}VISITED_${filename}.json`, {
    flags: "a",
  });

  logger.write(JSON.stringify(visitedMap));
  console.log("successfully written visitedMap to json!");
};

const readPredecessorMapFromJson = () => {};

module.exports = {
  writeStatesToCsv,
  writePredecessorMapToJson,
  writeSuccessorMapToJson,
  writeWinnerMapToJson,
  writeVisitedMapToJson,
};
