import Phaser from 'phaser';
import anime from 'animejs';
import ScoreLabel from './ScoreLabel';
import skyAsset from '../../assets/sky_tes.jpg';
import asteroidAsset from '../../assets/asteroid.png';
import skin0 from '../../assets/Ship1.png';
import skin1 from '../../assets/Ship2.png';
import skin2 from '../../assets/Ship3.png';
import skin3 from '../../assets/Ship4.png';
import skin4 from '../../assets/Ship5.png';
import skin5 from '../../assets/Ship6.png';
import skin6 from '../../assets/Ship7.png';
import skin7 from '../../assets/Ship8.png';
import gameAudio from '../../assets/audio/gamemusic-6082.mp3';
import gameOverAudio from '../../assets/audio/game-over-arcade-6435.mp3';
import bulletAsset from '../../assets/bullets.png';
import starAsset from '../../assets/star.png';
import { getUserSessionData, isLoggedIn } from '../../utils/auth';

const BULLET_KEY = 'bullet';

class GameScene extends Phaser.Scene {
  constructor(skinID) {
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
    this.starDelay = 10;
    this.starDelayDecreaseRate = 10;
    this.gameOverFlag  = false;
    this.stars = undefined;
    this.skin = `skin${skinID}`;

    if (!skinID) this.skin = 'skin0';
    // initialize score
    this.scoreLabel = undefined;
    this.score = 0;

  }

  preload() {
    this.load.image('sky', skyAsset);
    this.load.image('obstacle', asteroidAsset);
    this.load.image('skin0', skin0);
    this.load.image('skin1', skin1);
    this.load.image('skin2', skin2);
    this.load.image('skin3', skin3);
    this.load.image('skin4', skin4);
    this.load.image('skin5', skin5);
    this.load.image('skin6', skin6);
    this.load.image('skin7', skin7);
    this.load.audio('music', gameAudio);
    this.load.audio('gameOver', gameOverAudio);
    this.load.image(BULLET_KEY, bulletAsset);
    this.load.image('star', starAsset);
  }

  create() {
    // background
    this.add.image(600, 400, 'sky'); // Center the background image
    // player
    this.player = this.physics.add.sprite(80, 400, this.skin); // Adjust player starting position
    this.player.setCollideWorldBounds(true);

    // Setting a smaller hitbox for the player sprite
    this.player.setSize(50, 12); 

    // obstacles
    this.obstacles = this.physics.add.group();

    // stars
    this.stars = this.physics.add.group();

    // eslint-disable-next-line no-plusplus
    this.createStars();

     // Handle collision between player and stars
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

     // Create a label to display the collected stars count
    this.starLabel = this.add.text(16, 70, 'Stars: 0', { fontSize: '20px', fill: '#FFF', fontFamily: 'Pixelify Sans' })
    
    // choose the number of obstacles to be created
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 20; i++) {

      const obstacle = this.obstacles.create(
        Phaser.Math.Between(400, 4000), // Place obstacles outside the game scene
        Phaser.Math.Between(0, 900),  // Place obstacles anywhere on the y-axis
        'obstacle'
      );

      this.physics.add.collider(this.player, obstacle, this.playerObstacleCollision, null, this);
    }
    this.music = this.sound.add('music');
    this.music.play({ loop: true });

    this.scoreLabel = this.createScoreLabel(16, 16, this.score);


    this.scoreUpdateTimer = this.time.addEvent({
      delay: 1000, // Update score every second

      callback: this.updateScore,
      callbackScope: this,
      loop: true,
    });

    this.cursors = this.input.keyboard.createCursorKeys(); 

    // movement of stars and obstacles
    this.obstacleAndStarMoveEvent = this.time.addEvent({
      delay: Math.min(this.obstacleDelay, this.starDelay),
      callback: () => {
        this.moveObstacles();
        this.moveStars();
      },
      callbackScope: this,
      loop: true
    });
    
    // bullets physics
    this.bullets = this.physics.add.group({
      key: BULLET_KEY,
      repeat: 9,
      setXY: { x: -10, y: -10 },
      active: false,
      visible: false,
    });

    this.bullets.children.iterate((bullet) => {
      bullet.setActive(false).setVisible(false);
    });

    // bullet ready label
    this.bulletReadyText = this.add.text(16, 50, 'Bullet Ready', {
      fontSize: '20px',
      fill: '#00FF00',
      fontFamily: 'Pixelify Sans',
    });

    this.lastFiredTime = 0; // Time when the last bullet was fired
    this.fireDelay = 2000; // Delay between consecutive shots in milliseconds

