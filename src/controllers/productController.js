const pool = require('../config/db');

// Crear producto (solo admin)
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;

        const result = await pool.query(
            'INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *',
            [name, description, price]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            message: 'Error al crear producto',
            error: error.message
        });
    }
};

// Listar productos (cualquiera autenticado)
exports.getProducts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
        res.json(result.rows);

    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener productos'
        });
    }
};

// Actualizar producto (admin)
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;

        const result = await pool.query(
            'UPDATE products SET name=$1, description=$2, price=$3 WHERE id=$4 RETURNING *',
            [name, description, price, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar'
        });
    }
};

// Eliminar producto (admin)
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM products WHERE id=$1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto eliminado' });

    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar'
        });
    }
};
