import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';
import saleRoutes from './routes/saleRoutes';

const app = express();
// Soporte para JSON y datos URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Soporte para CORS
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Corriendo en el puerto ${PORT}`);
});
