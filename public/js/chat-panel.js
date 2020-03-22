const socket = io();
console.log("running");
// Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");
// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const urlTemplate = document.querySelector("#link-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;
//Options

const autoscroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $messages.offsetHeight;

  // Height of messages container
  const containerHeight = $messages.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

const { username, room } = JSON.parse(window.localStorage.getItem("userData"));

socket.on("message", ({ text, createdAt, user }) => {
  const html = Mustache.render(messageTemplate, {
    message: text,
    user,
    createdAt: moment(createdAt).format("h:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", ({ url, createdAt, user }) => {
  const html = Mustache.render(urlTemplate, {
    user,
    url,
    createdAt: moment(createdAt).format("h:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("roomStatus", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });
  document.querySelector("#sidebar").innerHTML = html;
});

$messageForm.addEventListener("submit", e => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  if (!message) {
    return;
  }
  $messageFormButton.setAttribute("disabled", "disabled");
  socket.emit("sendMessage", message, error => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    if (error) {
      return console.log(error);
    }

    console.log("Message delivered!");
  });
});

let typing = false;
let timeOut = undefined;

const typingTimeout = () => {
  typing = false;
  socket.emit("typing", { username, typing: false });
};

$messageForm.addEventListener("keypress", e => {
  if (e.wich !== 13) {
    socket.emit("typing", { username, typing: true });
    clearTimeout(timeOut);
    timeOut = setTimeout(typingTimeout, 3000);
  } else {
    clearTimeout(timeOut);
    typingTimeout();
  }
});

const createOrRemoveTypingContainer = (user, input) => {
  const $typingContainer = document.querySelector("#typing");
  const $messageContainer = document.createElement("div");

  if (!$typingContainer.hasChildNodes() && input === "create") {
    $typingContainer.classList.remove("hidden");
    const $messageHolder = document.createElement("span");
    $messageContainer.classList.add("message-typing");
    $messageHolder.textContent = `${user} is typing`;
    $messageContainer.appendChild($messageHolder);
    $typingContainer.appendChild($messageContainer);
  } else if ($typingContainer.hasChildNodes() && input === "remove") {
    $typingContainer.classList.add("hidden");
    $typingContainer.innerHTML = "";
  }
};

socket.on("display", ({ username, typing }) => {
  console.log(typing);
  if (typing) {
    createOrRemoveTypingContainer(username, "create");
  } else {
    createOrRemoveTypingContainer(username, "remove");
  }
});

$sendLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }
  $sendLocationButton.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      () => {
        $sendLocationButton.removeAttribute("disabled");
        console.log("Location shared!");
      }
    );
  });
});
socket.emit("join", { username, room }, error => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
