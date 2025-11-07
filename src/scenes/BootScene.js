export default class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  preload() {
    // Background & environment
    this.load.image('bg_sky', 'assets/images/bg_sky.png');
    this.load.image('bg_hills_far', 'assets/images/bg_hills_far.png');
    this.load.image('bg_hills_near', 'assets/images/bg_hills_near.png');
    this.load.image('ground_tile', 'assets/images/ground_tile.png');
    this.load.image('cloud1', 'assets/images/cloud_1.png');
    this.load.image('cloud2', 'assets/images/cloud_2.png');
    this.load.image('cloud3', 'assets/images/cloud_3.png');

    // Items
    this.load.image('item_beer', 'assets/images/item_beer.png');
    this.load.image('item_glass', 'assets/images/item_glass.png');
    this.load.image('item_fish', 'assets/images/item_fish.png');

    // Obstacles
    this.load.image('obstacle_low', 'assets/images/obstacle_low.png');   // ящик + камни
    this.load.image('obstacle_mid', 'assets/images/obstacle_mid.png');   // бочка
    this.load.image('obstacle_high', 'assets/images/obstacle_high.png'); // табличка

    // Player frames
    this.load.image('run1', 'assets/images/player_run_1.png');
    this.load.image('run2', 'assets/images/player_run_2.png');
    this.load.image('run3', 'assets/images/player_run_3.png');
    this.load.image('jump1', 'assets/images/player_jump_1.png');
    this.load.image('jump2', 'assets/images/player_jump_2.png');

    // UI
    this.load.image('btn_play', 'assets/images/ui_btn_play.png');
    this.load.image('btn_play_pressed', 'assets/images/ui_btn_play_pressed.png');
    this.load.image('btn_home', 'assets/images/ui_btn_home.png');
    this.load.image('btn_restart', 'assets/images/ui_btn_restart.png');

    // Medals
    this.load.image('medal_bronze', 'assets/images/medal_bronze.png');
    this.load.image('medal_silver', 'assets/images/medal_silver.png');
    this.load.image('medal_gold', 'assets/images/medal_gold.png');
  }
  create() {
    // Simple animation with frames
    this.anims.create({
      key: 'run',
      frames: [{key:'run1'},{key:'run2'},{key:'run3'}],
      frameRate: 10,
      repeat: -1
    });
    this.scene.start('Menu');
  }
}
