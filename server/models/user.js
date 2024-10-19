const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    username: String,
    role: String,
    profilePicture:  {
        type: String, // Update media type to String
        required: false,
        default: null
    },
    resetPasswordOtp: { type: String }, // Field to store the OTP
    resetPasswordExpires: { type: Date }, // Field to store the expiration time  
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
