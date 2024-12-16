//스테이지 저장 하는 곳임.
//유저 아이디: 스테이지 라는 객체를 만들어 넣는거임. 근데 그럼 stage.uuid 가 아닌가?..

const stage = {};

export const createStage = (uuid) => {
    stage[uuid] = [];
}

//유저 스테이지 보기.
export const getStage = (uuid) => {
    return stage[uuid];
}

export const setStage = (uuid, id, timestamp, itemId) => {
    return stage[uuid].push({ id, timestamp, itemId });
}

export const clearStage = (uuid) => {
   stage[uuid] = [];
}