const express = require('express');
// eslint-disable-next-line import/no-useless-path-segments
const userController = require('./../controllers/userController');
// eslint-disable-next-line import/no-useless-path-segments
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//protect all routes after this middleware
router.use(authController.protect); //because the middleware runs in sequence

router.patch(
  '/updateMyPassword',
  // authController.protect,
  authController.updatePassword,
);

router.get(
  '/me',
  // authController.protect, //proctect middleware will add the user to the request object
  userController.getMe,
  userController.getUser,
);
router.patch(
  '/updateMe',
  // authController.protect,
  userController.updateMe,
);
router.delete(
  '/deleteMe',
  // authController.protect,
  userController.deleteMe,
);

//admin only routes
router.use(authController.restrictTo('admin'));

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
