const sendJwtToClient = (user, res) => {
    // generate jwt 
    const token = user.generateJwtFromUser();
    console.log(user._id)
    const {JWT_COKIE, NODE_ENV} = process.env;
    return res.status(200).cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + parseInt(JWT_COKIE) * 1000 * 60),
        secure: NODE_ENV === "development" ? false : true
    })
    .json({
        success: true,
        access_token: token,
        data: {
            name: user.name,
            email: user.email,
            id: user._id
        }
    });
};

const isTokenIncluded = (req) => {
    
    return (
        
        req.headers.authorization
    );
};
const getAccessTokenFromHeader = (req) => {
    const authorization = req.headers.authorization; 
    // const access_token = authorization.split(" ")[1];
    return authorization;
}
module.exports = {
    sendJwtToClient,
    isTokenIncluded,
    getAccessTokenFromHeader
};