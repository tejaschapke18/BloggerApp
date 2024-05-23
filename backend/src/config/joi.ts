import Joi, { Schema } from "joi";

export const userSchema: Schema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

export const blogSchema: Schema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
});
