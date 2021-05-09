const express = require('express')
const Task = require('../models/taskModel')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/tasks/test', (req, res) => {
    res.send('testing task routes')
})

router.post('/tasks', auth,  async (req, res) => {
    // res.send('Working')
    // const task = new Task(req.body)

    const task = new Task({
        ...req.body,  // it will simply copy everything from req.body to task
        owner: req.user._id
    })
    // console.log(task)

    try{
        await task.save()
        res.status(200).send(task)
    } catch(e) {
        res.status(400).send()
    }

    // task.save().then(() => {
    //     res.status(200).send(task)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })
    // console.log(req.body)
})


// filtering tasks with /tasks?completed=true/false
// paginating using /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt_asc or createdAt:des (_ or : both works)
router.get('/tasks', auth, async (req, res) => {
    // if no value of filter argument is provided, the url will be /tasks and return all tasks
    const match = {}

    if (req.query.completed){
        // req.query.completed is a string and needs to be converted to boolean value
        match.completed = (req.query.completed === 'true')
    }

    const sort = {}
    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = (parts[1] === 'desc' ? -1 : 1) // -1 for descending
    }

    // parseInt(val) - converts my string val to integer

    try{
        // const tasks = await Task.find({ owner: req.user._id })
        // res.status(200).send(tasks)

        // alternative
        // await req.user.populate('tasks').execPopulate()
        // let's not populate all the tasks and use some filters
        await req.user.populate({
            path:'tasks',
            match,
            // no need to write the completed argument, we have already manipulated it above
            // match:{
            //     completed: filterArg
            // }
            // limit - limits to x number of tasks to be fetched,
            // skip - skips first x tasks and returns the rest
            // try limit = 2, skip = 0 or skip = 2; you got different pages
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                // sort: {
                //     // createdAt: -1  // to be accessed as sort[createdAt]
                //     completed: -1  // -1 means completed tasks will be shown first
                // }
                sort
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks)

    } catch(err) {
        res.status(400).send()
    }

    // Task.find({}).then((tasks) => {
    //     res.status(200).send(tasks)
    // }).catch((error) => {
    //     res.status(500).send()
    // })
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try{
        // const task = await Task.findById(_id)

        const task = await Task.findOne({ _id, owner: req.user._id })
        // console.log(_id, req.user)

        if(!task) {
            res.status(404).send()
        }
        res.status(201).send(task)
    } catch(e) {
        res.status(400).send()
    }

    // Task.findById(_id).then((task) => {
    //     if(!task) {
    //         res.status(404).send()
    //     }
    //     res.status(201).send(task)
    // }).catch((error) => {
    //     res.status(500).send()
    // })
})

// updating the tasks
router.patch('/tasks/:id', auth, async(req, res) => {
    const updateList = ['completed', 'description']
    const updateRequested = Object.keys(req.body)

    const isvalidUpdate = updateRequested.every((update) => {
        return updateList.includes(update)
    })
    if(!isvalidUpdate){
        return res.status(400).send({ error: 'Update invalid!!!' })
    }
    const _id = req.params.id
    try{
        // const task = await Task.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })

        const task = await Task.findOne({ _id, owner: req.user._id })

        // const task = await Task.findById(id)
        // console.log(req)
        
        updateRequested.forEach((update) => {
            // console.log(req.body[update])
            task[update] = req.body[update]
        })
        await task.save()

        if(!task){
            return res.status(404).send()
        }
        
        res.status(200).send(task)
    } catch(e) {
        res.status(404).send()
    }

})

// deleting task
router.delete('/tasks/:id', auth, async(req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if(!task) {
            res.status(404).send()
        }
        res.status(200).send(task)
    } catch(e){
        res.status(500).send()
    }
})

module.exports = router