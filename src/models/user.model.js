const users = [];
const hightScore = { hightScore:0, uuid:0 };

export const addUser = (user) => {
  users.push(user);
};

export const removeUser = (socketId) => { //소켓 아이디 아니고 유저 아이디도 ㄱㅊ음.
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {//-1이면 없는거니까 뭐..
    return users.splice(index, 1)[0];
  }
};

export const getUser = () => {
  return users;
};

export const setHightScore = (score, uuid) => {
  hightScore.hightScore = score; // 전역 객체의 hightScore 갱신
  hightScore.uuid = uuid;       // 전역 객체의 uuid 갱신
};

export const getHightScore = () => {
  return hightScore;
};