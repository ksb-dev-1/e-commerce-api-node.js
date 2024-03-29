import { Schema, model } from 'mongoose';
import validator from 'validator'
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
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

UserSchema.pre("save", async function (next) {
  // console.log("Hey there")
  // console.log(this.modifiedPaths())
  // console.log(this.isModified("password"))
  if (!this.isModified("password")) return

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


const User = model('User', UserSchema);

export default User;
