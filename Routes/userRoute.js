const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const router = Router();
const User = require('../models/User');
const dotenv = require('dotenv');
const Auth = require('../middleware/Auth');
const {get,get1,patch,delete1} = require("../controllers/userControllers")

dotenv.config({ path: '.env' });

router.post(
  '/create',
  [
    check('name')
      .not()
      .isEmpty()
      .trim()
      .escape()
      .isLength({ min: 5 })
      .withMessage('Name must have more than 5 characters'),
    check('username')
      .not()
      .isEmpty()
      .isLength({ min: 10 })
      .withMessage('Enter A Valid username'),
    check('password')
      .not()
      .isEmpty()
      .isLength({ min: 8 })
      .withMessage('Enter a Valid Password'),
  ],
  get.create
);

router.patch(
  '/update/:id',
  Auth,
  [
    check('name')
      .not()
      .isEmpty()
      .trim()
      .escape()
      .isLength({ min: 5 })
      .withMessage('Name must have more than 5 characters'),
    check('username')
      .not()
      .isEmpty()
      .isLength({ min: 10 })
      .withMessage('Enter A Valid username'),
  ],
 patch.update
);

router.get('/read', Auth,get1.read );

router.get('/all', async (req, res) => {
  const user = await User.find({});
  res.json(user);
});

router.delete('/delete/:id',Auth,delete1.del);

module.exports = router;
