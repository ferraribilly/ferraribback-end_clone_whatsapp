import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export const criarPagamento = async (dadosPagamento) => {
  const pagamento = {
    transaction_amount: 2.0, // valor pra verificação se a conta esta seu nome mesmo
    description: dadosPagamento.description,
    payment_method_id: dadosPagamento.payment_method_id,
    payer: {
      email: dadosPagamento.payer.email,
      first_name: dadosPagamento.payer.first_name,
      last_name: dadosPagamento.payer.last_name,
      identification: {
        type: dadosPagamento.payer.identification.type,
        number: dadosPagamento.payer.identification.number,
      },
      address: dadosPagamento.payer.address || undefined,
    },
    notification_url: process.env.MERCADOPAGO_WEBHOOK_URL,
  };

  const resposta = await mercadopago.payment.create(pagamento);
  return resposta.body;
};
