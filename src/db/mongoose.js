const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email:{
//         type: String,
//         require: true,
//         trim: true,
//         lowercase: true,
//         validate(value) {
//             if (!validator.isEmail(value)) {
//                 throw new Error ('invalid Email');
//             }
//         }
//     },
//     password:{
//         type: String,
//         require: true,
//         trim : true,
//         minlength: 7,
//         validate(value) {
//             // if(value.length <= 6){
//             //     throw new Error('password length must be greater than 6')
//             // }
//             if(value.toLowerCase().includes('password')){
//                 throw new Error('Please put something unique. Donot use password for password');
//             }
//         }
//     },
//     age: {
//         type: Number,
//         validate(value) {
//             // No validator used
//             if(value < 0) {
//                 throw new Error('Age must be a number')
//             }
//         },
//         default: 18
//     }
// })

// const me = new User({
//     name: 'Raman Kumar ',
//     email: 'Ramankishdgf@gbsd.in',
//     password: 'passwordvd'
// })

// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log('Error!!', error)
// })

// mongodb://127.0.0.1:27017/task-manager-api
// task-manager-api - name of the database

// mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// })


// const task = mongoose.model('task',{
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     Completed: {
//         type: Boolean,
//         default: false
//     }
// })

// const myTask = new task({
//     description: '     Fluids assignment',
// })

// myTask.save().then(() => {
//     console.log(myTask);
// }).catch((error) => {
//     console.log('error! ', error);
// })