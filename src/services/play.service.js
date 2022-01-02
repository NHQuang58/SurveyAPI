const httpStatus = require('http-status');
const { Question } = require('../models');
const ApiError = require('../utils/ApiError');
const paginationService = require('./pagination.service');

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
  question.result.forEach((element, index, arr) => {
    arr[index].correct = null;
  });
  return question;
};

const getQuestionByPk = async (questionID) => {
  const question = Question.findByPk(questionID);
  return question;
};

// const submitQuestionSQL = async (req, res) => {
//   let totalScore = 0;
//   const arrQuestionID = req.questionID;
//   const arrCorrect = req.correct;
//   // eslint-disable-next-line no-restricted-syntax
//   for await (const element of arrQuestionID) {
//     const index = arrQuestionID.indexOf(element);
//     // eslint-disable-next-line no-await-in-loop
//     const currentQuestion = await getQuestionByPk(element);
//     if (!currentQuestion) {
//       throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
//     }
//     if (currentQuestion.correct === arrCorrect[index]) {
//       // eslint-disable-next-line no-plusplus
//       ++totalScore;
//     }
//   }
//   return totalScore;
// };

const submitQuestionSQL = async (arrSubmit) => {
  let totalScore = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const element of arrSubmit) {
    // eslint-disable-next-line no-await-in-loop
    const currentQuestion = await getQuestionByPk(element.questionID);
    if (element.correct === currentQuestion.correct) {
      // eslint-disable-next-line no-plusplus
      ++totalScore;
    }
  }
  return totalScore;
};

module.exports = {
  getAllQuestionSQL,
  submitQuestionSQL,
};
