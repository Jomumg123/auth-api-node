require('dotenv').config();
const express = require('express');


const app = express();

const authRoutes = require('./routes/authRoutes');// recien agregada
const verifyToken = require('./middleware/authMiddleware');//recien agregada
const checkRole = require('./middleware/roleMiddleware');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');


app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando correctamente 🚀');
});
// recien agregada
app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor corriendo`);
});

app.use('/api/auth', authRoutes);
// recien agregada
app.get('/api/protected', verifyToken, (req, res) => {
    res.json({
        message: 'Ruta protegida',
        user: req.user
    });
});

app.get(
    '/api/admin',
    verifyToken,
    checkRole('admin'),
    (req, res) => {
        res.json({
            message: 'Bienvenido Admin 👑'
        });
    }
);
app.use('/api/products', productRoutes);

app.use(errorHandler);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
