const socket = io();

const playersDiv = document.getElementById("players");
const questionEl = document.getElementById("question");

function joinGame() {
  const username = document.getElementById("username").value;

  if (!username) return alert("Enter username");

  socket.emit("join_session", { username });
}

socket.on("player_joined", (session) => {
  playersDiv.innerHTML = "";

  Object.values(session.players).forEach((player) => {
    const p = document.createElement("p");
    p.innerText = player.username;
    playersDiv.appendChild(p);
  });
});

function startGame() {
  const question = prompt("Enter question:");
  const answer = prompt("Enter answer:");

  socket.emit("start_game", { question, answer });
}

socket.on("game_started", (data) => {
  alert("Game Started!");
  questionEl.innerText = data.question;
});

function sendGuess() {
  const guess = document.getElementById("guessInput").value;

  if (!guess) return alert("Enter guess");

  socket.emit("send_guess", { guess });
}

socket.on("guess_result", (data) => {
  if (data.correct) {
    alert("Correct!");
  } else {
    alert("Wrong! Attempts left: " + data.attemptsLeft);
  }
});

socket.on("game_ended", (data) => {
  alert("Game Over! Winner: " + data.winner);
});

socket.on("error", (msg) => {
  alert(msg);
});