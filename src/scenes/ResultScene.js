const WIDTH = 1280;
const HEIGHT = 720;

function storeBest(score){
  try{
    const best = parseInt(localStorage.getItem('sasha_best')||'0',10);
    if (score > best) localStorage.setItem('sasha_best', String(score));
  }catch(e){}
}
function bestMedal(score){
  if (score >= 60) return 'medal_gold';
  if (score >= 40) return 'medal_silver';
  if (score >= 20) return 'medal_bronze';
  return null;
}

export default class ResultScene extends Phaser.Scene {
  constructor(){ super('Result'); }
  init(data){ this.score = data.score||0; this.won = !!data.won; storeBest(this.score); }
  create(){
    this.add.image(WIDTH/2, HEIGHT/2, 'bg_sky').setDisplaySize(WIDTH, HEIGHT);
    this.add.image(WIDTH/2, HEIGHT*0.6, 'bg_hills_far').setScale(1.1);
    this.add.image(WIDTH/2, HEIGHT*0.7, 'bg_hills_near').setScale(1.1);

    const panel = this.add.rectangle(WIDTH/2, HEIGHT/2, 800, 420, 0x000000, 0.2).setStrokeStyle(6, 0x0a4b57, 0.8);

    const title = this.won ? 'ПОБЕДА!' : 'ПИВО КОНЧИЛОСЬ';
    this.add.text(WIDTH/2, HEIGHT/2 - 140, title, { fontFamily:'CenturyGothicBold', fontSize:'72px', color:'#ffffff', stroke:'#0a4b57', strokeThickness:8 }).setOrigin(0.5);
    this.add.text(WIDTH/2, HEIGHT/2 - 60, `Счёт: ${this.score}`, { fontFamily:'CenturyGothicBold', fontSize:'40px', color:'#ffffff' }).setOrigin(0.5);

    const medalKey = bestMedal(this.score);
    if (medalKey){
      this.add.image(WIDTH/2, HEIGHT/2 + 20, medalKey).setScale(0.45);
    } else {
      this.add.text(WIDTH/2, HEIGHT/2 + 10, 'Кубок не получен — набери 20+!', { fontFamily:'CenturyGothicBold', fontSize:'26px', color:'#ffffff' }).setOrigin(0.5);
    }

    // Buttons stacked vertically
    const restart = this.add.image(WIDTH/2, HEIGHT*0.70, 'btn_restart').setInteractive({useHandCursor:true});
    const tRestart = this.add.text(WIDTH/2, HEIGHT*0.70, 'ЗАНОВО', { fontFamily:'CenturyGothicBold', fontSize:'32px', color:'#2b1600' }).setOrigin(0.5);
    restart.on('pointerup', ()=> this.scene.start('Game'));

    const home = this.add.image(WIDTH/2, HEIGHT*0.82, 'btn_home').setInteractive({useHandCursor:true});
    const tHome = this.add.text(WIDTH/2, HEIGHT*0.82, 'МЕНЮ', { fontFamily:'CenturyGothicBold', fontSize:'32px', color:'#2b1600' }).setOrigin(0.5);
    home.on('pointerup', ()=> this.scene.start('Menu'));
  }
}
