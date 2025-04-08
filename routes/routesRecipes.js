import express from 'express';
import controllerRecipe from '../controllers/controllerRecipes.js';
import { validateToken } from '../helpers/authentication.js';

const route = express.Router();

route.get('/', controllerRecipe.getAll);
route.get('/:id', controllerRecipe.getOne);
route.post('/', validateToken, controllerRecipe.create);
route.put('/:id', validateToken, controllerRecipe.update);
route.delete('/:id', validateToken, controllerRecipe.delete);

export default route;
