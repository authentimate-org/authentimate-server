import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin'
import { verifyToken } from '../middleware/auth.middleware'
import { IssuerModel, Issuer } from '../models/issuer.model'

import { publicEmailDomains } from '../constants/publicEmails';('../constants/publicEmails');
const businessEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

async function emailValidatorMiddleware(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;

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
        res.status(400).json({ error: error });
      }
};

export default emailValidatorMiddleware;
