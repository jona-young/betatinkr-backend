const Trainingplans = require('../models/trainingplans.js')
const { handleTrainingPlanErrors } = require('../helpers/handleErrors.js')


// GET - retrieve all training plans
module.exports.get_all_trainingplans = (req, res) => {
    Trainingplans.find()
    .then((result) => {
        res.status(200).json(result)
    })
    .catch((err) => {
        res.status(err)
    })
}

// GET - retrieve all user training plans
module.exports.get_user_trainingplans = (req, res) => {
    const uid = req.auth.uid

    Trainingplans.find({ author: uid })
    .then((result) => {
        res.status(200).send(result)
    }).catch((err) => {
        res.status(err)
    })
}

// POST - create a training plan
module.exports.post_trainingplan = (req, res) => {
    const body = req.body
    const uid = req.auth.uid

    // implement author binding off user submission
    body.author=uid

    let trainingplan = new Trainingplans(body)
    trainingplan.save()
    .then((result) => {
        res.status(200).send(result)
    })
    .catch((err) => {
        const errors = handleTrainingPlanErrors(err)

        console.log(errors)
        res.status(400).json({ errors });
    })
}
// PUT - update training plan
module.exports.put_trainingplan = (req, res) => {
    const id = req.params.id;
    const body = req.body;

    Trainingplans.findByIdAndUpdate(id, body, {new: true})
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
    const uid = req.auth.uid

    Trainingplans.findByIdAndDelete(id)
    .then(() => {
        Trainingplans.find({ author: uid })
        .then((result) => {
            res.status(200).send(result)
        }).catch((err) => {
            res.status(err)
        })
    })
    .catch((err) => {
        res.status(err)
    })
}