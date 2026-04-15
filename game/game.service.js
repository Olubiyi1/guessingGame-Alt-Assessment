import gameStore from "./game.store.js";

const SESSION_ID = "main";

export function joinSession(sessionId, socketId, username) {
  const session = gameStore.sessions[sessionId];

  if (!session) return { error: "Session not found" };

  if (session.status !== "waiting") {
    return { error: "Game already started" };
  }

  session.players[socketId] = {
    username,
    score: 0,
    attemptsLeft: 3,
    hasWon: false
  };

  return session;
}

export function startGame(sessionId, socketId, question, answer) {
  const session = gameStore.sessions[sessionId];

  if (!session) return { error: "Session not found" };

  if (session.gameMaster && session.gameMaster !== socketId) {
    return { error: "Not allowed" };
  }

  const playerCount = Object.keys(session.players).length;

  if (playerCount < 3) {
    return { error: "Need at least 3 players" };
  }

  session.gameMaster = socketId;
  session.status = "in_progress";
  session.question = question;
  session.answer = answer;

  return session;
}

export function makeGuess(sessionId, socketId, guess) {
  const session = gameStore.sessions[sessionId];

  if (!session) return { error: "Session not found" };

  if (session.status !== "in_progress") {
    return { error: "Game not active" };
  }

  const player = session.players[socketId];

  if (!player) return { error: "Player not found" };

  if (player.attemptsLeft <= 0) {
    return { error: "No attempts left" };
  }

  player.attemptsLeft--;

  if (guess.toLowerCase() === session.answer.toLowerCase()) {
    session.status = "ended";
    session.winner = socketId;
    player.score += 10;
    player.hasWon = true;

    return { correct: true, winner: socketId };
  }

  return {
    correct: false,
    attemptsLeft: player.attemptsLeft
  };
}

export function endGame(sessionId) {
  const session = gameStore.sessions[sessionId];

  if (!session) return;

  session.status = "ended";

  return session;
}