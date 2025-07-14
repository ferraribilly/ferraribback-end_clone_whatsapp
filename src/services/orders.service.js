import Orders from "../models/ordersModel.js";

export async function criarPedidoService(dados) {
  if (!dados.userId) throw new Error("userId é obrigatório para criar pedido.");

  const exists = await Orders.findOne({ userId: dados.userId, statusPagamento: "pendente" });
  if (exists) throw new Error("Já existe um pedido pendente para esse usuário.");

  const novoPedido = new Orders(dados);
  return await novoPedido.save();
}

export async function buscarPedidosPorTipo(tipoVeiculo) {
  return await Orders.find({ tipoVeiculo });
}

export async function buscarPedidoPorId(id) {
  const pedido = await Orders.findById(id);
  if (!pedido) throw new Error("Pedido não encontrado");
  return pedido;
}

export async function atualizarPedido(id, atualizacao) {
  const pedido = await Orders.findByIdAndUpdate(id, atualizacao, { new: true });
  if (!pedido) throw new Error("Pedido não encontrado");
  return pedido;
}






//endpoint to show all the pedido-requests of a particular user
// app.get("/pedido-request/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;

//     //fetch the user document based on the User id
//     const user = await User.findById(userId)
//       .populate("freindRequests", "name email image")
//       .lean();

//     const freindRequests = user.freindRequests;

//     res.json(freindRequests);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

//endpoint to accept a pedido-request of a aqui mudar pra enviar  aqui especificar tipoVeiculo: vai receber pedido person
// app.post("/pedido-request/accept", async (req, res) => {
//   try {
//     const { senderId, recepientId } = req.body;

//     //retrieve the documents of sender and the recipient
//     const sender = await User.findById(senderId);
//     const recepient = await User.findById(recepientId);

//     sender.pedido.push(recepientId);
//     recepient.pedido.push(senderId);

//     recepient.pedidoRequests = recepient.pedidoRequests.filter(
//       (request) => request.toString() !== senderId.toString()
//     );

//     sender.sentPedidoRequests = sender.sentPedidoRequests.filter(
//       (request) => request.toString() !== recepientId.toString
//     );

//     await sender.save();
//     await recepient.save();

//     res.status(200).json({ message: "Pedido Request accepted successfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

//endpoint to access all the pedido of the logged in user!
// app.get("/accepted-pedido/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const user = await User.findById(userId).populate(
//       "pedido",
//       "name email picture"
//     );
//     const acceptedPedidos = user.pedidos;
//     res.json(acceptedPedidos);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });