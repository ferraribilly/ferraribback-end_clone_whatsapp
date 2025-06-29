import { calcularRota } from "../services/rota.service.js";

export async function createRoutes(req, res) {
  const { origem, destino, api_key } = req.query;

  try {
    if (!api_key || api_key !== process.env.API_PUBLIC) {
      return res.status(403).json({ error: "Acesso não autorizado" });
    }

    if (!origem || !destino) {
      return res.status(400).json({ error: "Origem e destino são obrigatórios" });
    }

    const dadosRota = await calcularRota(origem, destino);
    return res.status(200).json(dadosRota);
  } catch (err) {
    console.error("[CONTROLLER ERRO]", err.message);
    return res.status(500).json({ error: "Erro ao calcular rota" });
  }
}
