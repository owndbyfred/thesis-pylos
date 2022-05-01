/**
 * SCHEMA Board State:
 *
 * String with length 31 and format:
 * Layer by layer, row by row, field by field
 *
 * 1. char is spot 0, 0, 0
 * 2. char is spot 1, 0, 0 etc.
 *
 * 31. char is the player that has made the last turn
 */

const { PLAYER_1, PLAYER_2, EMPTY } = require("./Types");

const RESERVE_MARBLES = 7;

// func for generating new states reachable from given turn
const getReachableStates = (state) => {
  const curSpots = state.split("");

  const lastPlayer = curSpots.pop();

  const newPlayer = lastPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1;

  // get all spots reachable by placing a marble from reserve AS A SET!
  const reachableStates = getStatesByPlacingMarbleFromReserve(
    state,
    curSpots,
    newPlayer
  );

  return reachableStates;
};

const getStatesByPlacingMarbleFromReserve = (state, curSpots, newPlayer) => {
  let reserveMarbles = RESERVE_MARBLES; // TODO: change back to 15 for 4x4

  curSpots.forEach((spot) => {
    if (spot === newPlayer) reserveMarbles--;
  });

  //  make clear that the player also has lost then
  if (reserveMarbles <= 0) return new Set();

  const viableSpots = [];
  const reachableStates = [];

  // layer 0
  for (let i = 0; i < 16; i++) {
    if (curSpots[i] === EMPTY) {
      if (wouldBeSquare2(curSpots, i, newPlayer)) {
        const statesByTakingBack = getStatesByTakingBackMarbles(
          curSpots,
          state,
          i,
          newPlayer
        );

        statesByTakingBack.forEach((newState) => {
          // console.log(newState);
          reachableStates.push(newState);
        });
      } else {
        viableSpots.push(i);
      }
    }
  }

  // layer 1
  for (let i = 16; i < 25; i++) {
    if (curSpots[i] === EMPTY && layer1Support(curSpots, i)) {
      if (wouldBeSquare2(curSpots, i, newPlayer)) {
        const statesByTakingBack = getStatesByTakingBackMarbles(
          curSpots,
          state,
          i,
          newPlayer
        );

        statesByTakingBack.forEach((newState) => {
          reachableStates.push(newState);
        });
      } else {
        viableSpots.push(i);
      }

      const statesByMovingMarble = getStatesByMovingMarbleUp(
        curSpots,
        state,
        i,
        newPlayer
      );

      statesByMovingMarble.forEach((newState) => {
        reachableStates.push(newState);
      });
    }
  }

  // layer 2
  for (let i = 25; i < 29; i++) {
    if (curSpots[i] === EMPTY && layer2Support(curSpots, i)) {
      if (wouldBeSquare2(curSpots, i, newPlayer)) {
        const statesByTakingBack = getStatesByTakingBackMarbles(
          curSpots,
          state,
          i,
          newPlayer
        );

        statesByTakingBack.forEach((newState) => {
          reachableStates.push(newState);
        });
      } else {
        viableSpots.push(i);
      }

      const statesByMovingMarble = getStatesByMovingMarbleUp(
        curSpots,
        state,
        i,
        newPlayer
      );

      statesByMovingMarble.forEach((newState) => {
        reachableStates.push(newState);
      });
    }
  }

  // layer 3
  if (
    curSpots[29] === EMPTY &&
    curSpots[25] !== EMPTY &&
    curSpots[26] !== EMPTY &&
    curSpots[27] !== EMPTY &&
    curSpots[28] !== EMPTY
  ) {
    viableSpots.push(29);
  }

  // All "Normal" viable spots
  viableSpots.forEach((spot) => {
    const newState =
      state.substring(0, spot) +
      newPlayer +
      state.substring(spot + 1, state.length - 1) +
      newPlayer;

    const newStateRotated = getHighestRotatedState(newState);
    reachableStates.push(newStateRotated);
  });

  return new Set(reachableStates);
};

const getHighestRotatedState = (state) => {
  let highestState = state;
  let lastState = state;

  for (let i = 0; i < 3; i++) {
    const rotatedState = getRotatedState(lastState);

    if (parseInt(rotatedState, 4) > parseInt(highestState, 4))
      highestState = rotatedState;

    lastState = rotatedState;
  }

  return highestState;
};

