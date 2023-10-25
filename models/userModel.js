const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type : String,
    trim : true,
    required: [true , 'name is required'],
},
sluq:{
    type : String,
    lowercase : true,
},
email:{
    type : String,
    required: [true , 'email is required'],
    unique : true,
    lowercase : true,
},
password:{
    type: String,
    required: [true , 'password is required'],
    minlength : [6,'Too short password'],
},
phone:{
    type: String,
    required: [true , 'phone number is required'],
},
role:{
    type:String ,
    enum :['admin', 'client'],
    default: 'client',
},

},{timestamps: true});


userSchema.pre('save',async function(next){
// if you want to update a password and you write the same old password
if (!this.isModified('password')) return next(); 
// hashing user password
this.password = await bcrypt.hash(this.password , 12);
next();
});

const User = mongoose.model('user',userSchema);

module.exports = User;