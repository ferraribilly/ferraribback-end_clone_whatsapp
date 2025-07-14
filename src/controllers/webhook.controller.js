import { processWebhookNotification } from "../services/webhook.service.js";

export const handleWebhook = (req, res) => {
  try {
    const notification = req.body;

    console.log("Notificação recebida:", notification);

    processWebhookNotification(notification);

    res.status(200).send("OK");
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    res.status(500).send("Erro interno");
  }
};
