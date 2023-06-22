const Joi = require('joi');

const campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0)
  }).required()
})

module.exports = campgroundSchema;