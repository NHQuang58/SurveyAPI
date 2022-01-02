const Joi = require('joi');

const submitQuestionSQL = {
  body: Joi.object().keys({
    questionID: Joi.array(),
    correct: Joi.array(),
  }),
};

module.exports = {
  submitQuestionSQL,
};
