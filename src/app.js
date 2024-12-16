import express from "express";
import { createServer} from 'http';
import initSocket from "./init/socket.js";
import {loadGameAssets} from './init/assets.js';

const app= express(); 
const server= createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
initSocket(server);  //웹소켓 서버 연결.

server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
  
    try {
      const assets = await loadGameAssets(); //여기서 에셋 가져옴.
    } catch (e) {
      console.error('Failed to load game assets:', e);
    }
  });

//npx nodemon src/app.js 실행 키임 ㅇㅇ