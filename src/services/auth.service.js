import createHttpError from "http-errors";
import validator from "validator";
import bcrypt from "bcrypt";
import { UserModel } from "../models/index.js";

//env variables
const { DEFAULT_PICTURE, DEFAULT_STATUS } = process.env;

export const createUser = async (userData) => {
  const {
    name,
    email,
    picture,
    status,
    password,

    // ✅ Novos campos opcionais
    tipoVeiculo,
    marca,
    cor,
    placa,
    chavePix,
    precoPorKm,
    precoPorMinuto,
    taxaFixa,
    descontoHorario,
    fotoCNH,
    fotoDocumentoVeiculo,
    fotoQrCode,
  } = userData;

  //check if campos obrigatórios estão vazios
  if (!name || !email || !password) {
    throw createHttpError.BadRequest("Please fill all fields.");
  }

  //check name length
  if (!validator.isLength(name, { min: 2, max: 50 })) {
    throw createHttpError.BadRequest(
      "Please make sure your name is between 2 and 50 characters."
    );
  }

  //check status length
  if (status && status.length > 64) {
    throw createHttpError.BadRequest(
      "Please make sure your status is less than 64 characters."
    );
  }

  //check email válido
  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest(
      "Please make sure to provide a valid email address."
    );
  }

  //check email duplicado
  const checkDb = await UserModel.findOne({ email });
  if (checkDb) {
    throw createHttpError.Conflict(
      "Please try again with a different email address, this email already exists."
    );
  }

  //check senha
  if (!validator.isLength(password, { min: 6, max: 128 })) {
    throw createHttpError.BadRequest(
      "Please make sure your password is between 6 and 128 characters."
    );
  }

  // ✅ Criar novo usuário com todos os dados
  const user = await new UserModel({
    name,
    email,
    picture: picture || DEFAULT_PICTURE,
    status: status || DEFAULT_STATUS,
    password,

    // dados de veículo (opcionais)
    tipoVeiculo,
    marca,
    cor,
    placa,
    chavePix,
    precoPorKm,
    precoPorMinuto,
    taxaFixa,
    descontoHorario,
    fotoCNH,
    fotoDocumentoVeiculo,
    fotoQrCode,
  }).save();

  return user;
};

export const signUser = async (email, password) => {
  const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();

  if (!user) throw createHttpError.NotFound("Invalid credentials.");

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) throw createHttpError.NotFound("Invalid credentials.");

  return user;
};
