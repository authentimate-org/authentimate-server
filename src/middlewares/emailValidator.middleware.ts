import { Request, Response, NextFunction } from 'express';

import { publicEmailDomains } from '../constants/publicEmails';('../constants/publicEmails');
const businessEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
        console.log('----------Error in emailValidatorMiddleware--------');
        console.log(`Error: ${error}`);
        return res.status(400).json({ error: 'Invalid email address'});
      }
};

export default emailValidatorMiddleware;
