const express = require('express');

const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn); //this middleware is used to check if the user is logged in or not and then set the user object in the request object

router.get('/', viewsController.getOverview);

router.get('/tour/:slug', authController.protect, viewsController.getTour);

router.get('/login', viewsController.getLoginForm);

module.exports = router;
