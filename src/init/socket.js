import { Server as SocketIO } from 'socket.io';
import registerHandler from '../handlers/register.handler.js';

//소켓 서버 연결 함수.

const initSocket = (server) => {
  // socket.io에 CORS 설정 추가
  const io = new SocketIO(server, {
    cors: {
      origin: '*',  // 허용할 도메인 (여기서는 모든 도메인 허용)
      methods: ['GET', 'POST'],
    }
  });
  
  // 소켓 핸들러 등록
  registerHandler(io);
};

export default initSocket;