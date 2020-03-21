const users = [];

const addUser = ({ id, username, room }) => {
  if (!username || !room) {
    return {
      error: "Must provide room and username"
    };
  }
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const userNameIsTaken = users.find(user => {
    return user.username === username && user.room === room;
  });
  if (userNameIsTaken) {
    return {
      error: "Username is already taken"
    };
  }
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = id => {
  if (!id) {
    return {
      error: "Must provide an id"
    };
  }
  const userIsFound = users.findIndex(user => user.id === id);
  if (userIsFound === -1) {
    return {
      error: "No user found"
    };
  }
  if (userIsFound !== -1) {
    return users.splice(userIsFound, 1)[0];
  }
};

const getUser = id => {
  if (!id) {
    return {
      error: "Must provide an id"
    };
  }
  const user = users.find(user => user.id === id);
  if (!user) {
    return {
      error: "No user Found"
    };
  }
  return { user };
};

const getUsersInRoom = room => {
  if (!room) {
    return {
      error: "Must provide room"
    };
  }
  room = room.trim().toLowerCase();

  let rooms = [];
  users.forEach(user => rooms.push(user.room));
  if (!rooms.includes(room)) {
    return {
      error: "No such room"
    };
  }

  const usersInRoom = users.filter(user => user.room === room);
  if (!usersInRoom.length) {
    return {
      error: "No users in the room"
    };
  }

  return usersInRoom;
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
};
