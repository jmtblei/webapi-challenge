const express = require('express');
const router = express.Router();
const actionsDb = require('../data/helpers/actionModel');

router.get('/', (req, res) => {
    actionsDb.get()
    .then(response => {
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({ error:err, message: `Actions cannot be retrieved` });
    })
});

router.get("/:id", (req, res) => {
    const actionId = req.params.id;
    actionsDb.get(actionId)
    .then(response => {
        console.log(response)
        if (response) {
            res.status(200).json(response);
        } else {    
            res.status(404).json({ message: "The action with specified ID was not found" });
        }
    })
    .catch(err => {
      res.status(500).json({ error: err, message: "There was an error trying to find the action." });
    })
});

router.post("/", (req, res) => {
    const action = req.body;
    if (action.project_id && action.description && action.notes) {
        actionsDb.insert(action)
        .then(response => {
            res.status(200).json({ response, message: "New Action was succesfuly created"});
        })
        .catch(err => {
            res.status(500).json({ error: err, message: "There was an error trying to create a new action"});
        })
    } else {
        res.status(400).json({ errorMessage: "Please provide project_id, description and notes for action." });
    };
});

router.put("/:id", (req, res) => {
    const actionId = req.params.id;
    const update = req.body;
    if (update) {
        actionsDb.update(actionId, update)
        .then(response => {
            if (response) {
                res.status(200).json({ response, message: `Action has been updated` });
            } else {
                res.status(404).json({ message: "The action with specified ID was not found" });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err, message: "The action information cannot be modified."});
        })
    } else if (!update) {
        res.status(400).json({ errorMessage:"Please provide updates for the action." })
    }
});

router.delete("/:id", (req, res) => {
    const actionId = req.params.id;
    actionsDb.remove(actionId)
    .then(response => {
        if (response) {
            res.status(200).json({ response, message: "Action deleted!" });
        } else {
            res.status(404).json({ message: "The action with specified ID was not found" });
        }
    })
    .catch(err => {
      res.status(500).json({
        message: "There was an error trying to delete the action from the database."});
    })
});  

module.exports = router; 