import { sendEvent, loadAssets, loadHightScore } from "./Socket.js";

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  hightScore = 0; 
  stageChange = true;
  currentStage= 1000;
  stages = [{ "id":  1000, "score": 0, "scorePerSecond": 1 }]; //이게 맞나 ㅋㅋㅋ; 임시방편.
  items = [];
  getItemId = [];

  constructor(ctx, scaleRatio) {//시작할때 한번
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio; 
    this.loadstagesData(); 
    this.loadHightScoreData();
  }

  async loadstagesData() {
    try {
      const {stages, items} = await loadAssets(); 
      this.stages = stages.data;
      this.items = items.data;
    } catch (error) {
      console.error('Failed to load stages:', error);
    }
  }

  async loadHightScoreData() {
    try {
      const {hightScore, uuid} = await loadHightScore(); 
      this.hightScore = Math.floor(hightScore);
    } catch (error) {
      console.error('Failed to load stages:', error);
    }
  }

  update(deltaTime) {
    this.score += this.stages[this.currentStage - 1000].scorePerSecond * (deltaTime / 1000);
  
    if (this.currentStage < this.stages.length + 999) {
      
        while (
            this.score >= this.stages[this.currentStage - 999].score &&
            this.stageChange
        ) {
            this.stageChange = false;
            sendEvent(11, { currentStage: this.currentStage, targetStage: this.currentStage + 1 , getItemId: this.getItemId });
            this.currentStage += 1;
            this.getItemId = [];

            if (this.currentStage >= this.stages.length + 999) {
                break;
            }
        }
        if(this.currentStage !== 1006){
          if (!this.stageChange && this.score < this.stages[this.currentStage - 999].score) {
            this.stageChange = true;
          }
        }
    }
}

  getItem(itemId) {
    const validitem = this.items.find(item => item.id === itemId);
    this.score += validitem.score;
    this.getItemId.push(itemId);
  }

  reset() {
    this.score = 0;
    this.currentStage= 1000;
    this.loadHightScoreData();
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = this.hightScore;
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;
    const stageX =highScoreX - 100 * this.scaleRatio;


    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);
    const stagePadded = this.currentStage-999;

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
    this.ctx.fillText(`Stage ${stagePadded}`, stageX, y);
  }

  getCurrentStage() {
    return this.currentStage;
  }
}

export default Score;
