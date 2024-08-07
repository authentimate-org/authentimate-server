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
  crossMiddleware: boolean;
}

const routeChecks: { [key: string]: RouteCheck } = {
  '/api/v1/issuer/signUp': { checkEmailVerified: false, checkOnboarding: false, crossMiddleware: true },
  '/api/v1/issuer/signIn': { checkEmailVerified: false, checkOnboarding: false, crossMiddleware: true },
  '/api/v1/issuer/getUser': { checkEmailVerified: true, checkOnboarding: true, crossMiddleware: false },
  '/api/v1/issuer/onboarding': { checkEmailVerified: true, checkOnboarding: false, crossMiddleware: false },
  'default': { checkEmailVerified: true, checkOnboarding: true, crossMiddleware: false },
};


async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const endPoint = req.originalUrl;

  const routeCheck = routeChecks[endPoint] || routeChecks['default'];

  if(routeCheck.crossMiddleware) return next();

  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ error: 'Unauthorised (no authorization header)' });
  }

  const idToken = authorizationHeader.split(' ')[1];

  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorised (no token provided)' });
  }

  try {
    const decodedToken = await verifyToken(idToken);
    req.user = decodedToken;

    if (routeCheck.checkEmailVerified) {
      const userRecord = await admin.auth().getUser(req.user.uid);
      if (!userRecord.emailVerified) {
        return res.status(401).json({ error: 'Unauthorised (email not verified)' });
      }
    }

    const issuer = await IssuerModel.findOne({ firebaseUid: decodedToken.uid }).exec() as Issuer;

    if (!issuer) {
      return res.status(404).json({ error: 'Issuer not found' });
    }

    req.issuerId = issuer._id.toString();

    if (routeCheck.checkOnboarding && !issuer.onboarding) {
      return res.status(401).json({ error: "Unauthorised (you haven't done onboarding" });
    }

    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    return res.status(401).json({ error: 'Unauthorised (invalid token)' });
  }
}

export default authMiddleware;
