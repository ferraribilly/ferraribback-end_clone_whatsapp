import createHttpError from "http-errors";
import { createUser, signUser } from "../services/auth.service.js";
import { generateToken, verifyToken } from "../services/token.service.js";
import { findUser } from "../services/user.service.js";

export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      picture,
      status,
      password,
      precoPorKm,
      precoPorMinuto,
      taxaFixa,
      descontoHorario,
      chavePix,
      fotoCNH,
      fotoDocumentoVeiculo,
      fotoQrCode,
      tipoVeiculo,
      marca,
      cor,
      placa,
    } = req.body;

    const newUser = await createUser({
      name,
      email,
      picture,
      status,
      password,
      precoPorKm,
      precoPorMinuto,
      taxaFixa,
      descontoHorario,
      chavePix,
      fotoCNH,
      fotoDocumentoVeiculo,
      fotoQrCode,
      tipoVeiculo,
      marca,
      cor,
      placa,
    });

    const access_token = await generateToken(
      { userId: newUser._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );
    const refresh_token = await generateToken(
      { userId: newUser._id },
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );

    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/api/v1/auth/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      message: "register success.",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        picture: newUser.picture,
        status: newUser.status,
        precoPorKm: newUser.precoPorKm,
        precoPorMinuto: newUser.precoPorMinuto,
        taxaFixa: newUser.taxaFixa,
        descontoHorario: newUser.descontoHorario,
        chavePix: newUser.chavePix || "",
        fotoCNH: newUser.fotoCNH || "",
        fotoDocumentoVeiculo: newUser.fotoDocumentoVeiculo || "",
        fotoQrCode: newUser.fotoQrCode || "",
        tipoVeiculo: newUser.tipoVeiculo || "",
        marca: newUser.marca || "",
        cor: newUser.cor || "",
        placa: newUser.placa || "",
        token: access_token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await signUser(email, password);

    const access_token = await generateToken(
      { userId: user._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );
    const refresh_token = await generateToken(
      { userId: user._id },
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );

    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/api/v1/auth/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "login success.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
        precoPorKm: user.precoPorKm,
        precoPorMinuto: user.precoPorMinuto,
        taxaFixa: user.taxaFixa,
        descontoHorario: user.descontoHorario,
        chavePix: user.chavePix || "",
        fotoCNH: user.fotoCNH || "",
        fotoDocumentoVeiculo: user.fotoDocumentoVeiculo || "",
        fotoQrCode: user.fotoQrCode || "",
        tipoVeiculo: user.tipoVeiculo || "",
        marca: user.marca || "",
        cor: user.cor || "",
        placa: user.placa || "",
        token: access_token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("refreshtoken", { path: "/api/v1/auth/refreshtoken" });
    res.json({
      message: "logged out !",
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refresh_token = req.cookies.refreshtoken;
    if (!refresh_token) throw createHttpError.Unauthorized("Please login.");
    const check = await verifyToken(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await findUser(check.userId);

    const access_token = await generateToken(
      { userId: user._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
        precoPorKm: user.precoPorKm,
        precoPorMinuto: user.precoPorMinuto,
        taxaFixa: user.taxaFixa,
        descontoHorario: user.descontoHorario,
        chavePix: user.chavePix || "",
        fotoCNH: user.fotoCNH || "",
        fotoDocumentoVeiculo: user.fotoDocumentoVeiculo || "",
        fotoQrCode: user.fotoQrCode || "",
        tipoVeiculo: user.tipoVeiculo || "",
        marca: user.marca || "",
        cor: user.cor || "",
        placa: user.placa || "",
        token: access_token,
      },
    });
  } catch (error) {
    next(error);
  }
};
