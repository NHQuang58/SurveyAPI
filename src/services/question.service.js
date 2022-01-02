const httpStatus = require('http-status');
const { Question } = require('../models');
const ApiError = require('../utils/ApiError');
const paginationService = require('./pagination.service');

const createQuestionSQL = async (questionBody) => {
  return Question.create(questionBody);
};

const getAllQuestionSQL = async (options) => {
  let page = parseInt(options.page, 10);
  if (!page) page = 1;
  let size = parseInt(options.size, 10);
  if (!size) size = await Question.count();
  if (!options.order) {
    options.order = 'asc';
  }
  const { limit, offset } = paginationService.getPagination(page, size);
  const data = await Question.findAndCountAll({ limit, offset, order: [['questionID', options.order]] }); // DESC or ASC
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }
  const question = paginationService.getPagingData(data, page, limit);
  return question;
};

const getQuestionByID = async (questionID) => {
  const question = await Question.findByPk(questionID);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }
  return question;
};

const updateQuestionsById = async (questionID, updateBody) => {
  const question = await Question.findByPk(questionID);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }
  Object.assign(question, updateBody);
  await question.save();
  return question;
};

const deleteQuestionsById = async (questionID) => {
  const question = await Question.findByPk(questionID);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }
  await question.destroy();
  return question;
};

module.exports = {
  createQuestionSQL,
  getAllQuestionSQL,
  getQuestionByID,
  updateQuestionsById,
  deleteQuestionsById,
};
