import express from 'express';
import jwt from 'jsonwebtoken';
import { privateKey } from '../routes/private_key.mjs';
// Import du module jwt

const router = express.Router();

export const get = (req, res) => {
  // Remplacez cette portion de code par votre traitement du jeton JWT
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`;
    return res.status(401).json({ message });
  }
  const token = authorizationHeader.split(' ')[1];

  const decodedToken = jwt.verify(token, privateKey, (error, decodedToken) => {
    if (error) {
      const message = `L'utilisateur n'est pas autorisé à accéder à cette ressource.`;
      return res.status(401).json({ message, data: error });
    }
    const message = `bj pelo`;
    return res.status(200).json({ message, decodedToken });
  });
};

router.get('/', get);

export default router;
