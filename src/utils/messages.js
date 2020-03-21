const messages = {
  welcome: "Welcome to CYComm messaging application!",
  new_member: "A new member has joined",
  member_left: "A user has left",
  delivered: "Delivered",
  location_shared: "Location shared"
};

const generateMessages = (text, user) => {
  return {
    user,
    text,
    createdAt: new Date().getTime()
  };
};

const generateLocationMessage = (url, user) => {
  return {
    user,
    url,
    createdAt: new Date().getTime()
  };
};

module.exports = { generateMessages, generateLocationMessage };
