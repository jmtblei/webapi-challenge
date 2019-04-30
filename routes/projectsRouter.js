const express = require('express');
const router = express.Router();
const projectsDb = require('../data/helpers/projectModel');
const actionsDb = require('../data/helpers/actionModel');

router.get("/", (req, res) => {
    projectsDb.get()
    .then(response => {
        res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({ error: err, message: "Projects cannot be retrieved" });
    })
});

router.get("/:id", (req, res) => {
    const projectId = req.params.id;
    projectsDb.get(projectId)
    .then(response => {
        if (!response) {
          res.status(404).json({ message: "The project with specified ID was not found" });
        } else {
          res.status(200).json(response);
        }
    })
    .catch(err => {
      res.status(500).json({ error: err, message: "There was an error trying to find the project." });
    })
});

router.post("/",  (req, res) => {
    const project = req.body;
    if (project.description && project.name) {
        projectsDb.insert(project)
        .then(response => {
            res.status(200).json({ response, message: "New project was succesfuly created"});
        })
        .catch(err => {
            res.status(500).json({ error: err, message: "There was an error trying to create a new project"});
        })
    } else {
        res.status(400).json({ errorMessage: "Please provide description and name for project." });
    };
});

router.delete("/:id", (req, res) => {
    const projectId = req.params.id;
    projectsDb.remove(projectId)
    .then(response => {
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ message: "The project with specified ID was not found" });
        }
    })
    .catch(err => {
      res.status(500).json({
        message: "There was an error trying to delete the project from the database."});
    })
});

router.put("/:id", (req, res) => {
    const projectId = req.params.id;
    const update = req.body;
    if (update.name || update.description) {
        projectsDb.update(projectId, update)
        .then(response => {
            if (response) {
                res.status(200).json({ response, message: `project has been updated` });
            } else {
                res.status(404).json({ message: "The project with specified ID was not found" });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err, message: "The project information cannot be modified."});
        })
    } else if (!update.name || update.description) {
        res.status(400).json({ errorMessage:"Please update description and/or name for the project." })
    }
});

router.get('/:projectId/actions', (req, res) => {
    const { projectId } = req.params;
    projectsDb.getProjectActions(projectId)
    .then(response => {
      if (response.length === 0) {
        res.status(404).json({ error: "The action with specified project ID could not be found" });
      } else {
        res.status(200).json(response);
      }
    })
    .catch(err =>
      res.status(500).json({ error: err, message: "There was an error trying to retreive the actions for the provided project" })
    );
}); 

module.exports = router; 