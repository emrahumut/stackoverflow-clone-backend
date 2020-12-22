const express = require('express');
const { askNewQuestion, getAllQuestion, findQuestion, editQuestion, deleteQuestion, likeQuestion, questions } = require('../controllers/question');
const { getAccessToRoute, getQuestionOwnerAccess } = require('../middlewares/authorization/auth');
const { checkQuestionExists } = require('../middlewares/database/databaseErrorHelpers');
const answer = require('./answer');
const router = express.Router();
const questionQueryMiddleware = require('../middlewares/query/questionQueryMiddleware');
const Question = require("../models/Question");

router.get("/:id/like", [getAccessToRoute, checkQuestionExists], likeQuestion)
router.post("/ask", getAccessToRoute, askNewQuestion);
router.get("/", questionQueryMiddleware(
    Question, {
    population: {
        path: "user",
        select: "name profile_image"
    }
}
), getAllQuestion);

router.get("/allquestion", questions);
router.get("/find/:id", checkQuestionExists, findQuestion);
router.put("/:id/edit", [getAccessToRoute, checkQuestionExists, getQuestionOwnerAccess], editQuestion);
router.delete("/:id/delete", [getAccessToRoute, checkQuestionExists, getQuestionOwnerAccess], deleteQuestion);
router.use("/:question_id/answers", checkQuestionExists, answer);

module.exports = router