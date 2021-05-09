const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, // type id hoga..... and we had provided it in user router
        required: true,
        ref: 'User'  // this User should be exact same as what we have written in user model
        // const User = mongoose.model('User'- This user, userSchema)

    }
}, {
    timestamps: true
})

// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     },
//     owner: {
//         type: mongoose.Schema.Types.ObjectId, // type id hoga..... and we had provided it in user router
//         required: true,
//         ref: 'User'  // this User should be exact same as what we have written in user model
//         // const User = mongoose.model('User'- This user, userSchema)

//     }
// })

const Task = mongoose.model('Task', taskSchema)

module.exports = Task