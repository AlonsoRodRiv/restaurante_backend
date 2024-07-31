import { Request, Response } from 'express';
import { db } from '../config/firebase';
import type { Product } from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const productosSnapshot = await db.collection('productos').get();
        const productos = productosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        res.json({ productos });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};
export const createProduct = async (req: Request, res: Response) => {
    try {
        const newProducto: Product = req.body;
        const productoRef = await db.collection('productos').add(newProducto);
        res.status(201).json({ id: productoRef.id, ...newProducto });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear Producto' });
    }
};
