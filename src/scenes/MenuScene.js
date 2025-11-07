const WIDTH = 1280;
const HEIGHT = 720;

function bestScoreStorage() {
  try { return parseInt(localStorage.getItem('sasha_best')||'0',10) } catch(e){ return 0; }
}

export default class MenuScene extends Phaser.Scene {
  constructor(){ super('Menu'); }
  create(){
    // Background
    this.add.image(WIDTH/2, HEIGHT/2, 'bg_sky').setDisplaySize(WIDTH, HEIGHT);
    this.add.image(WIDTH/2, HEIGHT*0.6, 'bg_hills_far').setScale(1.1);
    this.add.image(WIDTH/2, HEIGHT*0.7, 'bg_hills_near').setScale(1.1);

    // Title
    this.add.rectangle(WIDTH/2, 150, 820, 120, 0x000000, 0.15).setStrokeStyle(4, 0x000000, 0.3);
    this.add.text(WIDTH/2, 120, 'Саша и пиво', { fontFamily: 'CenturyGothicBold', fontSize: '72px', color: '#ffffff', stroke: '#0a4b57', strokeThickness: 8 }).setOrigin(0.5);
    this.add.text(WIDTH/2, 190, 'Собери 60 предметов и получи золотой кубок!', { fontFamily: 'CenturyGothicBold', fontSize: '26px', color: '#e7ffff' }).setOrigin(0.5);

    // Best score & medals preview
    const best = bestScoreStorage();
    this.add.text(WIDTH/2, 250, `Рекорд: ${best}`, { fontFamily: 'CenturyGothicBold', fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);

    let medalKey = null;
    if (best >= 60) medalKey = 'medal_gold'; else if (best >= 40) medalKey = 'medal_silver'; else if (best >= 20) medalKey = 'medal_bronze';
    if (medalKey) this.add.image(WIDTH/2, 360, medalKey).setScale(0.4);

    // Play button
    const btn = this.add.image(WIDTH/2, HEIGHT*0.78, 'btn_play').setInteractive({ useHandCursor:true });
    btn.on('pointerdown', ()=> btn.setTexture('btn_play_pressed'));
    btn.on('pointerup', ()=> { btn.setTexture('btn_play'); this.scene.start('Game'); });
    btn.on('pointerout', ()=> btn.setTexture('btn_play'));
  }
}
