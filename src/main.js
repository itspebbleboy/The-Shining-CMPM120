// Define the configuration object
const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [Play]
  };
  
  // Create a new Phaser game
  const game = new Phaser.Game(config);