const express = require('express');
// eslint-disable-next-line import/no-useless-path-segments
const userController = require('./../controllers/userController');
// eslint-disable-next-line import/no-useless-path-segments
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
