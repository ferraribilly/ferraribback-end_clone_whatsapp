import * as storeService from "../services/store.service.js";

export const createStore = async (req, res) => {
  try {
    const { name, userId } = req.body;

    const store = await storeService.createStore(userId, name);
    res.status(201).json(store);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
