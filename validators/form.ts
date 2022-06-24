import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { allowedSizes, allowedGenres } from "database";
import { allowedTypes } from "../database/constant";
const msgRequered = "Este campo es requerido";
const msgEmail = "Este campo no es un email válido";
const msgMinPass = "La contraseña debe tener al menos 6 caracteres ";
const msgPositive = "Este campo no puede ser negativo";
const msgNotAllowed = "Esta opcion no es permitdo";
const msgNoBlanks = "No se permiten espacios en blancos";

export const loginResolver = yupResolver(
  yup.object({
    email: yup.string().required(msgRequered).email(msgEmail),
    password: yup.string().required(msgRequered).min(6, msgMinPass),
  })
);
export const signupResolver = yupResolver(
  yup.object({
    name: yup.string().required(msgRequered),
    email: yup.string().required(msgRequered).email(msgEmail),
    password: yup.string().required(msgRequered).min(6, msgMinPass),
  })
);

export const addressResolver = yupResolver(
  yup.object({
    firstName: yup.string().required(msgRequered),
    lastName: yup.string().required(msgRequered),
    address: yup.string().required(msgRequered),
    address2: yup.string(),
    zip: yup.string().required(msgRequered),
    city: yup.string().required(msgRequered),
    country: yup.string().required(msgRequered),
    phone: yup.string().required(msgRequered),
  })
);

export const createProductResolver = yupResolver(
  yup.object({
    title: yup.string().required(msgRequered),
    inStock: yup.number().required(msgRequered).positive(msgPositive),
    images: yup.array().of(yup.string().required(msgRequered)),
    price: yup.number().required(msgRequered).positive(msgPositive),
    description: yup.string().required(msgRequered),
    sizes: yup.array().of(yup.string().required(msgRequered).oneOf(allowedSizes, msgNotAllowed)),
    tags: yup.array().of(yup.string().required(msgRequered)),
    type: yup.string().required(msgRequered).oneOf(allowedTypes, msgNotAllowed),
    gender: yup.string().required(msgRequered).oneOf(allowedGenres, msgNotAllowed),
    slug: yup
      .string()
      .required(msgRequered)
      .test("not-empty", msgNoBlanks, (val) => !val!.includes(" ")),
  })
);
