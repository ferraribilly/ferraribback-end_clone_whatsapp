export const processWebhookNotification = (notification) => {
  if (notification.type === "payment") {
    const paymentId = notification.data.id;

    // Aqui você pode processar o pagamento, consultar a API do Mercado Pago, etc.
    console.log(`Pagamento recebido com ID: ${paymentId}`);
  }
};
