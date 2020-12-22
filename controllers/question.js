const Question = require('../models/Question');
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");


const askNewQuestion = asyncErrorWrapper(async (req, res, next) => {

    
    const information = req.body;

    const question = await Question.create({
        ...information,
        user: req.user.id
    });
    res.status(200).json({
        success: true,
        data: question
    });
});

const getAllQuestion = asyncErrorWrapper(async (req, res, next) => {
    return res.status(200).json(res.queryResults);
});

const findQuestion = asyncErrorWrapper(async (req, res, next) => {
    const {id} = req.params;
    const question = await Question.findById(id);
    res.status(200).json({
        success: true,
        data: question
    });
});

const editQuestion = asyncErrorWrapper(async (req, res, next) => {
    const {id} = req.params;
    const {title,content} = req.body;
    
    let question = await Question.findById(id);
    question.title = title;
    question.content = content;
    question = await question.save();
    res.status(200).json({
        success: true,
        data: question
    });
});

const deleteQuestion = asyncErrorWrapper(async (req, res, next) => {
    const {id} = req.params;

    await Question.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Question delete operation successful"
    });
});

const likeQuestion = asyncErrorWrapper(async (req, res, next) => {
    const {id} = req.params;
    const question = await Question.findById(id);

    if (question.likes.includes(req.user.id)){
        const index = question.likes.indexOf(req.user.id);
        question.likes.splice(index, 1);
        question.likeCount = question.likes.length;
        await question.save();
        return res.status(200).json({
            success: true,
            likeCounts:question.likeCount,
            message: "YOU UNLIKED THIS QUESTION"
        });
    };
    question.likes.push(req.user.id);
    question.likeCount = question.likes.length;
    await question.save();

    return res.status(200).json({
        success: true,
        likeCounts: question.likeCount,
        message: "YOU LIKED THIS QUESTION"
    });
});

const questions = asyncErrorWrapper(async (req, res, next) => {

    let questions = await Question.find();

    return res.status(200).json({
        success: true,
        data: questions,
        user: null
    });
});

module.exports = {
    askNewQuestion,
    getAllQuestion,
    findQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    questions
};