import express from 'express';
import controllerUser from '../controllers/controllerUsers.js';
import { validateToken } from '../helpers/authentication.js';

const route = express.Router();

route.post('/register', controllerUser.register);
route.post('/login', controllerUser.login);
route.get('/profile', validateToken, controllerUser.profile);
route.put('/profile', validateToken, controllerUser.updateProfile);
route.delete('/profile', validateToken, controllerUser.deleteProfile);

export default route;
