const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const router = Router();
const User = require('../models/User');
const dotenv = require('dotenv');
const Auth = require('../middleware/Auth');

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
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      let err = errors.array();
      return res.status(422).json({ message: err[0].msg });
    }

    try {
      const { name, username, password } = req.body;
      if (!name || !username || !password)
        return res
          .status(404)
          .send({ message: 'invalid credentails', status: 404 });
      const user1 = await User.findOne({ username: username });
      console.log(user1)
      if (user1)
        return res.status(409).send({ message: 'username already exists' });
      const user = new User({ name, username, password });
      const token = await user.genrateToken();
      res.status(201).json(user);
    } catch (err) {
      if (err) res.status(500).send('server error');
      console.log(err);
    }
  }
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
  async (req, res) => {
    try {
      const { name, username } = req.body;
      if (!name || !username)
        return res.status(200).send({ message: 'invalid credentails', status: 500 });
      const user = req.user;
      const update = await User.findByIdAndUpdate(
        { _id: user._id },
        { name: name, username: username },
        { new: true }
      );
      if(update ) res.status(200).send({message:"user updated"})
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
);

router.get('/read', Auth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (err) {
    if (err) res.status(500).send({ message: 'server error', status: 500 });
  }
});
 
router.get("/all", async (req,res)=>{
    const user = await User.find( { })
    res.json(user)
})

router.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOneAndDelete({ _id: id });
    if (!user)
      return res.status(404).send({ message: 'user not found', status: 404 });
    res.status(200).send({ user, message:"user deleted" });
  } catch (err) {
    console.log(err);
    if (err) res.status(500).send('server error');
    throw err;
  }
});

module.exports = router;
