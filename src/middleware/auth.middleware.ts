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
      issuerId?: string;
    }
  }
}

export async function verifyToken(idToken: string): Promise<DecodedIdToken> {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
}

interface RouteCheck {
  checkEmailVerified: boolean;
  checkOnboarding: boolean;
}

const routeChecks: { [key: string]: RouteCheck } = {
  '/api/v1/issuer/getUser': { checkEmailVerified: false, checkOnboarding: false },
  '/api/v1/issuer/onboarding': { checkEmailVerified: true, checkOnboarding: false },
  'default': { checkEmailVerified: true, checkOnboarding: true }, // General case
};


async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const Endpoint = req.originalUrl;

  const routeCheck = routeChecks[Endpoint] || routeChecks['default'];

  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).send('Unauthorized (no authorization header)');
  }

  const idToken = authorizationHeader.split(' ')[1];

  if (!idToken) {
    return res.status(401).send('Unauthorized (no token provided)');
  }

  try {
    const decodedToken = await verifyToken(idToken);
    req.user = decodedToken;

    if (routeCheck.checkEmailVerified) {
      const userRecord = await admin.auth().getUser(req.user.uid);
      if (!userRecord.emailVerified) {
        return res.status(401).send('Unauthorized (email not verified)');
      }
    }

    const issuer = await IssuerModel.findOne({ firebaseUid: decodedToken.uid }).exec() as Issuer;
    if (!issuer) {
      return res.status(401).send('Unauthorized (issuer not found)');
    }

    req.issuerId = issuer._id.toString();

    if (routeCheck.checkOnboarding && !issuer.onboarding) {
      return res.status(401).send("Unauthorized (you haven't done onboarding)");
    }

    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    return res.status(401).send('Unauthorized (invalid token)');
  }
}

export default authMiddleware;
