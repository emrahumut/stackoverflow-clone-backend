const express = require('express');
const router = express.Router();
const {
    register,
    getUser,
    login,
    logout,
    imageUpload,
    forgotPassword,
    resetPassword,
    editDetails
} = require('../controllers/auth');

const profileImageUpload = require('../middlewares/libraries/profileImageUpload')
const { getAccessToRoute } = require('../middlewares/authorization/auth')
const { checkUserExists } = require('../middlewares/database/databaseErrorHelpers');

router.get("/register");

router.post("/register", register);


router.get("/profile", getAccessToRoute, getUser);
router.post("/login", login);
router.get("/logout", getAccessToRoute, logout);
router.post("/upload", [getAccessToRoute, profileImageUpload.single("profile_image")], imageUpload);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword", resetPassword);
router.put("/edit", [getAccessToRoute, checkUserExists], editDetails);


module.exports = router


