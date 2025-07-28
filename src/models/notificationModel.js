import mongoose from "mongoose";


const notificationSchema = new mongoose.Schema({
  motoristaId: { type: String, required: true },
  nomeMotorista: { type: String, required: true },
  emailMotorista: { type: String, required: true },
  userId: { type: String, required: true },
  nomePassageiro: { type: String, required: true },
  origem: { type: String, required: true },
  destino: { type: String, required: true },
  distancia: { type: Number, required: true},
  duracao: { type: Number, required: true},
  formaPagamento: { type: String, required: true },
  valorCorrida: { type: Number, required: true },
  taxa: { type: Number, required: true },
  gastoCombustivel: { type: Number, required: true },
  gastoOleo: { type: Number, required: true },
  lucro: { type: Number, required: true },
  lida: { type: Boolean, default: false },
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
