import { Request, Response, NextFunction } from 'express';
<<<<<<< HEAD:src/middleware/emailValidator.middleware.ts
import admin from 'firebase-admin'
import { verifyToken } from '../middleware/auth.middleware'
import { IssuerModel, Issuer } from '../models/issuer.model'
=======
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73:src/middlewares/emailValidator.middleware.ts

import { publicEmailDomains } from '../constants/publicEmails';('../constants/publicEmails');
const businessEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

<<<<<<< HEAD:src/middleware/emailValidator.middleware.ts
async function emailValidatorMiddleware(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
=======
export const emailValidator = async (email: string): Promise<string> => {
    try{
        if (!email) return 'Email is required';
    
        if (!businessEmailPattern.test(email)) return 'Invalid email format';
    
        const emailDomain = email.split('@')[1];
    
        if (!publicEmailDomains.includes(emailDomain)) return 'Email must be a business email';

        return 'Valid email';
    } catch (error) {
        return 'Invalid email address';
    }
};

async function emailValidatorMiddleware(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    const endPoint = req.originalUrl;
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73:src/middlewares/emailValidator.middleware.ts

    try{
        if (!email) {
            return res.status(400).json({ error: 'Business email is required' });
        }
    
        if (!businessEmailPattern.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
    
        const emailDomain = email.split('@')[1];
    
        if (!publicEmailDomains.includes(emailDomain)) {
            return res.status(400).json({ error: 'Email must be a business email' });
        }
    
        next();
    } catch (error) {
<<<<<<< HEAD:src/middleware/emailValidator.middleware.ts
        res.status(400).json({ error: error });
=======
        console.log('----------Error in emailValidatorMiddleware--------');
        console.log(`Error: ${error}`);
        return res.status(400).json({ error: 'Invalid email address'});
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73:src/middlewares/emailValidator.middleware.ts
      }
};

export default emailValidatorMiddleware;
