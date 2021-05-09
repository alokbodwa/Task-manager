const express = require('express');
require('./db/mongoose')
const userRouter = require('./Routes/user')
const taskRouter = require('./Routes/task')

const app = express()
const port = process.env.PORT 


// file uploads
// const multer = require('multer')
// const upload = multer({
//     // dest: destination
//     dest: 'images',
//     limits: {
//         fileSize: 1000000  // in kbs - 10^6 kb = 1 mb
//     },
//     fileFilter(req, file, cb){
//         // regular expression..... in lecture - 124
//         // / /\.(doc|docx)$/ - will check if the file type is doc or docx or not
//         if( !file.originalname.match(/\.(doc|docx)$/) ) {
//             return cb(new Error('File must be a doc'))
//         }
//         // if( !file.originalname.endsWith('.pdf') ) {
//         //     return cb(new Error('File must be a pdf'))
//         // }

//         // Everything goes well
//         cb(undefined, true)

//         // cb(new Error('File must be a pdf'))
//         // cb(undefined, true)
//         // cb(undefined, false)
//     }
// })


// // upload.single('upload') - upload(inside the '' ), is the key in postmen(body)
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// })

// const errorMiddleware = (req, res, next) => {
//     throw new Error('from error middleware')
// }
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })



// Middleware
// Middleware can block a particular request
// app.use((req, res, next) => {
//     // console.log(req.method, req.path)
//     // next()
//     if(req.method === 'GET'){
//         res.send('Get requests are disabled')
//     }
//     else{
//         next()
//     }
// })

// Site under maintainance
// app.use((req, res, next) => {
//     res.status(503).send('Site Under maintainace, We will be online shortly')
// })

// Automatically parses the json data to accessible objects
app.use(express.json())

app.use(userRouter)
app.use(taskRouter)


// Using routers
// const router = new express.Router()

// router.get('/test', (req, res) => {
//     res.send('This is from my router')
// })
// app.use(router)


app.listen(port, () => {
    console.log('App running on port '+ port)
})


// Bcypt demo

// const bcrypt = require('bcrypt')

// const myfunction = async () => {
//     const password = 'Alok20002020'
//     const hashedPassword = await bcrypt.hash(password, 8)

//     console.log(password)
//     console.log(hashedPassword)

//     // matching the plain and hashed password
//     const isMatch = await bcrypt.compare('alok20002020', hashedPassword)
//     console.log(isMatch)
// }

// myfunction()


// jwt demo
// const jwt = require('jsonwebtoken')

// const myfunction = async () => {
//     const token = jwt.sign({ _id: 'abc123' }, 'This is JWT', { expiresIn: '7 days'} )
//     console.log(token)
//     const data = jwt.verify(token, 'This is JWT')
//     console.log(data)
// }

// myfunction()



// toJSON working
// const intro = {
//     name: "Alok",
//     age: 20
// }

// // console.log(intro);

// intro.toJSON = function () {
//     console.log(this)
//     return this
// }
// // toJSON is called everytime the stringify is called.
// console.log(JSON.stringify(intro));


// finding owner using the task id
// const Task = require('./models/taskModel')

// const main = async() => {
//     const task = await Task.findById('6085287e43dd501e541f5329')
//     // console.log(task)
//     await task.populate('owner').execPopulate()
//     console.log(task.owner)
    
// }

// main()


// finding task using owner id
// const User = require('./models/user')
// const main = async() => {
//     const user = await User.findById('608455483a333a4594492cc9')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()











