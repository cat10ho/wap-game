import { CLIENT_VERSION } from '../constants.js';
import { getGameAssets } from '../init/assets.js';
import { createStage, getStage, setStage } from '../models/stage.model.js';
import { getHightScore, getUser, removeUser } from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';


//여긴 그냥 한번 거치는 용도인듯. 일단 디스 커넥트는 그냥 해도 되는데 한번 걸치는거 맞음.

//유저 삭제함수 불러오는 함수.
export const handleDisconnect = (socket, uuid) => {
    removeUser(socket.id); // 사용자 삭제
    console.log(`User disconnected: ${socket.id}`);
    console.log('Current users:', getUser());
  }; 


export const handleConnection = (socket, uuid) => {
    console.log(`새 유저:${uuid}, 소켓아이디 ${socket.id}`);
    console.log('현재 접속중인 유저:', getUser());

    createStage(uuid);
    const hightScore = getHightScore();
    if( uuid === hightScore.uuid )
    {
        const message = '최강자 강림.'
        socket.emit('connection',{uuid , message}); 
        return;
    }

    socket.emit('connection',{uuid}); //본인에게 보내는것. 지금 유저 아이디 뭔지 보내는것.
}

export const handlerEvent = (io, socket, data) => {//data = payload 
    if(!CLIENT_VERSION.includes(data.clientVersion)){
        socket.emit('response', { status:'fail', message: "버전 틀림."})
        return;
     }


     const handler = handlerMappings[data.handlerId];//2,3,11을 주고 그중 하나 가져오는거.
     if (!handler){
        socket.emit('response', {status:'fail', message: "헨들러가 없어용"})
        return;
     }

     const response = handler(data.userId, data.payload);//실행. 그럼 다 동일화 해야하네.. 아니지 뭐 나눠서 하겠네.

     if (response.broadcast) { //만약 모든 유저에게 보내야 하는거면 
        io.emit('response', response);//여기서 뭐 barodcast만 안보내거나 하면 되지.
        return;
     }

     socket.emit('response', response);
}