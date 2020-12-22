const express = require('express');
const router = express.Router({ mergeParams: true });

const { getAccessToRoute, getAnswerOwnerAccess } = require("../middlewares/authorization/auth");
const {
    addNewAnswerToQuestion,
    getAllAnswersByQuestion,
    getSingleAnswer,
    editAnswer,
    deleteAnswer,
    likeAnswer } = require("../controllers/answer");

const { checkQuestionAndAnswerExists } = require("../middlewares/database/databaseErrorHelpers");


router.post("/", getAccessToRoute, addNewAnswerToQuestion);
router.get("/", getAllAnswersByQuestion);
router.get("/:answer_id", checkQuestionAndAnswerExists, getSingleAnswer);
router.get("/:answer_id/like", [checkQuestionAndAnswerExists, getAccessToRoute], likeAnswer);
router.put("/:answer_id/edit", [checkQuestionAndAnswerExists, getAccessToRoute, getAnswerOwnerAccess], editAnswer);
router.delete("/:answer_id/delete", [checkQuestionAndAnswerExists, getAccessToRoute, getAnswerOwnerAccess], deleteAnswer);

module.exports = router;
