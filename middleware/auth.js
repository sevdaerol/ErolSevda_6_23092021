const jwt = require('jsonwebtoken');  //importee jsonwebtoken
require('dotenv').config();

module.exports = (req, res, next) => {  //middleware pour proteger les routes selectionnee
  try {
    const token = req.headers.authorization.split(' ')[1]; //split pour recuperer tout apres l'espace = deuxieme element du token
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN); //verify pour decoder notre token
    const userId = decodedToken.userId;  //extraiare ID utilisateur de notre token 
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    } 
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};

//terminer