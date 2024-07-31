import { db } from '../config/firebase';
import { Request, Response } from 'express';
import type { Sale } from '../models/Sale';

export const getSales = async (req: Request, res: Response) => {
    try {
        const salesSnapshot = await db.collection('sales').get();
        const sales = salesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        res.json({ sales });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las Ventas' });
    }
};

export const createSale = async (req: Request, res: Response) => {
    try {
        console.log('Venta recibida: ', req.body);
        const newSale: Sale = req.body;
        const saleRef = await db.collection('sales').add(newSale);
        res.status(201).json({ id: saleRef.id, ...newSale });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear Venta' });
    }
};
