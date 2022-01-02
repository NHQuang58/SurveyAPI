const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const questionValidation = require('../../validations/question.validation');
const questionController = require('../../controllers/question.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageQuestions'), validate(questionValidation.createQuestionSQL), questionController.createQuestionSQL)
  .get(auth('getQuestions'), questionController.getAllQuestionsSQL);
router
  .route('/:questionID')
  .get(auth('getQuestions'), validate(questionValidation.getQuestionSQL), questionController.getQuestionsSQL)
  .patch(auth('manageQuestions'), validate(questionValidation.updateQuestionSQL), questionController.updateQuestionsSQL)
  .delete(auth('manageQuestions'), validate(questionValidation.deleteQuestionSQL), questionController.deleteQuestionsSQL);

module.exports = router;
