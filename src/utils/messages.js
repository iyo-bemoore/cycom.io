const messages = {
  welcome: "Welcome to CYComm messaging application!",
  new_member: "A new member has joined",
  member_left: "A user has left",
  delivered: "Delivered",
  location_shared: "Location shared"
};

const generateMessages = text => {
  return {
    text,
    createdAt: new Date().getTime()
  };
};

const generateLocationMessage = url => {
  return {
    url,
    createdAt: new Date().getTime()
  };
};

module.exports = { generateMessages, generateLocationMessage };
