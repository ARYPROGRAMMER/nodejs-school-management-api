const express = require('express');
const router = express.Router();
const schoolsController = require('../controllers/schoolsController');

router.post('/addSchool', schoolsController.addSchool);
router.get('/listSchools', schoolsController.listSchools);
router.get('/all', schoolsController.getAllSchools);
router.patch('/:id/status', schoolsController.updateSchoolStatus);

module.exports = router;