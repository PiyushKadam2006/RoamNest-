const joi = require("joi");

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        image: joi.object({
            filename: joi.string().optional(),
            url: joi.string().uri().allow("", null).optional()
        }).optional(),
        price: joi.number().required(),
        country: joi.string().required(),
        location: joi.string().required(),
        category: joi.string().optional(),
    }).required()
})

module.exports.reviewSchema = joi.object({
  review : joi.object({
    comment : joi.string().required(),
    rating : joi.number().required().min(1).max(5),
  }).required()
})