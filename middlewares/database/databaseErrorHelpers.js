const User = require("../../models/User");
const CustomError = require("../../helpers/error/CustomError");
const Question = require("../../models/Question");
const asyncErrorWrapper = require("express-async-handler");
const Answer = require("../../models/Answer");

const checkUserExists = asyncErrorWrapper(async (req,res,next) => {
    const {id} = req.params,
    user = await User.findById(id);

    if (!user) {
        return next(new CustomError("There is no such user with that id",400));
    };
    next();
});

const checkQuestionExists = asyncErrorWrapper(async (req,res,next) => {
    const question_id = req.params.id || req.params.question_id,

    question = await Question.findById(question_id);

    if (!question) {
        return next(new CustomError("There is no such question with that id",400));
    };
    next();
});

const checkQuestionAndAnswerExists = asyncErrorWrapper(async (req,res,next) => {
    const question_id = req.params.question_id;
    
    const answer_id = req.params.answer_id;
    const answer = await Answer.findOne({
        _id: answer_id,
        question : question_id
    });

    if (!answer) {
        return next(new CustomError("There is no answer with that id assosicated with that question id",400));
    };
    next();
});

module.exports = {
    checkUserExists,
    checkQuestionExists,
    checkQuestionAndAnswerExists
};