const express = require('express')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancellationEmail } = require('../Emails/account')
const router = new express.Router()

// uploading profile pictures
const multer = require('multer')


router.get('/users/test', (req, res) => {
    res.send('Testing User routes')
})

// Only login and signup should be accessible to all the users. While the delete, update must need authentication. JWT lect- 106


router.post('/users', async (req, res) => {
    // res.send('User added for testing')
    const user = new User(req.body)

    // user.save().then(() => {
    //     res.status(200).send(user)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })

    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token }) // toJSON will be called now
    } catch(e){
        res.status(400).send()
    }

    // console.log(req.body)
})

router.post('/users/login', async(req, res) => {
    try{

        // FindByCredentials is not inbuilt. We have defined it in user models
        const user = await User.findByCredentials(req.body.email, req.body.password)


        // Generating Authentication token
        const token = await user.generateAuthToken()
        
        // User hashed password and token are of no use. So, let's remove them
        res.status(200).send({ user, token })
        // res.status(200).send({ user: user.getPublicProfile(), token })
    } catch(e){
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async(req, res) => {
    try{
        // req.user.tokens will now store only those tokens which are not passed with req
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send()
    } catch(e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async(req, res) => {
    try{
        req.user.tokens = [ ]
        await req.user.save()
        res.status(200).send()
    } catch(e){
        res.status(500).send()
    }
})

// Only if the auth middleware calls the next(), the callback function will be run
router.get('/users', auth, async (req, res) => {

    try{
        const users = await User.find({})
        res.status(200).send(users)
    } catch(e){
        res.status(400).send()
    }


    // User.find({}).then((users) => {
    //     res.send(users)
    // }).catch((error) => {
    //     res.status(500).send()
    // })
})

// Reading just mine account
router.get('/users/me', auth, async (req, res) => {
    // remember auth has put req.user = user
    res.send(req.user)

})

router.get('/users/:id', async (req, res) => {
    // url - localhost:3000/users/16353618mc  -- { id: '16353618mc' } prited
    // console.log(req.params)
    const id = req.params.id
    try{
        const user = await User.findById(id)
        if(!user){
            return res.status(404).send()
        }
        res.status(200).send(user)
    } catch(e){
        res.status(400).send()
    }

    // User.findById(id).then((user) => {
    //     if(!user) {
    //         return res.status(404).send()
    //     }
    //     res.send(user)
    // }).catch((error) => {
    //     res.status(500).send()
    // })
})

// Updating User
router.patch('/users/me', auth, async (req, res) => {

    const allowedUpdates = ['name', 'email', 'password', 'age']
    // console.log(req.body)
    const updates = Object.keys(req.body) // for {"name": "Ratan lal","email": "ratan@gmail.com","age": 34}  ----->>> returns [ 'name', 'email', 'age' ].   Whatever you will pass it will return just the keys(nnot the values)
    // console.log(updates)
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try{

        // findByIdAndUpdate takes data directly from database. and hence doesn't run out middlewares (like pre and post set in the mongoose)
        // That's why using something complex yet efficient code
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
        // new: true   ------- will create a new user with the data. i.e. overwrite

        // const user = await User.findById(req.user._id)

        updates.forEach((update) => {
            // This is how "user" looks in req and req.user returns this entire object. The key value pairs are to be accessed using req.user[age], returns 20
            // user: {
            //     age: 20,
            //     _id: 607bccc644627f10087f82f5,
            //     name: 'Ratan',
            //     email: 'alokbodwa@gmail.com',
            //     password: '$2b$08$2LvJchyI2HpodSZYJ0s6MOZEFwrL6fxqRacKhRtslDoEY.GLbOlKK',
            //     tokens: [ [Object], [Object], [Object] ],
            //     __v: 9
            //   },
            req.user[update] = req.body[update]
        })

        await req.user.save()

        // already authenticated that user exists
        // if(!user){
        //     return res.status(404).send()
        // }
        
        res.status(200).send(req.user)
    } catch(e) {
        res.status(404).send()
    }
})


// delete
router.delete('/users/me', auth, async (req, res) => {
    try{
        // /in auth, we have our user in req.user
        // const user = await User.findByIdAndDelete(req.user._id)

        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.status(200).send(req.user)
    } catch(e){
        res.status(500).send()
    }
})



const upload = multer({
    // dest: 'images/avatars',  // we need to add to our database and not the local storage
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file, cb) {
        if( !file.originalname.match(/\.(jpg|png|jpeg)/) ){
            return cb(new Error('invalid file format. Supported format- JPG, JPEG, PNG'))
        }
        cb(undefined, true)
    }
})
// upload.single('avatar') - avatar is to be used as key in postman
router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {

    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    
    req.user.avatar = buffer
    // req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


router.get('/users/:id/avatar', async(req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }
    catch(e){
        res.status(400).send()
    }
})



module.exports = router