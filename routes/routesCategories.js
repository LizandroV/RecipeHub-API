import express from 'express';
import controllerCategory from '../controllers/controllerCategories.js';
import { validateToken } from '../helpers/authentication.js';

const route = express.Router();

route.get('/', controllerCategory.getAll);
route.get('/:id', controllerCategory.getOne);
route.post('/', validateToken, controllerCategory.create);
route.put('/:id', validateToken, controllerCategory.update);
route.delete('/:id', validateToken, controllerCategory.delete);

export default route;
