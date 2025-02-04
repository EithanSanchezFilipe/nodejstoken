import express from 'express';
import jwt from 'jsonwebtoken';
import { privateKey } from './private_key.mjs';
// Il manque l'import du module jwt

import { connectToDatabase } from '../utils/dbUtils.mjs';
const router = express.Router();

// Middleware pour la connexion à la base de données
const connectToDatabaseMiddleware = async (req, res, next) => {
  try {
    req.dbConnection = await connectToDatabase();
    next();
  } catch (error) {
    console.error('Error connecting to the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

router.post('/', connectToDatabaseMiddleware, async (req, res) => {
  const { username, password } = req.body;

  const queryString =
    'SELECT * FROM t_users WHERE useName = ? AND usePassword = ?';

  try {
    const [rows] = await req.dbConnection.execute(queryString, [
      username,
      password,
    ]);
    if (rows.length > 0) {
      const { useName, usePassword } = rows[0];
      if (usePassword === password) {
        const token = jwt.sign({ username: useName }, privateKey, {
          expiresIn: '1h',
        });
        const message = `L'utilisateur a été connecté avec succès`;
        return res.json({ message, token });
      }
      // signer et renvoyer votre token ici (utiliser un code http de succès)

      res.status(401).json({ error: 'Renvoi du token pas implémenté' });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