    this.physics.add.collider(
      this.bullets,
      this.obstacles,
      this.bulletObstacleCollision,
      null,
      this,
    );
    this.physics.world.setBoundsCollision(true, true, false, false);
  }

  playerObstacleCollision() {
    this.gameOver();
  }

  async gameOver() {
    this.scoreLabel.setText(`GAME OVER  \nYour Score = ${this.scoreLabel.score}`);
    this.physics.pause();

    this.music.stop();
    this.sound.play('gameOver');
    if (this.scoreTimer) {
      this.scoreTimer.destroy();
    }

    this.player.setTint(0xff0000);
    this.gameOverFlag = true;

    // show gameOver screen
    const gameOverScreen = document.getElementById('gameOverScreen');
    gameOverScreen.style.display = "grid";
    const pointsDisplay = document.getElementById('pointsDisplay');
    pointsDisplay.innerHTML = `${this.scoreLabel.score}`;
    gameOverScreen.style.opacity = "1";
    gameOverScreen.style.zIndex = "2";
    const starsDisplay = document.getElementById('starsDisplay');
    starsDisplay.innerHTML = `${this.starCount}  <img src=${starAsset}>`;
    
    const animatedText = anime({
      targets: '.gameOverText',
      translateY: 15,
      easing: 'easeInOutExpo',
      delay: 250
    });
    animatedText.play();

    const userObject = localStorage.getItem('user');

  if (!userObject) {
    console.error('Utilisateur non connecté, score non enregistré');
    return;
  }

  // // Parser l'objet User pour obtenir le token JWT
  // const parsedUserObject = JSON.parse(userObject);
  // const {token} = parsedUserObject.token;

  // if (!token) {
  //   console.error('Token JWT non trouvé, score non enregistré');
  //   return;

  // }

  // Envoyer le score au serveur avec le token JWT
  if (isLoggedIn()){
    const token = getUserSessionData()?.token;
    try {
      const response = await fetch('/api/users/update-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify({ newScore: this.scoreLabel.score })
      });
    
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Erreur lors de la mise à jour du score:', errorDetails.message);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
    }
  
  // Update stars

    try {
      const response = await fetch('/api/users/add-stars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify({ stars: this.starCount })
      })
      if (!response.ok) alert("Problème de sauvegarde des étoiles")
    } catch (e){
      console.error("Error")
    }
  }
}

  update() {
    if (this.gameOverFlag) {
      return;
    }
    const sceneHeight = 735;

    // what keyboard does
    if (this.cursors.up.isDown && this.player.y > 0) {
      this.player.setVelocityY(-300);
    } else if (
      this.cursors.down.isDown &&
      this.player.y < sceneHeight - this.player.displayHeight
    ) {
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
      this.bulletReadyText.setFill('#00FF00'); // Green color
    } else {
      const timeRemaining = (this.fireDelay - timeSinceLastShot) / 1000;
      this.bulletReadyText.setText(`Bullet Cooldown: ${timeRemaining.toFixed(1)}s`);
      this.bulletReadyText.setFill('#FF0000'); // Red color
    }
  }

  updateScore() {
    if (!this.gameOverFlag) {
      this.scoreLabel.add(10); // Increment the score by 10
    }
  }

  moveObstacles() {
    const obstacleVelocity = -300; // Initial obstacle velocity
    const scoreMultiplier = 0.3; // Velocity increase per score unit
    const currentScore = this.scoreLabel.score; // Get the current score
    const increasedVelocity = obstacleVelocity - currentScore * scoreMultiplier;
    this.obstacles.setVelocityX(increasedVelocity);
    this.obstacles.children.iterate((obstacle) => {
      if (obstacle && obstacle.getBounds().right < -100) {
        obstacle.setPosition(
          Phaser.Math.Between(1200, 1400), // Reposition the obstacle outside the game scene
          Phaser.Math.Between(0, 800), // Place obstacles anywhere on the y-axis
        );
      }
    });
  }

  createStars() {
      const star = this.stars.create(
        Phaser.Math.Between(1200,1400),
        Phaser.Math.Between(0, 800),
        'star'
      );
      star.setCollideWorldBounds(false);
  }

  createObscacles() {
    const obstacle = this.obstacles.create(
      Phaser.Math.Between(1200,1400),
      Phaser.Math.Between(0, 800),
      'obstacle'
    );
    this.physics.add.collider(this.player, obstacle, this.playerObstacleCollision, null, this);
}

  moveStars() {
    const starVelocity = -300; // Initial star velocity
    const scoreMultiplier = 0.3; // Velocity increase per score unit
    const currentScore = this.scoreLabel.score; // Get the current score
    const increasedVelocity = starVelocity - (currentScore * scoreMultiplier);
    this.stars.setVelocityX(increasedVelocity);
    this.stars.children.iterate(star => {
      if (star && star.getBounds().right < -100) { // Check if star is completely outside the game scene
        star.setPosition(
          Phaser.Math.Between(1200, 1200), // Reposition the star outside the game scene
          Phaser.Math.Between(0, 705)     // Place star anywhere on the y-axis
        );
      }
    });
  }

  collectStar(player, star) {
    star.disableBody(true, true);
    this.starCount += 10;
    this.starLabel.setText(`Stars: ${this.starCount}`);
    this.createStars();
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
      bullet
        .setActive(true)
        .setVisible(true)
        .setVelocityX(500)
        .setPosition(this.player.x + 50, this.player.y);

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
        this.createObscacles();
      }
    }
  }

  createScoreLabel(x, y, score) {
    const style = { fontSize: '32px', fill: '#FFF', fontFamily: 'Pixelify Sans'};
    const label = new ScoreLabel(this, x, y, score, style);
    this.add.existing(label);
    return label;
  }
}
export default GameScene;