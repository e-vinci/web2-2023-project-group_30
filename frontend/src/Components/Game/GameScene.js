import Phaser from 'phaser';
import ScoreLabel from './ScoreLabel';
import skyAsset from '../../assets/sky_tes.jpg';
import asteroidAsset from '../../assets/asteroid.png';
import dudeAsset from '../../assets/Ship3.png';
import gameAudio from '../../assets/audio/gamemusic-6082.mp3';
import gameOverAudio from '../../assets/audio/game-over-arcade-6435.mp3';
import bulletAsset from '../../assets/bullets.png';
import starAsset from '../../assets/star.png';

const DUDE_KEY = 'dude';
const BULLET_KEY = 'bullet';
const STAR_KEY = 'star';

class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
    this.player = undefined;
    this.cursors = undefined;
    this.scoreLabel = undefined;
    this.starLabel = undefined;
    this.starCount = 0;
    this.timerEvent = undefined;
    this.obstacles = undefined;
    this.obstacleDelay = 10; // Initial delay
    this.obstacleDelayDecreaseRate = 10; // Rate at which delay decreases
    this.minObstacleDelay = 10; // Minimum delay value
    this.gameOverFlag  = false;
    this.stars = undefined;
    this.score = 0; // Initialize the score
    this.scoreIncrement = 10; // Increment value for the score
    this.scoreDelay = 1000;
  }

  preload() {
    this.load.image('sky', skyAsset);
    this.load.image('obstacle', asteroidAsset);
    this.load.image(DUDE_KEY, dudeAsset);
    this.load.audio('music', gameAudio);
    this.load.audio('gameOver', gameOverAudio);
    this.load.image(BULLET_KEY, bulletAsset);
    this.load.image(STAR_KEY, starAsset);
  }

  create() {
    // background
    this.add.image(600, 400, 'sky'); // Center the background image
  
    // player
    this.player = this.physics.add.sprite(80, 400, DUDE_KEY); // Adjust player starting position
    this.player.setCollideWorldBounds(true);
    // Setting a smaller hitbox for the player sprite
    this.player.setSize(60, 20); // Width of 40 pixels, height of 20 pixels

    // obstacles
    this.obstacles = this.physics.add.group();
    
    // Create obstacles outside the game scene
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 30; i++) { // Increase the number of obstacles
      const obstacle = this.obstacles.create(
        Phaser.Math.Between(400, 5000), // Place obstacles outside the game scene
        Phaser.Math.Between(0, 900),  // Place obstacles anywhere on the y-axis
        'obstacle'
      );
      this.physics.add.collider(this.player, obstacle, this.playerObstacleCollision, null, this);
    }
    this.music = this.sound.add('music');
    this.music.play({ loop: true });
    this.initialPlayerX = this.player.x;
    this.scoreLabel = this.createScoreLabel(16, 16, this.score);
    this.cursors = this.input.keyboard.createCursorKeys(); 
    this.scoreTimer = this.time.addEvent({
      delay: this.scoreDelay, // Update score every specified milliseconds
      callback: this.updateScore,
      callbackScope: this,
      loop: true
    });
    this.timerEvent = this.time.addEvent({
    delay: this.obstacleDelay,
    callback: this.moveObstacles,
    callbackScope: this,
    loop: true
    })
    this.bullets = this.physics.add.group({
      key: BULLET_KEY,
      repeat: 9,
      setXY: { x: -10, y: -10 },
      active: false,
      visible: false,
    });

    this.bullets.children.iterate(bullet => {
      bullet.setActive(false).setVisible(false);
    });

    this.bulletReadyText = this.add.text(16, 50, 'Bullet Ready', { fontSize: '20px', fill: '#00FF00' });
    this.lastFiredTime = 0;  // Time when the last bullet was fired
    this.fireDelay = 2000;    // Delay between consecutive shots in milliseconds

    this.physics.add.collider(this.bullets, this.obstacles, this.bulletObstacleCollision, null, this);
    this.physics.world.setBoundsCollision(true, true, false, false);

    // stars
    this.stars = this.physics.add.group({
      key: STAR_KEY,
      repeat: 1,
      setXY: () => {
        let randomY = Phaser.Math.Between(15, 705);
        while (this.obstacleAtPosition(800, randomY)) {
          randomY = Phaser.Math.Between(15, 705);
        }
        return { x: 800, y: randomY };
      },
      setScale: { x: 1, y: 1 },
    });
  
    this.stars.children.iterate(star => {
      const randomY = Phaser.Math.Between(15, 705);
      star.setPosition(star.x, randomY);
    });
  
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
  }

  playerObstacleCollision() {
    this.gameOver();
  }
  
  gameOver(){
    this.scoreLabel.setText(`GAME OVER  \nYour Score = ${this.scoreLabel.score}`);
    this.physics.pause();
    this.music.stop();
    this.sound.play('gameOver');
    if (this.scoreTimer) {
      this.scoreTimer.destroy();
    }
    this.player.setTint(0xff0000);
    this.gameOverFlag  = true;
  }

  update() {
      if (this.gameOverFlag) {
          return;
      }
      const sceneHeight = 735;
      if (this.cursors.up.isDown && this.player.y > 0) {
          this.player.setVelocityY(-300);
      } else if (this.cursors.down.isDown && this.player.y < sceneHeight - this.player.displayHeight) {
          this.player.setVelocityY(300);
      } else {
          this.player.setVelocityY(0);
      }
      if (this.cursors.space.isDown) {
        this.tryShootBullet();
      }
      // Update bullet ready text
      const currentTime = this.time.now;
      const timeSinceLastShot = currentTime - this.lastFiredTime;
      
      if (timeSinceLastShot > this.fireDelay) {
        this.bulletReadyText.setText('Bullet Ready');
        this.bulletReadyText.setFill('#00FF00');  // Green color
      } else {
        const timeRemaining = (this.fireDelay - timeSinceLastShot) / 1000;
        this.bulletReadyText.setText(`Bullet Cooldown: ${timeRemaining.toFixed(1)}s`);
        this.bulletReadyText.setFill('#FF0000');  // Red color
      }
  }
  
  updateScore() {
    if (!this.gameOverFlag) {
      this.score += this.scoreIncrement; // Increment the score by the defined value
      this.scoreLabel.setScore(this.score); // Update the score label
    }
  }
 
  moveObstacles() {
    const obstacleVelocity = -300; // Initial obstacle velocity
    const scoreMultiplier = 0.3; // Velocity increase per score unit

    // Increase obstacle velocity based on the score or distance traveled
    const currentScore = this.scoreLabel.score; // Get the current score
    const increasedVelocity = obstacleVelocity - (currentScore * scoreMultiplier);

    // Set the new velocity for the obstacles
    this.obstacles.setVelocityX(increasedVelocity);
    
    this.obstacles.children.iterate(obstacle => {
      if (obstacle && obstacle.getBounds().right < -100) { // Check if obstacle is completely outside the game scene
        obstacle.setPosition(
          Phaser.Math.Between(1200, 1400), // Reposition the obstacle outside the game scene
          Phaser.Math.Between(0, 800)     // Place obstacles anywhere on the y-axis
        );
      }
    });

    this.stars.setVelocityX(-300);

    this.stars.children.iterate(star => {
      if (star && star.getBounds().right < 0) {
        const randomY = Phaser.Math.Between(1200, 1400);
        star.setPosition(800, randomY);
      }
    }); 
  }

  tryShootBullet() {
    const currentTime = this.time.now;

    // Check if enough time has passed since the last shot
    if (currentTime - this.lastFiredTime > this.fireDelay) {
      this.shootBullet();
      this.lastFiredTime = currentTime;
    }
  }

  shootBullet() {
    const bullet = this.bullets.get(this.player.x + 50, this.player.y);
  
    if (bullet) {
      // Reset bullet properties
      bullet.setActive(true).setVisible(true).setVelocityX(500).setPosition(this.player.x + 50, this.player.y);
  
      // Handle bullet count
      this.checkBulletCount();
    }
  }

  checkBulletCount() {
    // Get the number of active bullets
    const activeBullets = this.bullets.countActive(true);

    // If the limit is reached, disable shooting
    if (activeBullets >= 10) {
      this.cursors.space.reset();
    }
  }

  bulletObstacleCollision(bullet, obstacle) {
    // Check if the bullet is still active and visible
    if (bullet.active && bullet.visible) {
      const bulletBounds = bullet.getBounds();
      const obstacleBounds = obstacle.getBounds();
  
      // Check if the bullet and obstacle bounds overlap on the y-axis
      if (Phaser.Geom.Intersects.RectangleToRectangle(bulletBounds, obstacleBounds)) {
        bullet.setActive(false).setVisible(false);
        obstacle.destroy();
        this.scoreLabel.add(10);
      }
    }
  }


  createScoreLabel(x, y, score) {
    const style = { fontSize: '32px', fill: '#FFF' };
    const label = new ScoreLabel(this, x, y, score, style);
    this.add.existing(label);

    return label;
  }

  collectStar(player, star) {
    // Disable the star's body on collision
    star.disableBody(true, true);
  
    // Update the star count
    this.starCount += 10;
    this.starLabel.setText(`Stars: ${this.starCount}`);
  
    // Respawn a new star beyond the right edge of the screen
    const newStar = this.stars.create(Phaser.Math.Between(800, 1600), Phaser.Math.Between(15, 705), STAR_KEY);
    newStar.setVelocityX(-200);
    newStar.setScale(1);
    newStar.setDepth(1);
  
    // Adjust the new star's position to avoid overlapping with obstacles
    let randomY = Phaser.Math.Between(15, 705);
    while (this.obstacleAtPosition(newStar.x, randomY)) {
      randomY = Phaser.Math.Between(15, 705);
    }
    newStar.setPosition(newStar.x, randomY);
  }
}
export default GameScene;
