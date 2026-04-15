const gameStore = {
  sessions: {
    main: {
      gameMaster: null,
      status: "waiting",
      question: "",
      answer: "",
      players: {},
      winner: null,
      createdAt: Date.now()
    }
  }
};

export default gameStore;