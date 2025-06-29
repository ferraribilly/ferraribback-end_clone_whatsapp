import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const OSRM_URL = "http://localhost:5001/route/v1/driving"; // Atenção na porta, que no seu curl é 5001

// Verifica se é coordenada (lon,lat)
function ehCoordenada(valor) {
  try {
    const partes = valor.trim().split(",");
    if (partes.length !== 2) return false;
    const [lon, lat] = partes.map(Number);
    return !isNaN(lon) && !isNaN(lat);
  } catch {
    return false;
  }
}

// Geocodificação - pode ser removida se só trabalhar com coordenadas
async function geocodeEndereco(endereco) {
  const url = "https://nominatim.openstreetmap.org/search";
  const params = {
    q: endereco,
    format: "json",
    limit: 1,
  };

  try {
    const response = await axios.get(url, { params, timeout: 5000 });
    const resultado = response.data;
    if (resultado.length > 0) {
      const { lat, lon } = resultado[0];
      return `${lon},${lat}`; // formato "lon,lat"
    }
  } catch (err) {
    console.error(`[ERRO] Geocodificação falhou: ${err.message}`);
  }

  return null;
}

export async function calcularRota(origem, destino) {
  const coordOrigem = ehCoordenada(origem) ? origem : await geocodeEndereco(origem);
  const coordDestino = ehCoordenada(destino) ? destino : await geocodeEndereco(destino);

  if (!coordOrigem || !coordDestino) {
    throw new Error("Não foi possível geocodificar origem ou destino.");
  }

  // Construção correta da URL, sem espaços
  const url = `${OSRM_URL}/${coordOrigem};${coordDestino}?overview=full&geometries=geojson&steps=true`;

  try {
    const response = await axios.get(url);
    if (!response.data || response.data.code !== "Ok") {
      throw new Error(`OSRM retornou erro: ${response.data?.code || "Erro desconhecido"}`);
    }
    const rota = response.data.routes[0];

    const distanciaKm = rota.distance / 1000;
    const duracaoMin = rota.duration / 60;
    const geometria = rota.geometry;

    // Corrigindo para lat/lon em objetos origem e destino para frontend
    const [origemLon, origemLat] = coordOrigem.split(",").map(Number);
    const [destinoLon, destinoLat] = coordDestino.split(",").map(Number);

    return {
      distancia: Number(distanciaKm.toFixed(2)),
      duracao: Number(duracaoMin.toFixed(2)),
      rota: geometria,
      origem: { coords: [origemLat, origemLon] },
      destino: { coords: [destinoLat, destinoLon] },
    };
  } catch (err) {
    console.error(`[ERRO] Falha na chamada ao OSRM: ${err.message}`);
    throw new Error("Erro ao calcular rota.");
  }
}
