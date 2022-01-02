const Joi = require('joi');

const createQuestionSQL = {
  body: Joi.object().keys({
    ask: Joi.string(),
    answer1: Joi.string(),
    answer2: Joi.string(),
    answer3: Joi.string(),
    answer4: Joi.string(),
    correct: Joi.number(),
  }),
};

const getQuestionSQL = {
  params: Joi.object().keys({
    questionID: Joi.number(),
  }),
};

const updateQuestionSQL = {
  params: Joi.object().keys({
    questionID: Joi.number(),
  }),
};

const deleteQuestionSQL = {
  params: Joi.object().keys({
    questionID: Joi.number(),
  }),
};

module.exports = {
  createQuestionSQL,
  getQuestionSQL,
  updateQuestionSQL,
  deleteQuestionSQL,
};
