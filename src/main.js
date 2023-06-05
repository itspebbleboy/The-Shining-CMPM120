// Define the configuration object
const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 2048,
    height: 2048,
    scene: [Play, testing]
  };
  
  // Create a new Phaser game
  const game = new Phaser.Game(config);

  let keyE, keyD, keyF, keyZ, keyX, keyLEFT, keyRIGHT, keyUP, keyDOWN, keyESC, keyENTER;