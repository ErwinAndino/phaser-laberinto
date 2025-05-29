import game from "./scenes/game.js";
import nivel1 from "./scenes/nivel1.js";

// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 450,
  height: 450,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 450,
      height: 450,
    },
    max: {
      width: 900,
      height: 900,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  // List of scenes to load
  // Only the first scene will be shown
  // Remember to import the scene before adding it to the list
  scene: [nivel1, game],
};

// Create a new Phaser game instance
window.game = new Phaser.Game(config);
