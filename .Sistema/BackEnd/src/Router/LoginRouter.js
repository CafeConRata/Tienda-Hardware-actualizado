const express = require("express");
const router = express.Router();
const { Login } = require("../Controller/LoginController");

router.post("/login", Login);

module.exports = router;