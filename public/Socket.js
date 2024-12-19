import { CLIENT_VERSION } from './Constants.js';

const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
    userUUID: localStorage.getItem('userUUID'),
  },
});

let userId = null;
socket.on('response', (data) => {
  console.log(data);
});

socket.on('connection', (data) => {
  console.log('connection: ', data);

  if(data.message){
    console.log(data.message);
  }
  
  userId = data.uuid;
  const existingUUID = localStorage.getItem('userUUID');

  if (!existingUUID || existingUUID === 'null') {
    localStorage.setItem('userUUID', userId); 
  }
});

const loadAssets = () => {
  return new Promise((resolve, reject) => {
    socket.emit('requestAssets');
    socket.on('assetsData', (assets) => {
      resolve(assets);
    });
    socket.on('error', (error) => {
      reject(error);
    });
  });
};

const loadHightScore = () => {
  return new Promise((resolve, reject) => {
    socket.emit('requestHightScore');
    socket.on('hightScoreData', (HightScore) => {
      resolve(HightScore);
    });
    socket.on('error', (error) => {
      reject(error);
    });
  });
};

const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};


export { sendEvent, loadAssets, loadHightScore };
