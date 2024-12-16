//일정 점수인지 검증해야함.

import { getGameAssets } from "../init/assets.js";
import { getStage, setStage } from "../models/stage.model.js"

export const moveStageHandler = (userId, payload) => {

    let currentStages = getStage(userId);
    if (!currentStages.length) {
        return { status: 'fail', message: "유저 스테이지 없음." }
    }

    currentStages.sort((a,b) => a.id - b.id); //오름차수 정렬
    const currentStage = currentStages[currentStages.length - 1]; //가장 큰걸 가져옴 아. 지금 있는. ㅇㅇ 올라갈 때마다 커지니까.

    if (currentStage.id !== payload.currentStage){ //여기 있는 현재 스테이지와 요청에서 현재 스테이지가 다를때.
        return { status: 'fail', message: "유저 스테이지 맞지않음." }
    }


    const serverTime = Date.now(); //이거 변동이 안되나 보네; 된다고 하네요.
    
    const {stages, itemUnlocks} = getGameAssets(); //게임 스테이지를 다불러오네; 근데 이게 되네;

    if (!stages.data.some((stage)=> stage.id === payload.targetStage)) {//여기 있나 확인. 
        return { status: 'fail', message: "타겟 스테이지 찾을 수 없음." }
    }

    if(currentStage.id>1001){
        const stageItemUnlock = itemUnlocks.data.find(unlock => unlock.stage_id === currentStage.id);
        const validItemId = stageItemUnlock.item_id; //스테이지에서 얻을수 있는 아이템.
        
    if (payload.getItemId.some(itemId => itemId > validItemId)) {
        return { status: 'fail', message: "스테이지에서 얻을수 없는 아이템을 얻음." };
    }
    }

    setStage(userId, payload.targetStage, serverTime, payload.getItemId); //다음 스테이지는 시간 새로 계산. 욕해서 죄송합니다 센세이..
    return { status: "success" };
}