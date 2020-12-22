const CustomError = require('../../helpers/error/CustomError');

const customErrorHandler = (err, req, res,next) => {
    let customError = err;

    // uygulamadan fırlatılan bir errorün statusu yoktur ve bizim bunu kontrol etmemiz gerekir
    if (err.name === "SyntaxError"){
        customError = new CustomError("Unexpected Syntax",400); 
    }
    if (err.name === "ValidationError"){
        customError = new CustomError(err.message,400);
    }
    if (err.code === 11000){
        // duplicate error
        customError = new CustomError("Duplicate error: Check your input",400);
    }
    if (err.name === "CastError"){
        customError = new CustomError("Please provide a valid id",400);
    }
    console.log(customError)
    res.status(customError.status || 500).json({
        success: false,
        message: customError.message || "Internal Server Error"
    });
}

module.exports = customErrorHandler;