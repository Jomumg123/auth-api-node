const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const productController = require('../controllers/productController');

const { body, validationResult } = require('express-validator');


// Crear producto → solo admin
router.post(
    '/',
    verifyToken,
    checkRole('admin'),
    [
        body('name').notEmpty().withMessage('El nombre es obligatorio'),
        body('price').isNumeric().withMessage('El precio debe ser numérico')
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    productController.createProduct
);


// Listar productos → cualquier usuario autenticado
router.get(
    '/',
    verifyToken,
    productController.getProducts
);

// Actualizar producto → admin
router.put(
    '/:id',
    verifyToken,
    checkRole('admin'),
    productController.updateProduct
);

// Eliminar producto → admin
router.delete(
    '/:id',
    verifyToken,
    checkRole('admin'),
    productController.deleteProduct
);

module.exports = router;