const getStatesByTakingBackMarbles = (
  curSpotsParam,
  state,
  newSpot,
  player
) => {
  const newStates = [];
  const spotsOfPlayer = [];

  const curSpots = JSON.parse(JSON.stringify(curSpotsParam));

  curSpots[newSpot] = player;

  const viableForTakeBack = [];

  curSpots.forEach((spot, i) => {
    if (spot === player) spotsOfPlayer.push(i);
  });

  spotsOfPlayer.forEach((spot) => {
    if (!isSupportingOthers(spot, curSpots)) viableForTakeBack.push(spot);
  });

  const takeBackCombinations = [];

  for (let i = 0; i < viableForTakeBack.length; i++) {
    takeBackCombinations.push([viableForTakeBack[i]]);

    for (let j = i + 1; j < viableForTakeBack.length; j++) {
      takeBackCombinations.push([viableForTakeBack[i], viableForTakeBack[j]]);
    }
  }

  // Construct states by taking back
  takeBackCombinations.forEach((combination) => {
    let newState = "";

    curSpots.forEach((spot, i) => {
      newState += combination.includes(i) ? EMPTY : spot;
    });

    newState += player;

    newStates.push(getHighestRotatedState(newState));
  });

  return new Set(newStates);
};

const isSupportingOthers = (spot, curSpots) => {
  const newSpots = JSON.parse(JSON.stringify(curSpots));

  newSpots[spot] = EMPTY;

  for (let i = 16; i < 29; i++) {
    if (newSpots[i] !== EMPTY) {
      let support;
      if (i >= 25) {
        support = layer2Support(newSpots, i);
      } else {
        support = layer1Support(newSpots, i);
      }

      if (!support) {
        return true;
      }
    }
  }

  return false;
};

const layer1Support = (curSpots, i) => {
  let subtrahends;

  if (i > 21) {
    subtrahends = [14, 13, 10, 9];
  } else if (i > 18) {
    subtrahends = [15, 14, 11, 10];
  } else {
    subtrahends = [16, 15, 12, 11];
  }

  for (let j = 0; j < subtrahends.length; j++) {
    if (curSpots[i - subtrahends[j]] === EMPTY) return false;
  }

  return true;
};

const layer2Support = (curSpots, i) => {
  let subtrahends;

  if (i > 26) {
    subtrahends = [8, 7, 5, 4];
  } else {
    subtrahends = [9, 8, 6, 5];
  }

  for (let j = 0; j < subtrahends.length; j++) {
    if (curSpots[i - subtrahends[j]] === EMPTY) return false;
  }

  return true;
};

const getStatesByMovingMarbleUp = (curSpots, state, spot, newPlayer) => {
  const layerCondition = spot >= 25;

  // let layer = layerCondition ? 2 : 1;

  const viableMarbles = [];

  let upperBound = layerCondition ? 24 : 15;
  let lowerBound = layerCondition ? 16 : 0; // TODO lowerbound maybe should always be 0???
  lowerBound = 0;

  const newSpots = state.split("");
  newSpots.pop();

  newSpots[spot] = newPlayer;

  for (let i = lowerBound; i < upperBound; i++) {
    const curSpot = curSpots[i];

    if (
      curSpot === newPlayer &&
      !isSupportingOthers(i, curSpots) &&
      !isSupportingOthers(i, newSpots)
    ) {
      viableMarbles.push(i);
    }
  }

  const newStates = [];

  viableMarbles.forEach((marble) => {
    if (wouldBeSquare2(newSpots, marble, newPlayer)) {
      const statesByTakingBack = getStatesByTakingBackMarbles(
        newSpots,
        state,
        marble,
        newPlayer
      );

      statesByTakingBack.forEach((newState2) => {
        newStates.push(getHighestRotatedState(newState2));
      });
    } else {
      let newState =
        state.substring(0, marble) +
        EMPTY +
        state.substring(marble + 1, spot) +
        newPlayer +
        state.substring(spot + 1, state.length - 1) +
        newPlayer;

      newStates.push(getHighestRotatedState(newState));
    }
  });

  return new Set(newStates);
};

