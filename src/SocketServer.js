import UserModel from "./models/userModel.js"; // ✅ Corrigido com extensão .js

let onlineUsers = [];

/**
 * Função principal do socket.
 */
export default function socketHandlers(socket, io) {
  // ✅ Quando o usuário entra
  socket.on("join", (user) => {
    socket.join(user.userId || user);

    const existingUser = onlineUsers.find(
      (u) => u.userId === user.userId || u.userId === user
    );

    if (!existingUser) {
      onlineUsers.push({
        userId: user.userId || user,
        socketId: socket.id,
        location: user.location || null,
      });
    }

    io.emit("get-online-users", onlineUsers);
    io.emit("setup socket", socket.id);
  });

  // ✅ Atualiza localização do usuário e salva no MongoDB
  socket.on("update location", async ({ userId, location }) => {
    const user = onlineUsers.find((u) => u.userId === userId);

    if (user) {
      user.location = location;

      console.log(`📍 Localização atualizada do usuário ${userId}:`, location);

      try {
        // ⬇️ Salva no banco
        await UserModel.findByIdAndUpdate(userId, {
          location: {
            type: "Point",
            coordinates: location.coordinates,
          },
        });

        // (opcional) notifica o front-end se necessário
        io.emit("user-location-updated", {
          userId,
          location,
        });

      } catch (err) {
        console.error("❌ Erro ao salvar localização no MongoDB:", err.message);
      }

      io.emit("get-online-users", onlineUsers);
    } else {
      console.warn(
        `⚠️ Usuário ${userId} tentou atualizar localização mas não está online.`
      );
    }
  });

  // ✅ Desconectar
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("get-online-users", onlineUsers);
  });

  // ✅ Entrar numa conversa
  socket.on("join conversation", (conversation) => {
    socket.join(conversation);
  });

  // ✅ Enviar mensagem
  socket.on("send message", (message) => {
    const conversation = message.conversation;
    if (!conversation?.users) return;

    conversation.users.forEach((user) => {
      if (user._id === message.sender._id) return;
      socket.in(user._id).emit("receive message", message);
    });
  });

  // ✅ Typing
  socket.on("typing", (conversation) => {
    socket.in(conversation).emit("typing", conversation);
  });

  socket.on("stop typing", (conversation) => {
    socket.in(conversation).emit("stop typing", conversation);
  });

  // ✅ Ligação: chamar usuário
  socket.on("call user", (data) => {
    if (!data?.userToCall || !data?.signal || !data?.from) {
      console.error("❌ Dados inválidos em 'call user':", data);
      return;
    }

    const userSocket = onlineUsers.find((user) => user.userId == data.userToCall);

    if (!userSocket?.socketId) {
      console.warn(`⚠️ Usuário ${data.userToCall} offline ou sem socketId.`);
      return;
    }

    io.to(userSocket.socketId).emit("call user", {
      signal: data.signal,
      from: data.from,
      name: data.name || "Desconhecido",
      picture: data.picture || null,
    });
  });

  // ✅ Ligação: aceitar
  socket.on("answer call", (data) => {
    if (!data?.to || !data?.signal) {
      console.error("❌ Dados inválidos em 'answer call':", data);
      return;
    }

    io.to(data.to).emit("call accepted", data.signal);
  });

  // ✅ Ligação: encerrar
  socket.on("end call", (id) => {
    if (!id) {
      console.error("❌ ID inválido em 'end call':", id);
      return;
    }

    io.to(id).emit("end call");
  });
}

// ✅ Exporta a lista de usuários online
export { onlineUsers };
