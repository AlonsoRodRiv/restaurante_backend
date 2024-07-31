import { UserData } from '../interfaces/UserData';
import { Request, Response } from 'express';
import { auth, db } from '../config/firebase';
import bcrypt from 'bcrypt';
export const registro = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const userRecord = await auth.createUser({ email, password });

        await db.collection('usuarios').doc(userRecord.uid).set({
            email,
            password: hashedPassword, // Guardar la contraseña encriptada
            role: 'USER',
        });
        await auth.setCustomUserClaims(userRecord.uid, { role: 'USER' });
        res.status(201).json({ message: 'Usuario Creado', uid: userRecord.uid });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const userCredential = await auth.getUserByEmail(email);
        const userDoc = await db.collection('usuarios').doc(userCredential.uid).get();

        if (!userDoc.exists) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        const userData = userDoc.data() as UserData;

        if (!userData || !userData.role) {
            res.status(500).json({ error: 'Error al obtener el rol del usuario' });
            return;
        }

        // Verifica que el email en el token coincida con el de la base de datos
        if (userData.email !== email) {
            res.status(401).json({ error: 'Email no coincide con los registros' });
            return;
        }

        // Verifica la contraseña (asumiendo que está hasheada en la base de datos)
        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Contraseña incorrecta' });
            return;
        }
        const additionalClaims = {
            role: userData.role,
        };
        const customToken = await auth.createCustomToken(userCredential.uid, additionalClaims);
        res.json({ customToken });
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Credenciales Inválidas' });
    }
};
// export const login = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { idToken } = req.body;

//         // Verifica el idToken
//         const decodedToken = await auth.verifyIdToken(idToken);
//         const { uid, email } = decodedToken;
//         console.log('tokenDecoded: ', decodedToken);
//         // Verifica si el usuario existe en tu base de datos
//         const userDoc = await db.collection('usuarios').doc(uid).get();
//         if (!userDoc.exists) {
//             res.status(404).json({ error: 'Usuario no encontrado en la base de datos' });
//             return;
//         }

//         const userData = userDoc.data() as UserData;
//         if (!userData || !userData.role) {
//             res.status(500).json({ error: 'Error al obtener el rol del usuario' });
//             return;
//         }

//         // Verifica que el email en el token coincida con el de la base de datos
//         if (userData.email !== email) {
//             res.status(401).json({ error: 'Email no coincide con los registros' });
//             return;
//         }

//         // Actualiza los claims si es necesario
//         await auth.setCustomUserClaims(uid, { role: userData.role });

//         // Login exitoso
//         res.json({ message: 'Login exitoso', role: userData.role });
//     } catch (error) {
//         console.error(error);
//         res.status(401).json({ error: 'Credenciales Inválidas' });
//     }
// };
