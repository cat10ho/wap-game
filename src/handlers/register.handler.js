import { v4 as uuidv4 } from 'uuid';
import { addUser, getHightScore } from '../models/user.model.js';
import { handleConnection, handleDisconnect, handlerEvent } from "./helper.js";
import { getGameAssets } from '../init/assets.js';

//유저 입장시 , 아이디 만들고 넣어줌. 나갈때 아이디 삭제함.
const registerHandler = (io) => {
    io.on('connection', (socket) => { //io.on을 하면 connection이벤트가 일어나기 전까지 대기.
        const clientUUID = socket.handshake.query.userUUID;
        let userUUID;

        if (clientUUID && clientUUID !== 'null') {
          userUUID = clientUUID;
         } else {
          userUUID = uuidv4();
         }

        addUser({ uuid: userUUID, socketId: socket.id });//소켓 객체가 가진 아이디.

        handleConnection(socket, userUUID); //여기서 스테이지 만듬.
       
        socket.on('requestAssets', () => { const assets = getGameAssets();
        socket.emit('assetsData', assets);
          });

        socket.on('requestHightScore', () => { const HightScore = getHightScore();
        socket.emit('hightScoreData', HightScore);
          });

        socket.on('event', (data) => handlerEvent(io, socket, data));//모든 이벤트는 헨들 이벤트로 처리.
        socket.on('disconnect', (socket) => handleDisconnect(socket, userUUID)); //이건 유저가 나갈때 지워줌.
    })// socket.on은 하나의 대상만.
}

export default registerHandler