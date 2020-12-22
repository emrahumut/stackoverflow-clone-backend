const mongoose = require('mongoose');
const Question = require("./Question");
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    content: {
        type: String,
        required: [true, "Please provide a content"],
        minlength: [10,"Please provide a content at least 10 charecter"]
    },
    createdAt: {
        type : Date,
        default : Date.now
    },
    likes : [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }  
    ],
    likeCount : {
        type: Number,
        default: 0
    },
    user : { // Adding who answer
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true
    },
    question : {
        type : mongoose.Schema.ObjectId,
        ref : "Question",
        required : true
    }
});

AnswerSchema.pre("save",async function (next) {
    if (!this.isModified("user")) {
        return next();
    }
    try {
        const question = await Question.findById(this.question); // questionun idsi
        question.answers.push(this._id); // answerın idsi
        question.answerCount = question.answers.length;
        await question.save();
        next();
    }
    catch (err) {
        return next(err);
    }
    
});


module.exports = mongoose.model("Answer",AnswerSchema);