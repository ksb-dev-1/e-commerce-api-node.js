import { Schema, model } from 'mongoose';
import validator from 'validator'
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'], 
    minLength: 3, 
    maxLength: 50
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate:{
        validator: validator.isEmail,
        message: "Please provide valid email"
    },
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minLength: 6
  },
  role: {
    type: String,
    enum: ["admin","user"],
    default: "user"
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


const User = model('User', userSchema);

export default User;
