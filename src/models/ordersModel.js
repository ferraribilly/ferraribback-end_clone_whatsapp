import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: String,
  email: String,
  origem: String,
  destino: String,
  distancia: Number,
  duracao: Number,
  tipoVeiculo: { type: String, enum: ["carro", "moto", "entregador"], required: true },
  formaPagamento: String,
  valorCorrida: Number,
  statusPedido: { type: String, default: "aguardando o motorista aceitar" }, 
}, { timestamps: true });

const Orders = mongoose.model("Orders", orderSchema);
export default Orders;
