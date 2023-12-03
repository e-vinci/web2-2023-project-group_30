import Phaser from 'phaser';
import ScoreLabel from './ScoreLabel';
import skyAsset from '../../assets/sky_test.png';
import asteroidAsset from '../../assets/asteroid.png';
import dudeAsset from '../../assets/Ship1.png';

const DUDE_KEY = 'dude';

class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
    this.player = undefined;
    this.cursors = undefined;
    this.scoreLabel = undefined;
    this.timerEvent = undefined;
    this.obstacles = undefined;
    this.obstacleDelay = 100; // Initial delay
    this.obstacleDelayDecreaseRate = 10; // Rate at which delay decreases
    this.minObstacleDelay = 10; // Minimum delay value
    this.gameOverFlag  = false;
  }

  preload() {
    this.load.image('sky', skyAsset);
    this.load.image('obstacle', asteroidAsset);
    this.load.image(DUDE_KEY, dudeAsset);
  }

  create() {
    // background
    this.add.image(400, 300, 'sky');

    // player
    this.player = this.physics.add.sprite(100, 450, DUDE_KEY);
    this.player.setCollideWorldBounds(true);

    // obstacles
    this.obstacles = this.physics.add.group({
      key: 'obstacle',
      repeat: 20,
      setXY: {
        x: 800, y: 0, stepX: 250
      }
    })

    // create obstacles at random heights
    this.obstacles.children.iterate(obstacle => {
      if (obstacle) {
          const randomY = Phaser.Math.Between(15, 705);
          obstacle.setPosition(obstacle.x, randomY);
      }
    });

    this.physics.add.collider(this.player, this.obstacles, this.playerObstacleCollision, null, this);

    this.scoreLabel = this.createScoreLabel(16, 16, 0);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.timerEvent = this.time.addEvent({
      delay: this.obstacleDelay,
      callback: this.moveObstacles,
      callbackScope: this,
      loop: true
    })
  }

  playerObstacleCollision() {
    this.gameOver();
  }
  
  gameOver(){
    this.scoreLabel.setText(`GAME OVER :( \nYour Score = ${this.scoreLabel.score}`);
    this.physics.pause();

    this.player.setTint(0xff0000);
    this.gameOverFlag  = true;
  }

  update() {
    if (this.gameOverFlag) {
      return;
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-330);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(330);
    } else {
      this.player.setVelocityY(0);
    }
  }

  moveObstacles(){
    this.obstacles.setVelocityX(-200);

    this.obstacles.children.iterate(obstacle =>{
      if(obstacle && obstacle.getBounds().right<0){
        const randomY = Phaser.Math.Between(100, 500);
        obstacle.setPosition(800, randomY);

        this.scoreLabel.add(10)
      }
    })

    // decrease delay to make obstacles appear faster over time
    this.obstacleDelay -= this.obstacleDelayDecreaseRate;

    // Ensure delay doesn't go below a minimum value
    this.obstacleDelay = Math.max(this.obstacleDelay, this.minObstacleDelay);

    // Update timerEvent.delay
    this.timerEvent.delay = this.obstacleDelay;

  }

  createScoreLabel(x, y, score) {
    const style = { fontSize: '32px', fill: '#FFF' };
    const label = new ScoreLabel(this, x, y, score, style);
    this.add.existing(label);

    return label;
  }

}

export default GameScene;
