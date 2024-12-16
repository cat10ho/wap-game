import { getGameAssets } from "../init/assets.js";
import { clearStage, getStage, setStage } from "../models/stage.model.js";
import { getHightScore, setHightScore } from "../models/user.model.js";

export const gameStart = (uuid, payload) => {
    
    const {stages} = getGameAssets();

    clearStage(uuid);

    setStage(uuid, stages.data[0].id, payload.timestamp); //첫번때 스테이지 저장

    return { status: 'success'}
}


export const gameEnd = (uuid, payload) => { //여기서 최종 점수 계산.
    const {timestamp:gameEndTime, score} = payload; //여기서 최종 스코어 얻어서 비교해서 밑에서 b뭐시기 넣어서 보내주면 전체 메세지 뜨겠네 그치?
   
    //여기서 만약 아이템 처먹고 스테이지가 올랐는데 바로죽으면 스테이지 생성이 안됬을 수도 있으니까~~ 함 확익하고 넣어주고 하는 로직 넣어두면 좋을듯 근데 귀찮으니 패스.

    const uuidstages = getStage(uuid);

    if (!uuidstages.length){
        return {status:'fail', message: "스테이지가 없음."};
    }

    let totalScore = 0;
    const {stages, items} = getGameAssets();

        uuidstages.forEach((stage, index) => {
            let stageEndTime;
            if (index ===  uuidstages.length-1) { 
                stageEndTime = gameEndTime; //끝난시간 ->게임끝난시간.
            } else {
                stageEndTime = uuidstages[index+1].timestamp;
            }
            if(stage.id!==1000){
                if(stage.itemId){
                    stage.itemId.forEach(id => {
                        const item = items.data.find(data => data.id === id);
                        if (item) {
                          totalScore += item.score;
                        }
                      });
                }
            }
            const stageDuration = (stageEndTime- stage.timestamp)/1000
            totalScore +=stages.data[stage.id - 1000].scorePerSecond *stageDuration; 
        });
        

    //점수와 타임 스템프 검증
    if (Math.abs(score-totalScore) > 5) { //이거 중요. 페이로드에서도 이미 점수 계산한거 보네네.
        console.log(totalScore,score);
        return {status:'fail', message: "점수가 이상함."};
    }
    const hightScore = getHightScore()

    if(score>hightScore.hightScore){
        setHightScore(score, uuid);
        return { status: 'success',message: "최고 기록 갱신!!", score , broadcast:true };
    }

    return { status: 'success',message: "게임 끝", score}; //와 스코어 넣어놓은것좀 봐.
}//그럼 클라를 고쳐야 한다는거 아님?;;