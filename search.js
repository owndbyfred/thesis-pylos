const {
  writePredecessorMapToJson,
  writeStatesToCsv,
  writeSuccessorMapToJson,
  writeWinnerMapToJson,
  writeVisitedMapToJson,
} = require("./data");
const { getReachableStates, calculateWinner } = require("./game");
const { EMPTY, PLAYER_1, PLAYER_2 } = require("./Types");

const allStates = new Set();
const allStatesWithWinner = new Set();
const predecessorMap = {};
const successorMap = {};
const winnerMap = {};
const maxDepth = 2000;

// func for searching all states
const search = (state, depth) => {
  const reachableStates = getReachableStates(state);

  if (reachableStates.size <= 0 || depth >= maxDepth) {
    console.log("reached end, depth: " + depth);
    console.log(state);
    return;
  }

  // Add predecessors
  reachableStates.forEach((reachableState) => {
    if (!predecessorMap[reachableState]) predecessorMap[reachableState] = [];
    predecessorMap[reachableState].push(state);
  });

  // reachableStates - allStates = only the NEW states get to move forward
  const newStates = new Set(
    [...reachableStates].filter(
      (reachableState) => !allStates.has(reachableState)
    )
  );

  newStates.forEach((newState) => {
    allStates.add(newState);
    search(newState, depth + 1);
  });
};

const breadthSearch = (state) => {
  const queue = [state];

  allStates.add(state);

  while (queue.length > 0) {
    const newState = queue.shift();

    const reachableStates = getReachableStates(newState);

    // Add predecessors
    reachableStates.forEach((reachableState) => {
      if (!predecessorMap[reachableState]) predecessorMap[reachableState] = [];
      predecessorMap[reachableState].push(newState);
    });

    // Add successors
    reachableStates.forEach((reachableState) => {
      if (!successorMap[newState]) successorMap[newState] = [];
      successorMap[newState].push(reachableState);
    });

    // reachableStates - allStates = only the NEW states get to move forward
    const newStates = new Set(
      [...reachableStates].filter(
        (reachableState) => !allStates.has(reachableState)
      )
    );

    newStates.forEach((newState) => {
      queue.push(newState);
      allStates.add(newState);
    });
  }
};

// TODO: remove successorMap and use getReachableStates instead to save memory
const getAllTerminalStates = () => {
  const terminalStates = [];
  allStates.forEach((state) => {
    if (!successorMap[state] || successorMap[state].length <= 0) {
      terminalStates.push(state);
    }
  });

  return terminalStates;
};

// TODO: remove successorMap and use getReachableStates instead to save memory
const getWinnerFromSuccessors = (state, log = false) => {
  const curSpots = state.split("");

  const lastPlayer = curSpots.pop() === PLAYER_1 ? PLAYER_1 : PLAYER_2;

  const newPlayer = lastPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1;

  const successors = successorMap[state] || getReachableStates(state);

  let winner = lastPlayer;

  for (let i = 0; i < successors.length; i++) {
    const successor = successors[i];
    if (log) console.log(successor, winnerMap[successor]);
    if (winnerMap[successor] === newPlayer) {
      winner = newPlayer;
      break;
    }
  }

  return winner;
};

let tempCount = 0;

const visitedMap = {};

const backpropagateWinners = () => {
  const terminalStates = getAllTerminalStates();

  const queue = terminalStates;

  while (queue.length > 0) {
    tempCount++;

    // if (tempCount % 10000 === 0) {
    //   console.log(tempCount, queue.length);
    // }
    const curState = queue.shift();
    let winner = calculateWinner(curState);

    if (curState === "3333333333333333000000000000003")
      console.log("HOPSASA", winner);
    // console.log(winner);

    if (curState === "3333333333333333100000000000001") {
      console.log("helo");
    }

    if (winner === EMPTY) {
      // use minmax like logic to determine value
      winner = getWinnerFromSuccessors(
        curState,
        curState === "3333333333333333000000000000003"
      );
    }

    if (
      (winner[curState] !== curState.split("").pop()) === PLAYER_1
        ? PLAYER_2
        : PLAYER_1
    ) {
      winnerMap[curState] = winner;
    }

    if (curState === "3333333333333333000000000000003")
      console.log(winnerMap[curState]);

    if (!visitedMap[curState]) visitedMap[curState] = 0;

    visitedMap[curState]++;

    if (visitedMap[curState] > successorMap[curState]?.length) continue;

    const predecessors = predecessorMap[curState];

    predecessors?.forEach((predecessor) => {
      // if (!winnerMap[predecessor]) winnerMap[predecessor] = [];

      // const winner = curWinner !== EMPTY ? curWinner : winnerMap[curState];

      // if (!winnerMap[predecessor].includes(winner))
      //   winnerMap[predecessor].push(winner);

      if (
        !winnerMap[predecessor] ||
        (winnerMap[predecessor] &&
          winnerMap[predecessor] === predecessor.split("").pop())
      ) {
        queue.push(predecessor);
      }
    });
  }
};

const getFirstOptimalPath = (startState) => {
  const finalWinner = winnerMap[startState];

  const path = [startState];

  const queue = [startState];

  while (queue.length > 0) {
    const curState = queue.shift();

    const nextStates = successorMap[curState];

    let found = false;

    // terminal state reached
    if (!nextStates) break;

    for (let i = 0; i < nextStates.length; i++) {
      const nextState = nextStates[i];

      const optimalWinner =
        nextState.split("").pop() === PLAYER_1 ? PLAYER_1 : PLAYER_2;

      if (winnerMap[nextState] === optimalWinner) {
        path.push(nextState);
        queue.push(nextState);
        found = true;
        break;
      }
    }

    if (!found) {
      path.push(nextStates[0]);
      queue.push(nextStates[0]);
    }
  }

  return path;
};

// console.time("executionTime");
// search("0000000000000000000000000000000", 0);
// console.timeEnd("executionTime");
// console.log(allStates.size);
// console.time("writeTime");
// writePredecessorMapToJson(predecessorMap);
// writeStatesToCsv(allStates);
// console.timeEnd("writeTime");

// console.time("executionTime");
// search("3333333333333333000000000000000", 0);
// console.timeEnd("executionTime");
// console.log(allStates.size);
// console.time("writeTime");
// writePredecessorMapToJson(predecessorMap);
// writeStatesToCsv(allStates);
// console.timeEnd("writeTime");

console.time("executionTime");
breadthSearch("3333333333333333000000000000003");
backpropagateWinners();
console.timeEnd("executionTime");
console.log(allStates.size);
console.time("writeTime");
// writePredecessorMapToJson(predecessorMap);
// writeSuccessorMapToJson(successorMap);
// writeStatesToCsv(allStates);
// writeWinnerMapToJson(winnerMap);
// writeVisitedMapToJson(visitedMap);
console.timeEnd("writeTime");
// console.log(getAllTerminalStates());
console.log(winnerMap["3333333333333333100000000000001"]);
console.log(winnerMap["3333333333333333010000000000001"]);
console.log(winnerMap["3333333333333333000010000000001"]);
console.log(winnerMap["3333333333333333100000000000001"]);
console.log(winnerMap["3333333333333333000000000000003"]);
console.log(getFirstOptimalPath("3333333333333333000000000000003"));

// console.log(getReachableStates("3333333333333333000000000000003"));