const wouldBeSquare2 = (curSpots, spot, newPlayer) => {
  const possibleSquares = [
    [0, 1, 4, 5],
    [1, 2, 5, 6],
    [2, 3, 6, 7],
    [4, 5, 8, 9],
    [5, 6, 9, 10],
    [6, 7, 10, 11],
    [8, 9, 12, 13],
    [9, 10, 13, 14],
    [10, 11, 14, 15],
    [16, 17, 19, 20],
    [17, 18, 20, 21],
    [19, 20, 22, 23],
    [20, 21, 23, 24],
    [25, 26, 27, 28],
  ];

  const possibleSquaresForSpot = possibleSquares.filter((square) =>
    square.includes(spot)
  );

  // console.log(possibleSquaresForSpot);

  let wouldReallyBeSquare = false;

  for (let j = 0; j < possibleSquaresForSpot.length; j++) {
    const square = possibleSquaresForSpot[j];

    let isSquare = true;

    for (let i = 0; i < square.length; i++) {
      const squareSpot = square[i];

      if (squareSpot !== spot && curSpots[squareSpot] !== newPlayer) {
        isSquare = false;
        break;
      }
    }

    if (isSquare) {
      wouldReallyBeSquare = true;
      break;
    }
  }

  return wouldReallyBeSquare;
};

const wouldBeSquare = (curSpots, spot, newPlayer) => {
  let wouldReallyBeSquare = false;

  // Layer 0
  let possibleSquareSpots = [
    [-5, -4, -1],
    [-4, -3, 1],
    [-1, 3, 4],
    [1, 4, 5],
  ];

  let upperBound = 15;
  let lowerBound = 0;

  // Layer 1
  if (spot >= 16) {
    possibleSquareSpots = [
      [-4, -3, -1],
      [-3, -2, 1],
      [-1, 2, 3],
      [1, 3, 4],
    ];

    upperBound = 24;
    lowerBound = 16;
  }
  // Layer 2
  if (spot >= 25) {
    possibleSquareSpots = [
      [1, 2, 3],
      [-1, 1, 2],
      [-2, -1, 1],
      [-3, -2, -1],
    ];

    upperBound = 28;
    lowerBound = 25;
  }

  for (let j = 0; j < possibleSquareSpots.length; j++) {
    const square = possibleSquareSpots[j];

    let isSquare = true;
    for (let i = 0; i < square.length; i++) {
      const index = square[i] + spot;
      if (
        index < lowerBound ||
        index > upperBound ||
        curSpots[index] !== newPlayer
      ) {
        isSquare = false;
        break;
      }
    }

    if (isSquare) {
      // console.log(curSpots);
      // console.log(square, spot);
      wouldReallyBeSquare = true;
      break;
    }
  }

  return wouldReallyBeSquare;
};

// func for checking if game is over and determining winner

// func for rotating state by 90 degrees
const getRotatedState = (state) => {
  const t = state.split("");
  const player = t.pop();

  let s = "";

  const newFormation = [
    12, 8, 4, 0, 13, 9, 5, 1, 14, 10, 6, 2, 15, 11, 7, 3, 22, 19, 16, 23, 20,
    17, 24, 21, 18, 27, 25, 28, 26, 29,
  ];

  newFormation.forEach((spot) => {
    s += t[spot];
  });

  // Add player to end of state string again
  s += player;
  return s;
};

const calculateWinner = (state) => {
  const curSpots = state.split("");
  const lastPlayer = curSpots.pop();

  let reserveMarblesP1 = RESERVE_MARBLES;
  let reserveMarblesP2 = RESERVE_MARBLES;

  curSpots.forEach((spot) => {
    if (spot === PLAYER_1) reserveMarblesP1--;
    if (spot === PLAYER_2) reserveMarblesP2--;
  });

  if (reserveMarblesP1 <= 0 && lastPlayer === PLAYER_2) return PLAYER_2;
  if (reserveMarblesP2 <= 0 && lastPlayer === PLAYER_1) return PLAYER_1;

  return curSpots[29];
};

module.exports = {
  getReachableStates,
  getRotatedState,
  calculateWinner,
};
