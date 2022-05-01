# Installation

To run the code example, it is required to have **node.js v16** or higher installed on your system. The runtime can be downloaded on https://nodejs.org/en/download/.

While installing, please make sure to also add the `node` command to your system's PATH.

# How to run

The example code can then be executed opening a terminal, navigating into the folder containing the JavaScript files and then running `node example.js`.
The output of the program should be logged in the terminal.

# Configuration

There is only a small amount of configuration possible.

To switch between 3x3 Pylos and standard 4x4 Pylos, please make sure to update `RESERVE_MARBLES` in `game.js:15` to 7 for 3x3 Pylos and 15 for standard 4x4 Pylos.

The initial starting game states are encoded as follows:

- 3x3 Pylos: `"3333333333333333000000000000003"`
- 4x4 (standard) Pylos: `"0000000000000000000000000000000"`

Please make sure to use the correct starting game state as the parameters of the function calls in `example.js`.
