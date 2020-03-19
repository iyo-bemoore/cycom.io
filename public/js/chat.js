const socket = io();
const messageHolder = document.querySelector(".message");
const form = document.querySelector(".form");
const formInput = document.querySelector(".form-input");
const locationButton = document.querySelector(".location-button");
const deliveryMessage = document.querySelector(".delivery");

const setAndDisplayAlertMessage = (inputMessage, eventType) => {
  const alertContainer = document.querySelector(".message-alert");
  const alertHolder = document.querySelector(".alert");
  alertContainer.style.display = "block";
  alertContainer.style.backgroundColor =
    eventType === "welcome" ? " #44c153" : "#FF4500";

  alertHolder.textContent = inputMessage;
  setTimeout(() => {
    alertHolder.textContent = "";
    alertContainer.style.display = "none";
  }, 3000);
};

const createandAddMessageBubble = (elementType, eventType, value) => {
  const chatContainer = document.querySelector(".message-container");
  const container = document.createElement("div");
  const messagePara = document.createElement(elementType);
  container.classList.add("message-bubble");
  messagePara.classList.add("message");
  if (eventType === "emitted") {
    messagePara.textContent = value;
  } else {
    messagePara.setAttribute("href", value);
    messagePara.textContent = "Click here to view my location";
  }
  container.appendChild(messagePara);
  chatContainer.appendChild(container);
};

form.addEventListener("submit", event => {
  event.preventDefault();
  if (formInput.value) {
    socket.emit("incoming", formInput.value, message => {
      deliveryMessage.textContent = message;
    });
  }
  formInput.value = "";
});

locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return setAndDisplayAlertMessage("Not supported", "leave");
  }
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    socket.emit("location", { latitude, longitude });
  });
});

socket.on("welcome", message => {
  messageHolder.textContent = message;
});

socket.on("new_member", message => {
  setAndDisplayAlertMessage(message, "welcome");
});

socket.on("member_left", message => {
  setAndDisplayAlertMessage(message, "leave");
});

socket.on("emitted", (value, callback) => {
  createandAddMessageBubble("p", "emitted", value);
  callback();
});

socket.on("link", value => {
  createandAddMessageBubble("A", "link", value);
});
