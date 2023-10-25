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
    phone: req.body.phone,
    password : req.body.password
     });

// 2- generate token
const token = JWT.sign({userId: user._id},process.env.JWT_SECRET_KEY,{
    expiresIn: process.env.JWT_EXPIRE_TIME,
    });

res.status(201).json({data : user , token});

});


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

