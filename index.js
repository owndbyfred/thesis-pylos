const { getReachableStates, getRotatedState } = require("./game");
const { EMPTY } = require("./Types");

// console.log(getReachableStates("0000000000000000000000000000000"));
// console.log(getReachableStates("1000000000000000000000000000001"));
// console.log(getReachableStates("1200000000000000000000000000002"));
// console.log(getReachableStates("1210000000000000000000000000001"));
// console.log(getReachableStates("1200120000000000000000000000002"));

// console.log(getRotatedState("1000000000000000000000000000001"));

// console.log(getReachableStates("1100100022200000000000000000001"));

// const reachableStates = getReachableStates("1100100122220000000000000000002");
// const reachableStates = getReachableStates("1100120120220000000000000000002");
const reachableStates = getReachableStates("1112122222221000110010000000002");

const countMarbles = (state) => {
  const spots = state.split("");
  spots.pop();

  let count = 0;

  spots.forEach((spot) => {
    if (spot !== EMPTY) count++;
  });

  return count;
};
reachableStates.forEach((state) => {
  console.log(state, countMarbles(state));
});
