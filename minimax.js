const { getReachableStates, calculateWinner } = require("./game");
const { PLAYER_1, PLAYER_2, EMPTY } = require("./Types");

class Minimax {
  constructor(maxPlayer) {
    this.savedState = null;
    this.maxPlayer = maxPlayer;
    this.totalStates = 0;
    this.visitedStatesMap = {};
    this.totalTerminalStates = 0;
    this.maxDepth = 0;
    this.printFlag = true;
  }

  setMaxPlayer = (maxPlayer) => {
    this.maxPlayer = maxPlayer;
  };

  getMaxPlayer = () => this.maxPlayer;

  getBestTurn = (state) => {
    const ultimateWinner = this.max(state);
    return [this.savedState, ultimateWinner];
  };

  evaluateState = (state, depth = 0) => {
    this.totalTerminalStates++;
    if (depth > this.maxDepth) this.maxDepth = depth;
    const multiplier = this.maxPlayer === PLAYER_2 ? -1 : 1;

    // TODO order by turns left to achieve -> subtract depth
    switch (calculateWinner(state)) {
      case PLAYER_1:
        return 10000 * multiplier - depth * multiplier;
      case PLAYER_2:
        return -10000 * multiplier + depth * multiplier;
      default:
        return 0;
    }
  };

  stateSortingFuncPrimitive = (a, b) => {
    if (parseInt(a, 4) > parseInt(b, 4)) {
      return 1;
    } else if (parseInt(a, 4) < parseInt(b, 4)) {
      return -1;
    } else {
      return 0;
    }
  };

  stateSortingFuncReachableStates = (a, b) => {
    const reachableA = getReachableStates(a).size;
    const reachableB = getReachableStates(b).size;

    return reachableA - reachableB;
  };

  stateSortingHeuristic = (a, b) => {
    return this.marbleHeuristic(a) - this.marbleHeuristic(b);
  };

  marbleHeuristic = (state) => {
    const curSpots = state.split("");

    const lastPlayer = curSpots.pop();

    const newPlayer = lastPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1;

    let count = 0;

    curSpots.forEach((spot) => {
      if (spot === newPlayer) count++;
    });

    return count;
  };

  max = (
    state,
    depth = 0,
    alpha = Number.NEGATIVE_INFINITY,
    beta = Number.POSITIVE_INFINITY,
    previousStatesVisited = new Set(),
    path = []
  ) => {
    // if (depth >= 1000 && this.printFlag) {
    //   console.dir(path, { maxArrayLength: null });
    //   this.printFlag = false;
    //   return 0;
    // }
    // const newPath = [...path, state];
    // console.log(state);
    const reachableStates = getReachableStates(state);

    // if (this.totalStates % 50000 === 0)
    //   console.log(
    //     this.totalStates,
    //     depth,
    //     "max",
    //     this.totalTerminalStates,
    //     Object.keys(this.visitedStatesMap).length,
    //     state,
    //     reachableStates.size
    //   );

    if (
      !reachableStates ||
      reachableStates.size <= 0 ||
      calculateWinner(state) !== EMPTY
    ) {
      return this.evaluateState(state, depth);
    }

    // do not consider games with more than 1000 moves
    // if (depth >= 1000) return 0;

    let maxValue = alpha;

    // reachableStates - visitedStates = only the NEW states get to move forward
    // const newStates = new Set(
    //   [...reachableStates].filter(
    //     (reachableState) => !this.visitedStates.has(reachableState)
    //   )
    // );

    // newStates.forEach((newState) => {
    //   this.visitedStates.add(newState);
    // });

    // const newStates = new Set();
    // const newPreviousStatesVisited = new Set([...previousStatesVisited]);

    // for (let reachableState of reachableStates) {
    //   if (!newPreviousStatesVisited.has(reachableState)) {
    //     newStates.add(reachableState);
    //     newPreviousStatesVisited.add(reachableState);
    //   }
    // }

    const newStatesArr = [...reachableStates].sort(
      this.stateSortingFuncReachableStates
    );

    for (let nextState of newStatesArr) {
      this.totalStates++;
      let nextValue;
      // if (this.visitedStatesMap[nextState]) {
      //   nextValue = this.visitedStatesMap[nextState];
      // } else {
      nextValue = this.min(
        nextState,
        depth + 1,
        maxValue,
        beta
        // newPreviousStatesVisited,
        // newPath
      );
      // Add to dynamic programming map
      //   if (nextValue < 1000000 && nextValue > -1000000) {
      //     this.visitedStatesMap[nextState] = nextValue;
      //   }
      // }

      if (nextValue > maxValue) {
        maxValue = nextValue;

        if (depth === 0) {
          this.savedState = nextState;
        }

        if (maxValue >= beta) {
          break;
        }
      }
    }
    return maxValue;
  };

