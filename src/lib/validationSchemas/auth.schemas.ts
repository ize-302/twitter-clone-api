import Joi from "joi";

export const registrationSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  display_name: Joi.string(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

export const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
