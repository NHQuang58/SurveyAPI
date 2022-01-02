const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { questionService } = require('../services');

/**
 * Create a question
 */
const createQuestionSQL = catchAsync(async (req, res) => {
  const question = await questionService.createQuestionSQL(req.body);
  res.status(httpStatus.CREATED).send(question);
});

/**
 * Get all questions
 */
const getAllQuestionsSQL = catchAsync(async (req, res) => {
  const options = pick(req.query, ['order', 'size', 'page']);
  const question = await questionService.getAllQuestionSQL(options);
  res.status(httpStatus.OK).send(question);
});

/**
 * Get a questions by id
 */
const getQuestionsSQL = catchAsync(async (req, res) => {
  const question = await questionService.getQuestionByID(req.params.questionID);
  res.status(httpStatus.OK).send(question);
});

/**
 * Update a questions by id
 */
const updateQuestionsSQL = catchAsync(async (req, res) => {
  const question = await questionService.updateQuestionsById(req.params.questionID, req.body);
  res.status(httpStatus.OK).send(question);
});

/**
 * Delete a questions by id
 */
const deleteQuestionsSQL = catchAsync(async (req, res) => {
  await questionService.deleteQuestionsById(req.params.questionID);
  res.status(httpStatus.OK).send();
});

module.exports = {
  createQuestionSQL,
  getAllQuestionsSQL,
  getQuestionsSQL,
  updateQuestionsSQL,
  deleteQuestionsSQL,
};
