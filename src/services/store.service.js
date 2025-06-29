import Store from "../models/storeModel.js";

export const createStore = async (userId, name) => {
  const exists = await Store.findOne({ owner: userId });
  if (exists) {
    throw new Error("Usuário já possui uma lanchonete");
  }

  const store = new Store({ owner: userId, name });
  await store.save();
  return store;
};
