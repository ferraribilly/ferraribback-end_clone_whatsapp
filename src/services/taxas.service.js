import taxas from "taxas";
import { ativarUsuarioUber } from "../models/taxasModel.js";

taxas.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

export async function createPaymentService({ userId, placa }) {
  const preference = {
    items: [{
      title: "Taxa Corrida Realizada",
      quantity: 1,
      unit_price: 0.01,
    }],
    back_urls: {
      success: "https://api/mercadopago/sucesso",
      failure: "http://localhost:5000/api/mercadopago/erro",
      pending: "http://localhost:5000/api/mercadopago/pendente",
    },
    auto_return: "approved",
    notification_url: "http://localhost:5000/api/mercadopago/webhook",
    metadata: { userId, placa },
  };

  const response = await taxas.preferences.create(preference);
  return { init_point: response.body.init_point };
}

export async function handleWebhookService(body) {
  if (body.action === "payment.created" || body.type === "payment") {
    const paymentId = body.data.id;
    const payment = await taxas.payment.findById(paymentId);

    if (payment.body.status === "approved") {
      const { userId } = payment.body.metadata;
      await ativarUsuarioUber(userId);
    }
  }
}
