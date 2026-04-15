import * as gameService from "./game.service.js";

const SESSION_ID = "main";

export default function socketHandler(io, socket) {

  socket.on("join_session", ({ username }) => {
    const result = gameService.joinSession(
      SESSION_ID,
      socket.id,
      username
    );

    if (result.error) {
      socket.emit("error", result.error);
      return;
    }

    socket.join(SESSION_ID);

    io.to(SESSION_ID).emit("player_joined", result);
  });

  socket.on("start_game", ({ question, answer }) => {
    const result = gameService.startGame(
      SESSION_ID,
      socket.id,
      question,
      answer
    );

    if (result.error) {
      socket.emit("error", result.error);
      return;
    }

    io.to(SESSION_ID).emit("game_started", {
      question: result.question
    });
  });

  socket.on("send_guess", ({ guess }) => {
    const result = gameService.makeGuess(
      SESSION_ID,
      socket.id,
      guess
    );

    if (result.error) {
      socket.emit("error", result.error);
      return;
    }

    if (result.correct) {
      io.to(SESSION_ID).emit("game_ended", {
        winner: result.winner
      });
      return;
    }

    socket.emit("guess_result", result);
  });

  socket.on("end_game", () => {
    const session = gameService.endGame(SESSION_ID);

    io.to(SESSION_ID).emit("game_ended", {
      winner: session?.winner || null
    });
  });
}