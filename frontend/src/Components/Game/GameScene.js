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
    this.starLabel = undefined;
    this.starCount = 0;
    this.timerEvent = undefined;
    this.obstacles = undefined;
    this.obstacleDelay = 10; // Initial delay
    this.obstacleDelayDecreaseRate = 10; // Rate at which delay decreases
    this.minObstacleDelay = 10; // Minimum delay value
    this.gameOverFlag  = false;
    this.stars = undefined;

    // initialize score
    this.scoreLabel = undefined;
    this.score = 0;
    // this.scoreIncrement = 10; // Increment value for the score
    // this.scoreDelay = 1000;
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
    this.obstacles = this.physics.add.group({
      key: 'obstacle',
      repeat: 20,
      setXY: {
        x: 800, y: 0, stepX: 250
      }
    })

    this.obstacles.children.iterate(obstacle => {
      if (obstacle) {
          const randomY = Phaser.Math.Between(15, 705);
          obstacle.setPosition(obstacle.x, randomY);
      }
    });

    this.physics.add.collider(this.player, this.obstacles, this.playerObstacleCollision, null, this);

    this.music = this.sound.add('music');
    this.music.play({ loop: true });

    // this.initialPlayerX = this.player.x;

    this.scoreLabel = this.createScoreLabel(16, 16, this.score);

    this.scoreUpdateTimer = this.time.addEvent({
      delay: 1000, // Update score every second
      callback: this.updateScore,
      callbackScope: this,
      loop: true
    });

    this.cursors = this.input.keyboard.createCursorKeys(); 

    this.timerEvent = this.time.addEvent({
      delay: this.obstacleDelay,
      callback: this.moveObstacles,
      callbackScope: this,
      loop: true
    })

    // bullets
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

    this.starCount = 0;
    this.starLabel = this.add.text(16, 80, 'Stars: 0', { fontSize: '20px', fill: '#FFFF00' });
  
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
        this.bulletReadyText.setFill('#00FF00');
      } else {
        const timeRemaining = (this.fireDelay - timeSinceLastShot) / 1000;
        this.bulletReadyText.setText(`Bullet Cooldown: ${timeRemaining.toFixed(1)}s`);
        this.bulletReadyText.setFill('#FF0000');
      }
  }
  
  updateScore() {
    if (!this.gameOverFlag) {
      this.scoreLabel.add(10); // Increment the score by 10
    }
  }

  moveObstacles(){
    const obstacleVelocity = -200 - this.scoreLabel.score * 0.1; // Adjust the factor as needed

    this.obstacles.setVelocityX(obstacleVelocity);

    this.obstacles.children.iterate(obstacle => {
      if (obstacle && obstacle.getBounds().right < 0) {
        const randomY = Phaser.Math.Between(100, 650);
        obstacle.setPosition(1600, randomY);
      }
    });

    // decrease delay to make obstacles appear faster over time
    this.obstacleDelay -= this.obstacleDelayDecreaseRate;

    // Ensure delay doesn't go below a minimum value
    this.obstacleDelay = Math.max(this.obstacleDelay, this.minObstacleDelay);

    // Update timerEvent.delay
    this.timerEvent.delay = this.obstacleDelay;


    this.stars.setVelocityX(-200);

    this.stars.children.iterate(star => {
      if (star && star.getBounds().right < 0) {
        const randomY = Phaser.Math.Between(100, 500);
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
    star.disableBody(true, true);
    this.starCount += 10;
    this.starLabel.setText(`Stars: ${this.starCount}`);

    // Respawn a new star at a random position beyond the right edge of the screen
    const newStar = this.stars.create(1600, Phaser.Math.Between(15, 705), STAR_KEY);
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

  obstacleAtPosition(x, y) {
    let obstacleAtPosition = false;
    this.obstacles.children.iterate(obstacle => {
      if (obstacle.getBounds().contains(x, y)) {
        obstacleAtPosition = true;
      }
    });
    return obstacleAtPosition;
  }
}
export default GameScene;
