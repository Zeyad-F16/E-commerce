const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const userModel = require('../models/userModel');
const ApiError = require('../utils/apiError');


// @desc    signup
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async(req, res, next)=>{
// 1- create user
const user = await userModel.create({
    name : req.body.name ,
    email : req.body.email ,
    password : req.body.password
     });

// 2- generate token
const token = JWT.sign({userId: user._id},process.env.JWT_SECRET_KEY,{
    expiresIn: process.env.JWT_EXPIRE_TIME,
    });

res.status(201).json({data : user , token});

});


// @desc    login
// @route   POST /api/v1/auth/login
// @access  Public
exports.login =asyncHandler(async(req, res, next)=>{

const user = await userModel.findOne({email: req.body.email});
if(!user || !(await bcrypt.compare(req.body.password , user.password))){
    return next(new ApiError('Incorrect Email or Password',401));
}

const token = JWT.sign({userId: user._id},process.env.JWT_SECRET_KEY,{
    expiresIn: process.env.JWT_EXPIRE_TIME,
    });

res.status(201).json({data : user , token});

});

