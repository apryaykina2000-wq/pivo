const WIDTH = 1280;
const HEIGHT = 720;
const TARGET_SCORE = 60;

export default class GameScene extends Phaser.Scene {
  constructor(){ super('Game'); }
  init(){
    this.score = 0;
    this.canDoubleJump = false;
    this.doubleJumpUsed = false;
    this.gameOver = false;
  }
  create(){
    // Parallax
    this.add.image(WIDTH/2, HEIGHT/2, 'bg_sky').setDisplaySize(WIDTH, HEIGHT);
    this.hillsFar = this.add.tileSprite(0, HEIGHT*0.62, WIDTH, 300, 'bg_hills_far').setOrigin(0,0.5);
    this.hillsNear = this.add.tileSprite(0, HEIGHT*0.72, WIDTH, 320, 'bg_hills_near').setOrigin(0,0.5);

    // Clouds
    this.clouds = this.add.group();
    const cloudKeys = ['cloud1','cloud2','cloud3'];
    for (let i=0;i<6;i++){
      const x = Phaser.Math.Between(0, WIDTH);
      const y = Phaser.Math.Between(50, 280);
      const c = this.add.image(x, y, Phaser.Utils.Array.GetRandom(cloudKeys)).setAlpha(0.8);
      c.speed = Phaser.Math.FloatBetween(0.2, 0.6);
      this.clouds.add(c);
    }

    // Ground (invisible physics line + repeating visual)
    this.groundY = 600;
    this.ground = this.physics.add.staticImage(WIDTH/2, this.groundY+20, 'ground_tile').setVisible(false).setScale(10,1);
    this.groundVis = this.add.tileSprite(0, this.groundY, WIDTH, 120, 'ground_tile').setOrigin(0,0.5);

    // Player
    this.player = this.physics.add.sprite(220, this.groundY-60, 'run1').setCollideWorldBounds(true);
    this.player.setGravityY(0);
    this.player.play('run');
    this.player.body.setSize(this.player.width*0.45, this.player.height*0.85).setOffset(25,10);

    this.physics.add.collider(this.player, this.ground);

    // Groups
    this.items = this.physics.add.group();
    this.obstacles = this.physics.add.group();

    // Collisions
    this.physics.add.overlap(this.player, this.items, this.collectItem, null, this);
    this.physics.add.collider(this.player, this.obstacles, this.hitObstacle, null, this);

    // Score text
    this.scoreText = this.add.text(30, 24, 'Счёт: 0', { fontFamily:'CenturyGothicBold', fontSize:'36px', color:'#ffffff', stroke:'#0a4b57', strokeThickness:6 });

    // Input: tap / click
    this.input.on('pointerdown', this.handleJump, this);

    // Timers for spawn
    this.itemTimer = this.time.addEvent({ delay: 900, loop: true, callback: this.spawnItem, callbackScope: this });
    this.obstacleTimer = this.time.addEvent({ delay: 1400, loop: true, callback: this.spawnObstacle, callbackScope: this });
  }

  handleJump(){
    if (this.gameOver) return;
    const onGround = this.player.body.blocked.down;
    if (onGround){
      // first jump
      this.player.setVelocityY(-720);
      this.player.setTexture('jump1');
      this.canDoubleJump = true;
      this.doubleJumpUsed = false;
    } else if (this.canDoubleJump && !this.doubleJumpUsed){
      // second jump (higher / longer)
      this.player.setVelocityY(-820);
      this.player.setTexture('jump2');
      this.doubleJumpUsed = true;
    }
  }

  collectItem(player, item){
    item.destroy();
    this.score += 1;
    this.scoreText.setText('Счёт: ' + this.score);
    if (this.score >= TARGET_SCORE){
      this.endGame(true);
    }
  }

  hitObstacle(){
    if (this.gameOver) return;
    this.endGame(false);
  }

  endGame(won){
    this.gameOver = true;
    this.scene.start('Result', { score: this.score, won });
  }

  spawnItem(){
    if (this.gameOver) return;
    const keys = ['item_beer','item_glass','item_fish'];
    const key = Phaser.Utils.Array.GetRandom(keys);
    const y = Phaser.Math.Between(this.groundY-180, this.groundY-60);
    const item = this.items.create(WIDTH+40, y, key);
    item.setVelocityX(-350);
    item.setImmovable(true);
    item.body.allowGravity = false;
    item.setDepth(5);
  }

  spawnObstacle(){
    if (this.gameOver) return;
    const options = [
      {key:'obstacle_low', y:this.groundY-15, hitbox:{w:90,h:70,ox:10,oy:30}},
      {key:'obstacle_mid', y:this.groundY-10, hitbox:{w:90,h:110,ox:15,oy:15}},
      {key:'obstacle_high', y:this.groundY-60, hitbox:{w:140,h:120,ox:10,oy:10}},
    ];
    const cfg = Phaser.Utils.Array.GetRandom(options);
    const obs = this.obstacles.create(WIDTH+80, cfg.y, cfg.key);
    obs.setVelocityX(-400);
    obs.setImmovable(true);
    obs.body.allowGravity = false;
    if (cfg.hitbox){
      obs.body.setSize(cfg.hitbox.w, cfg.hitbox.h).setOffset(cfg.hitbox.ox, cfg.hitbox.oy);
    }
  }

  update(time, delta){
    // Parallax scrolling
    this.hillsFar.tilePositionX += 0.2 * (delta/16.6);
    this.hillsNear.tilePositionX += 0.6 * (delta/16.6);
    this.groundVis.tilePositionX += 4.0 * (delta/16.6);

    // Cloud drift
    this.clouds.getChildren().forEach(c => {
      c.x -= c.speed;
      if (c.x < -100) c.x = WIDTH + 100;
    });

    // Return to run animation when landing
    if (this.player.body.blocked.down && this.player.anims.getName() !== 'run'){
      this.player.play('run');
    }
  }
}
