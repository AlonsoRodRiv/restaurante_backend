import type { NextFunction, Response } from 'express';
import type { AuthenticatedRequest } from '../interfaces/AuthenticatedRequest';
import { auth } from '../config/firebase';

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }
    try {
        // Verifica el token personalizado
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error: any) {
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({ message: 'Token expirado' });
        }
        console.error('Error al verificar el token', error);
        return res.sendStatus(403);
    }

    // const token = req.headers.authorization?.split('Bearer ')[1];

    // if (!token) {
    //     return res.status(401).json({ message: 'Token no proporcionado' });
    // }
    // try {
    //     // Verifica el token personalizado
    //     const decodedToken = await auth.verifyIdToken(token);
    //     req.user = decodedToken;
    //     next();
    // } catch (error) {
    //     console.error('Error al verificar el token', error);
    //     return res.sendStatus(403);
    // }
};
