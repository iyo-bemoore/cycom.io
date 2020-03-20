/* const socket = io();
const messageHolder = document.querySelectorAll(".message");
const form = document.querySelector(".form");
const formInput = document.querySelector(".form-input");
const locationButton = document.querySelector(".location-button");

const $messages = document.querySelector("#messages");
const messageTemplate = document.querySelector("#message-template").innerHTML; */

/* const setAndDisplayAlertMessage = (inputMessage, eventType) => {
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

createAndAddDeliveryMessage = message => {
  const deliverySpan = document.createElement("span");
  deliverySpan.classList.add("delivery");
  deliverySpan.textContent = message;
  const messageBubble = document.querySelectorAll(".message-bubble");
  messageBubble[messageBubble.length - 1].appendChild(deliverySpan);
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
}; */

/*  form.addEventListener("submit", event => {
  event.preventDefault();
  if (formInput.value) {
    socket.emit("incoming", formInput.value, delivery => {
      createAndAddDeliveryMessage(delivery);
    });
  }
  formInput.value = "";
}); */
/*
locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return setAndDisplayAlertMessage("Not supported", "leave");
  }
  locationButton.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    socket.emit("location", { latitude, longitude }, delivery => {
      locationButton.removeAttribute("disabled");
      createAndAddDeliveryMessage(delivery);
    });
  });
}); */

/* socket.on("welcome", message => {
  messageHolder[0].textContent = message;
});

socket.on("new_member", message => {
  setAndDisplayAlertMessage(message, "welcome");
});

socket.on("member_left", message => {
  setAndDisplayAlertMessage(message, "leave");
});

socket.on("emitted", value => {
  //createandAddMessageBubble("p", "emitted", value);
  const html = Mustache.render(messageTemplate, { message });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("link", value => {
  createandAddMessageBubble("A", "link", value);
}); */
