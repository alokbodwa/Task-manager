const mongoose = require('mongoose')
const validator = require('validator')
const bcypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./taskModel')
// mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// })

// you must define a userSchema to use middlewares in Mongoose

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 18,
        validate(value){
            if(value < 18){
                throw new Error('You must be 18 years or older to access this site')
            }
            else if(value < 0){
                throw new Error('I guess!!! You are next child of Elon')
            }
        }
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ('Please use email only')
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim : true,
        minlength: 7,
        validate(value) {
            if(value.length <= 6){
                throw new Error('password length must be greater than 6')
            }
            if(value.toLowerCase().includes('password')){
                throw new Error('Please put something unique. Donot use password for password');
            }
        }
    },
    // tokens is a array of various token object. Each different token can be used in for signing in to multiple devices using the same id and password
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

// virtual attributes - just a way for mongoose to figure out how two things relate
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id', // where the local data is stored
    foreignField: 'owner' // who is going to create the relationship. here, owner is creating the relationship
})



// statics function can be use anywhere from the User.function while methods can only be used after an instance of a User.
// statics can be use like this: User.staticfunction()
// while method need to be used like this:
// const user = new User
// user.method()
// User is a class and user is an instance of the class.
// userSchema.methods.generateAuthToken

userSchema.methods.generateAuthToken = async function() {
    const user = this

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
// /concatenating a token object to token array. 
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token

}

// whenever res.send would be called in routes, toJSON will automatically run and delete the password and tokens from them.
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    
    return userObject
}

// ToJSON is a easier way to do the same thing
// userSchema.methods.getPublicProfile = function () {
//     const user = this
//     const userObject = user.toObject()

// // Both appears same in console.log
//     // console.log(user)
//     // console.log(userObject)

//     delete userObject.password
//     delete userObject.tokens
    

//     return userObject
// }

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email: email })

    if(!user) {
        throw new Error('User not registered')
    }

    const isMatch = await bcypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Password did not matched')
    }

    return user
}

// hash the plain password
// pre - do something(here, save) before the event
// never use arrow function here
userSchema.pre('save',async function(next) {
    const user = this

    // console.log('just before saving ', user)
    // isModified is inbuilt and return true, when the password is either created or updated
    if(user.isModified('password')){
        user.password = await bcypt.hash(user.password, 8)

    }

    next()
})

userSchema.pre('remove', async function(next) {
    const user = this

    await Task.deleteMany({ owner: user._id })

    next()
})

// use "throw new Error" for generating a new error
// Updated - lect 104
const User = mongoose.model('User', userSchema)

module.exports = User

