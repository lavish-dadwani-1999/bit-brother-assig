const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const router = Router();
const User = require('../models/User');
const dotenv = require('dotenv');
const Auth = require('../middleware/Auth');

dotenv.config({ path: '.env' });

module.exports = {
    get:{
        async create (req, res){
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
              if (user1)
                return res.status(409).send({ message: 'username already exists' });
              const user = new User({ name, username, password });
              const token = await user.genrateToken();
              res.status(201).json(user);
            } catch (err) {
              if (err) res.status(500).send('server error');
             
            }
          }
    }
    ,
    patch:{
        async update (req, res){
            try {
              const { name, username } = req.body;
              if (!name || !username)
                return res
                  .status(200)
                  .send({ message: 'invalid credentails', status: 500 });
              const user = req.user;
              const update = await User.findByIdAndUpdate(
                { _id: user._id },
                { name: name, username: username },
                { new: true }
              );
              if (update) res.status(200).send({ message: 'user updated' });
            } catch (err) {
              throw err;
            }
          }
    },
    get1:{
        async read (req, res){
            try {
              const user = req.user;
              res.status(200).json(user);
            } catch (err) {
              if (err) res.status(500).send({ message: 'server error', status: 500 });
            }
          }
    },
    delete1:{
        async del (req, res){
            try {
              const id = req.params.id;
              const user = await User.findOneAndDelete({ _id: id });
              if (!user)
                return res.status(404).send({ message: 'user not found', status: 404 });
              res.status(200).send({ user, message: 'user deleted' });
            } catch (err) {
             
              if (err) res.status(500).send('server error');
              throw err;
            }
          }
    }
}