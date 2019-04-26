const express = require('express');

const projectDB = require('../data/helpers/projectModel.js');

const router = express.Router();

router.get('/', (req, res) => {
    projectDB.get(req.params.id)
        .then(projects => {
            res.status(200).json(projects);
        })
        .catch(err => {
            console.error('error', err);
            res.status(500).json({ error: "The project information could not be retrieved."})
        });
});

router.get('/:id', (req, res) => {
    projectDB.get(req.params.id)
        .then(projects => {
            if(projects.length > 0) {
                res.status(200).json(projects);                
            } else {
                res.status(400).json({ message: "The project with the specified ID could not be retrieved."})
            }
        }) 
        .catch(err => {
            console.error('error', err);
            res.status(500).json({ error: "The project ID could not be retrieved."})
        })
})

router.get('/:id/actions', (req, res) => {
    projectDB.getProjectActions(req.params.id)
        .then(projects => {
            res.status(200).json(projects)
        })
        .catch(err => {
            console.error('error', err);
            res.status(500).json({ error: "The project's actions could not be retrieved."})
        })
})

router.post('/', (req, res) => {
    const project = req.body;
    if(!project) {
        res.status(400).json({ message: "Please content for the project."})
    }
    projectDB.insert(project)
        .then(() => {
            projectDB.get()
            .then(project => {
                res.status(201).json(project);
            })
        })        
        .catch( err => {
            console.error('error', err);
            res.status(500).json({ error: "There was an error while saving the project to the Database."})
        })
})

router.delete('/:id', (req, res) => {
    const {id} = req.params;
    projectDB.remove(id)
        .then(count => {
            if(count) {
                res.status(204).end();
            } else {
                res.status(404).json({ message: "No project with this ID was found."})
            }            
        }) 
        .catch(err => res.status(500).json(err));
})

router.put('/:id', (req, res) => {
        projectDB.update(req.params.id, req.body)
            .then(project => {
                if (project) {
                    res.status(200).json(project)
                } else {
                    res.status(404).json({ message: "No project with this ID was found."})
                }               
            })
            .catch(err => res.status(500).json({ message: "Update Failed"}))
})

module.exports = router;