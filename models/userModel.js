const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        required: [true, "Email cannot be blank"],
        unique: true
    },
    first_name: {
        type: String,
        lowercase: true,
        required:  [true, "first_name cannot be blank"]
    },
    last_name: {
        type: String,
        lowercase: true,
        required:  [true, "last_name cannot be blank"]
    },
    password: {
        type: String,
        minLength: 7,
        required: true
    },
    user_type: {
        type: String,
        default: "user",
        enum: ["admin", "user"],
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }
});





// PRE_HOOK

userSchema.pre(
    'save',
    async function (next) {
        const user = this;
        const hash = await bcrypt.hash(this.password, 10);

        this.password = hash;
        next();
    }
);

//Comparing Cridentials
userSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
}


const userModel = mongoose.model('users', userSchema)

module.exports = userModel;