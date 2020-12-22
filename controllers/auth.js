const User = require('../models/User')
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const {sendJwtToClient} = require("../helpers/authorization/tokenHelpers");
const { validateUserInput,
    comparePassword
} = require("../helpers/input/inputHelpers");

const sendEmail = require("../helpers/libraries/sendMail");
function getUserName(){

}
const register = asyncErrorWrapper(async (req,res,next) => {
    // POST DATA 
    // async,await yapısı 
    const {name,email,password,role } = req.body; 
    const user = await User.create({
        name,
        email, 
        password,
        role
    }); 
    sendJwtToClient(user,res);
});


const login = asyncErrorWrapper(async (req, res, next) => {
    const {email, password} = req.body;

    if(!validateUserInput(email, password)){
        return next(new CustomError("Please check your input",400));
    }

    const user = await User.findOne({ email }).select("+password"); 
    console.log(user);
    if(!user) {
        return next(new CustomError("Your password or email is wrong",400))
    }
    if(!comparePassword(password, user.password)){
        return next(new CustomError("your password or email is wrong",400));
    };
    
    sendJwtToClient(user,res);
});

const logout = asyncErrorWrapper(async (req, res, next) => {

    const {NODE_ENV} = process.env;

    return res.status(200)
    .cookie({
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: NODE_ENV === "development" ? false : true
    }).json({
        success : true,
        message: "Logout Successfull"
    });
});

const getUser = (req, res, next) => {
    res.json({
        succes: true,
        data: {
            id : req.user.id,
            name : req.user.name
        }
    });
};

const imageUpload = asyncErrorWrapper(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, {
        "profile_image": `http://localhost:${process.env.PORT}/uploads/`+ req.savedProfileImage
    },{
        new: true,
        runValidators: true
    });
    
    console.log(user)
    // Image upload success
    res.status(200).json({
        success: true,
        message: 'image upload successful',
    });
});

const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
    const resetEmail = req.body.email; 

    const user = await User.findOne({email: resetEmail});
    if(!user) {
        return next(new CustomError("there is no user with that email address",400));
    } // ayrı bir database kontrolü yapılacak.
    const resetPasswordToken = user.getResetPasswordTokenFromUser();
    
    await user.save();

    const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`
    const emailTemplate = `
    <h3> Reset your password</h3>
    <p> This <a href="${resetPasswordUrl}" target = '_blank'>link</a> will expire in 1 hour</p>
    `;
  
    try {
        await sendEmail({
            from : process.env.SMTP_USER,
            to : resetEmail,
            subject : "Reset your password",
            html : emailTemplate
        });
        return res.status(200).json({
            success: true,
            message: "token sent to your email address"
        });
    }
    catch (err) {
    
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        console.log(err);
        await user.save();

        return next(new CustomError("email could not be sent", 500));
    } 
});

const resetPassword = asyncErrorWrapper(async (req, res, next) => {

    const {resetPasswordToken} = req.query;
    const {password} = req.body;
    
    if(!resetPasswordToken){
        return next(new CustomError("Please provide a valid token",400));
    }
    let user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: {$gt : Date.now()}
    });

    if(!user) {
        return next(new CustomError("Invalid token or session expires",404));
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200)
    .json({
        success: true,
        message: "Reset your password"
    });
});

const editDetails = asyncErrorWrapper(async (req, res, next) => {

    const editInformation = req.body;

    const user = await User.findByIdAndUpdate(req.user.id,editInformation, {
        new: true,
        runValidators: true
    });
    return res.status(200).json({
        success: true,
        data: user
    })
});


module.exports = {
    register,
    getUser,
    login,
    logout,
    imageUpload,
    forgotPassword,
    resetPassword,
    editDetails
};