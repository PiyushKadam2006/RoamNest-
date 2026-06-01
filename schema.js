const joi = require("joi");

module.exports.listingSchema = joi.object({
    listing : joi.object({
        title : joi.string().required(),
        description : joi.string().required(),
        image: joi.object({
      filename: joi.string().optional(),
      url: joi.string().uri().allow("",null).required()
    }).required(),
    price : joi.number().required(),
    country : joi.string().required(),
    location : joi.string().required(),
    }).required()
})