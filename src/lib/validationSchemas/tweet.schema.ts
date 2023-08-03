import Joi from "joi";

export const tweetSchema = Joi.object({
  tweet: Joi.string().min(1).max(180).required(),
});
