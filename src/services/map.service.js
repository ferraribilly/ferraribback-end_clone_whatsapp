import fetch from 'node-fetch';

const OSRM_URL = 'https://busy-sawfly-new.ngrok-free.app/route/v1/driving';

export const fetchRotaOSRM = async (origem, destino) => {
  const coordOrigem = origem;   // já em formato "lng,lat"
  const coordDestino = destino; // idem
  const coords = `${coordOrigem};${coordDestino}`;

  const url = `${OSRM_URL}/${coords}?overview=full&geometries=geojson&steps=true`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Erro ao buscar rota no OSRM');
  const json = await res.json();

  const rota = json.routes[0];
  return {
    distancia_km: rota.distance / 1000,
    duracao_min: rota.duration / 60,
    rota: rota.geometry
  };
};
