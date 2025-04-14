import express from 'express';
import controllerComments from '../controllers/controllerComments.js';
import { validateToken } from '../helpers/authentication.js';

const route = express.Router();

// Ruta para obtener todos los comentarios de una receta
route.get('/recipe/:recipeId', controllerComments.getByRecipe);

// Ruta para crear un nuevo comentario (requiere autenticación)
route.post('/', validateToken, controllerComments.create);

// Ruta para eliminar un comentario (requiere autenticación)
route.delete('/:id', validateToken, controllerComments.delete);

export default route;
