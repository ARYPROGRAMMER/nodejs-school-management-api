const express = require('express');
const router = express.Router();
const schoolsController = require('../controllers/schoolsController');

router.post('/addSchool', schoolsController.addSchool);
router.get('/listSchools', schoolsController.listSchools);
router.get('/all', schoolsController.getAllSchools);
router.get('/:id', schoolsController.getSchoolById);
router.patch('/:id/status', schoolsController.updateSchoolStatus);
router.delete('/:id', schoolsController.deleteSchool);

module.exports = router;