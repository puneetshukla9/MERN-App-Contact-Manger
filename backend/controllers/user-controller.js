
const asyncHandler = require("express-async-handler");
const CONSTANTS = require("../constants");
const User = require("../models/userModel")
const crypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { name, password, email } = req.body;
    if (!name || !password || !email) {
        res.status(CONSTANTS.VALIDATION_FAILED);
        throw new Error("All Fields are mandatory")
    }
    const existing_user = await User.findOne({ email })
    if (existing_user) {
        res.status(CONSTANTS.VALIDATION_FAILED);
        throw new Error("Email-Id already exist")
    } else {
        const hashedPassword = await crypt.hash(password, 10);
        console.log("hashed " + hashedPassword);
        const contact = await User.create({ name, email, password: hashedPassword })
        res.status(201).json({ message: "Registered Successfully" })
    }


})
const login = asyncHandler(async (req, res) => {
    const { password, email } = req.body;
    if (!password || !email) {
        res.status(CONSTANTS.VALIDATION_FAILED);
        throw new Error("All Fields are mandatory")
    }
    const existing_user = await User.findOne({ email })
    if (existing_user && await crypt.compare(password, existing_user.password)) {
        const accessToken = jwt.sign(
            {
                user: {
                    name: existing_user.name,
                    email: existing_user.email,
                    id: existing_user.id
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1m" }
        )
        req.user = existing_user
        res.status(201).json({ message: "Login Successfully", accessToken });

    } else {

        res.status(CONSTANTS.VALIDATION_FAILED);
        throw new Error("Username or Password Incorrect")
    }

})

module.exports = { register, login }