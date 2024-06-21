import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase-admin';
import { IssuerModel, Issuer } from '../models/issuer.model';

interface DecodedIdToken {
  uid: string;
  [key: string]: any;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
      issuerId?: string; // Add issuerId to the Request interface
    }
  }
}

async function verifyToken(idToken: string): Promise<DecodedIdToken> {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
}

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).send('Unauthorized (no authorization header)');
  }
  // console.log('Authorization Header:', authorizationHeader);


  const idToken = authorizationHeader.split(' ')[1];

  if (!idToken) {
    return res.status(401).send('Unauthorized (no token provided)');
  }

  try {
    const decodedToken = await verifyToken(idToken);
    req.user = decodedToken;

    // Fetch the issuer from the database
    const issuer = await IssuerModel.findOne({ firebaseUid: decodedToken.uid }).exec() as Issuer;

    if (!issuer) {
      return res.status(401).send('Unauthorized (issuer not found)');
    }

    req.issuerId = issuer._id.toString(); // Add the issuerId to the request
    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    return res.status(401).send('Unauthorized (invalid token)');
  }
}

export default authMiddleware;
