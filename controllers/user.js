const bcrypt = require('bcrypt'); //importer bcrypt

const User = require('../models/User');

const jwt = require('jsonwebtoken'); //importer package pour l'authentification de tokens

require('dotenv').config()

//fonction d'inscription
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //saler le mdp 10fois avec la fonction pour hacher le mdp
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'User added!' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

//fonction de conexion
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Not found user!' });
      }
      bcrypt.compare(req.body.password, user.password)  //comparer' le mdp saisie avec le hash enregistree dans user
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Password incorrect!' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign( //sign pour encoder un nouveaux token
                { userId: user._id },
                process.env.SECRET_TOKEN,
                { expiresIn: '72h' }  //duree de validitee de token = se reconnecter tout les 72h
              )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

//terminer