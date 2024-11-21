export const GAME_LEVELS = {
  1: {
    keys: ['q', 'w', 'e', 'r', 't', 'a', 's', 'd', 'f', 'g', 'z', 'x', 'c', 'v', 'b'],
    correctPoints: 1,
    incorrectPoints: -2,
    name: 'Left Hand Basic'
  },
  2: {
    keys: ['1', '2', '3', '4', '5', '!', '@', '#', '$', '%'],
    correctPoints: 3,
    incorrectPoints: -3,
    name: 'Numbers & Symbols',
    requiresShift: ['!', '@', '#', '$', '%']
  },
  3: {
    keys: ['y', 'u', 'i', 'o', 'p', 'h', 'j', 'k', 'l', 'n', 'm'],
    correctPoints: 2,
    incorrectPoints: -2,
    name: 'Full Keyboard'
  }
};