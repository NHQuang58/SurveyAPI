const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { playService, userService } = require('../services');

/**
 * Get all questions
 */
const getAllQuestionsSQL = catchAsync(async (req, res) => {
  const options = pick(req.query, ['order', 'size', 'page']);
  const question = await playService.getAllQuestionSQL(options);
  res.status(httpStatus.OK).send(question);
});

/**
 * Submit  questions
 */
const submitQuestionsSQL = catchAsync(async (req, res) => {
  const totalScore = await playService.submitQuestionSQL(req.body);
  await userService.updateUserByPk(req.user.userID, { score: totalScore });
  res.status(httpStatus.OK).send({ totalScore });
});

module.exports = {
  getAllQuestionsSQL,
  submitQuestionsSQL,
};
