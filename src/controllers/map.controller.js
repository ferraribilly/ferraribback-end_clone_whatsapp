import { fetchRotaOSRM } from '../services/map.service.js';

export const getRoute = async (req, res) => {
  try {
    const { origem, destino } = req.body;

    if (!origem || !destino) {
      return res.status(400).json({ error: 'Origem e destino obrigatórios.' });
    }

    const resultado = await fetchRotaOSRM(origem, destino);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }



//   //--------------// to remove cors error------------------------
// Header('Access-Control-Allow-Origin: *');
// Header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
// header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token, Origin, Authorization');


  
};