  min = (
    state,
    depth,
    alpha,
    beta,
    previousStatesVisited = null,
    path = null
  ) => {
    // console.log(state);
    const reachableStates = getReachableStates(state);

    // const newPath = [...path, state];

    // if (this.totalStates % 50000 === 0)
    //   console.log(
    //     this.totalStates,
    //     depth,
    //     "min",
    //     this.totalTerminalStates,
    //     Object.keys(this.visitedStatesMap).length,
    //     state,
    //     reachableStates.size
    //   );

    if (
      !reachableStates ||
      reachableStates.size <= 0 ||
      calculateWinner(state) !== EMPTY
    ) {
      return this.evaluateState(state, depth);
    }

    // do not consider games with more than 1000 moves
    // if (depth >= 1000) return 0;

    let minValue = beta;

    // reachableStates - visitedStates = only the NEW states get to move forward
    // const newStates = new Set(
    //   [...reachableStates].filter(
    //     (reachableState) => !this.visitedStates.has(reachableState)
    //   )
    // );

    // newStates.forEach((newState) => {
    //   this.visitedStates.add(newState);
    // });

    // const newStates = new Set();

    // for (let reachableState of reachableStates) {
    //   if (!this.visitedStates.has(reachableState)) {
    //     newStates.add(reachableState);
    //     this.visitedStates.add(reachableState);
    //   }
    // }

    // const newStates = new Set();
    // const newPreviousStatesVisited = new Set([...previousStatesVisited]);

    // for (let reachableState of reachableStates) {
    //   if (!newPreviousStatesVisited.has(reachableState)) {
    //     newStates.add(reachableState);
    //     newPreviousStatesVisited.add(reachableState);
    //   }
    // }

    const newStatesArr = [...reachableStates].sort(
      this.stateSortingFuncReachableStates
    );

    for (let nextState of newStatesArr) {
      this.totalStates++;
      let nextValue;
      // if (this.visitedStatesMap[nextState]) {
      //   nextValue = this.visitedStatesMap[nextState];
      // } else {
      nextValue = this.max(
        nextState,
        depth + 1,
        alpha,
        minValue
        // newPreviousStatesVisited,
        // newPath
      );
      // Add to dynamic programming map
      //   if (nextValue < 1000000 && nextValue > -1000000) {
      //     this.visitedStatesMap[nextState] = nextValue;
      //   }
      // }

      if (nextValue < minValue) {
        minValue = nextValue;

        if (minValue <= alpha) break;
      }
    }
    return minValue;
  };
}

const getOptimalPath = (state) => {
  const maxPlayer = state.split("").pop() === PLAYER_1 ? PLAYER_2 : PLAYER_1;

  const minimax = new Minimax(maxPlayer);

  const path = [state];

  const queue = [state];

  while (queue.length > 0) {
    const curState = queue.shift();

    const [nextState, winner] = minimax.getBestTurn(curState);

    path.push(nextState);

    // console.log(curState, minimax.getMaxPlayer());

    // only continue until terminal state is reached
    if (calculateWinner(nextState) === EMPTY) {
      queue.push(nextState);
    }

    minimax.setMaxPlayer(
      minimax.getMaxPlayer() === PLAYER_1 ? PLAYER_2 : PLAYER_1
    );
  }

  return path;
};

const getAverageBranchingFactor = (state, maxTotal = 10000) => {
  let branchingFactorAcc = 0;
  let numOfStates = 0;

  let queue = [state];

  const alreadyVisited = new Set();

  while (queue.length > 0 && numOfStates <= maxTotal) {
    const curState = queue.shift();

    const nextStates = getReachableStates(curState);

    branchingFactorAcc += nextStates.size;
    numOfStates++;

    const newStates = new Set();

    for (let reachableState of nextStates) {
      if (!alreadyVisited.has(reachableState)) {
        newStates.add(reachableState);
        alreadyVisited.add(reachableState);
      }
    }

    queue = [...queue, ...newStates];
  }

  console.log("total states: " + numOfStates);
  return branchingFactorAcc / numOfStates;
};

module.exports = {
  Minimax,
  getAverageBranchingFactor,
  getOptimalPath,
};
