const express = require('express');
const { getSingleUser, getAllUsers } = require('../controllers/user')
const router = express.Router();

router.get("/", getAllUsers,);
router.get("/:id", getSingleUser);

module.exports = router;