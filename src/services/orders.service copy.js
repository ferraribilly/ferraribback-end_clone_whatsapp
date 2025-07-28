import Orders from "../models/ordersModel.js";
import Notification from "../models/notificationModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADMIN_APP,
    pass: process.env.EMAIL_SENHA_APP,
  },
});

export async function criarPedidoService(dados, io, socketId) {
  if (!dados.userId) throw new Error("userId é obrigatório para criar pedido.");

  const exists = await Orders.findOne({
    userId: dados.userId,
    statusPagamento: "pendente",
  });
  if (exists) throw new Error("Já existe um pedido pendente para esse usuário.");

  const novoPedido = new Orders(dados);
  const pedidoSalvo = await novoPedido.save();

  try {
    const valorCorrida = pedidoSalvo.valorCorrida;
    const lucroBruto = parseFloat((valorCorrida * 0.82).toFixed(2));
    const taxa = parseFloat((valorCorrida - lucroBruto).toFixed(2));

    const precoGasolina = 6.0;
    const consumoMedioKmPorLitro = 10;
    const custoPorTrocaOleo = 200;

    const gastoCombustivel = parseFloat(
      ((pedidoSalvo.distancia / consumoMedioKmPorLitro) * precoGasolina).toFixed(2)
    );
    const gastoOleo = parseFloat(
      ((custoPorTrocaOleo / 10000) * pedidoSalvo.distancia).toFixed(2)
    );
    const lucroLiquido = parseFloat(
      (lucroBruto - gastoCombustivel - gastoOleo).toFixed(2)
    );

    const notificacaoEmail = await Notification.create({
      motoristaId: pedidoSalvo.motorista._id,
      nomeMotorista: pedidoSalvo.motorista.name,
      emailMotorista: pedidoSalvo.motorista.email,
      userId: pedidoSalvo.userId,
      nomePassageiro: pedidoSalvo.name,
      origem: pedidoSalvo.origem,
      destino: pedidoSalvo.destino,
      distancia: pedidoSalvo.distancia,
      duracao: pedidoSalvo.duracao,
      formaPagamento: pedidoSalvo.formaPagamento,
      valorCorrida,
      taxa,
      gastoCombustivel,
      gastoOleo,
      lucro: lucroLiquido,
    });

    await transporter.sendMail({
      from: `"Vai Rápido App" <${process.env.EMAIL_ADMIN_APP}>`,
      to: pedidoSalvo.motorista.email,
      subject: "🚗 Nova corrida disponível para você",
     html: `
  <h2>Olá, ${pedidoSalvo.motorista.name}!</h2>
  <p>Você tem uma nova corrida disponível:</p>
  <ul>
    <li><strong>Passageiro:</strong> ${pedidoSalvo.name}</li>
    <li><strong>Origem:</strong> ${pedidoSalvo.origem}</li>
    <li><strong>Destino:</strong> ${pedidoSalvo.destino}</li>
    <li><strong>Distância:</strong> ${pedidoSalvo.distancia} km</li>
    <li><strong>Duração:</strong> ${pedidoSalvo.duracao} min</li>
    <li><strong>Forma de pagamento:</strong> ${pedidoSalvo.formaPagamento}</li>
    <li><strong>Valor da corrida:</strong> R$ ${valorCorrida.toFixed(2)}</li>
    <li><strong>Taxa da plataforma:</strong> R$ ${taxa.toFixed(2)}</li>
    <li><strong>Gasto Combustível:</strong> R$ ${gastoCombustivel.toFixed(2)}</li>
    <li><strong>Gasto Óleo:</strong> R$ ${gastoOleo.toFixed(2)}</li>
    <li><strong>Lucro líquido estimado:</strong> R$ ${lucroLiquido.toFixed(2)}</li>
  </ul>
  <p style="margin-top: 20px;">Acesse o app e aceite a corrida:</p>
    <a href="https://whats-delivery-uber-vairapido.onrender.com" target="_blank"
      style="display:inline-block;padding:10px 20px;background-color:#007BFF;
             color:#fff;text-decoration:none;border-radius:5px;font-weight:bold;">
      Abrir o App Vai Rápido
    </a>
  `,

    });

  } catch (error) {
    console.error("Erro ao gerar ou enviar notificação:", error);
  }

  return pedidoSalvo;
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
