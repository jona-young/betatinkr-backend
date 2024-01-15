const Trainingplans = require('../models/trainingplans.js')

// GET - retrieve all training plans
module.exports.get_all_trainingplans = (req, res) => {
    Trainingplans.find()
    .then((result) => {
        res.status(200).send(result)
    })
    .catch((err) => {
        res.status(err)
    })
}

// GET - retrieve all user training plans
module.exports.get_user_trainingplans = (req, res) => {
    res.status(200).send(['user training plan 1', 'user training plan 2'])
}

// GET - retrieve individual training plans based off :id
module.exports.get_trainingplan = (req, res) => {
    const id = req.params.id;

    Trainingplans.findById(id)
    .then((result) => {
        res.status(200).send(result)
    })
    .catch((err) => {
        res.status(err)
    })
}

// POST - create a training plan
module.exports.post_trainingplan = (req, res) => {
    const body = req.body

    let trainingplan = new Trainingplans(body)
    trainingplan.save()
    .then((result) => {
        res.status(200).send(result)
    })
    .catch((err) => {
        console.log(err)
        res.status(400).send({ result: 'There was an issue saving your training plan.'})
    })
}
// PUT - update training plan
module.exports.put_trainingplan = (req, res) => {
    const id = req.params.id;
    const body = req.body;

    Trainingplans.findByIdAndUpdate(id, body)
    .then((result) => {
        res.status(200).send(result)
    })
    .catch((err) => {
        res.status(err)
    })
}

// DELETE - delete training plan
module.exports.delete_trainingplan = (req, res) => {
    const id = req.params.id;
    
    Trainingplans.findByIdAndDelete(id)
    .then((result) => {
        res.status(200).send(result)
    })
    .catch((err) => {
        res.status(err)
    })
}