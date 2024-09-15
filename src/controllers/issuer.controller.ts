import { Request, Response } from 'express'
import mongoose from 'mongoose'
import admin from '../config/firebase-admin';
import firebaseApp from '../config/firebase-client';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, User as FirebaseUser } from 'firebase/auth';
import { IssuerModel, Issuer } from '../models/issuer.model'



const auth = getAuth(firebaseApp);

async function signInWithCustomToken(customToken: string): Promise<string> {
  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.VITE_FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: customToken, returnSecureToken: true })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.message);
    }

    return data.idToken;
  } catch (error) {
    console.log('--------Error in signInWithCustomToken---------');
    throw error;
  }
}

//SignUp
export const handleSignUp = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user as FirebaseUser;
    
    if (!user) {
      return res.status(400).json({ error: "Couldn't create user on fireabse." })
    }

    const customToken = await admin.auth().createCustomToken(user.uid);
    // const idToken = await signInWithCustomToken(customToken);

    if (!customToken) {
      await admin.auth().deleteUser(user.uid);
      return res.status(400).json({ error: "Couldn't create token." });
    }
 
    const newIssuer: Issuer = new IssuerModel({
      businessMail: email,
      firebaseUid: user.uid
    });

    const createdIssuer = await newIssuer.save();

    if (!createdIssuer) {
      await admin.auth().deleteUser(user.uid);
      return res.status(400).json({ error: "Couldn't create issuer on MongoDB." });
    }

    await sendEmailVerification(user);

    return res.status(201).json({ messsage: "Sign-up successful. Verification email sent.", token: customToken });
  } catch (error: any) {
    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-exists':
          return res.status(400).json({ error: 'The email address is already in use by another account.' });
        case 'auth/invalid-email':
          return res.status(400).json({ error: 'The email address is not valid.' });
        case 'auth/invalid-password':
          return res.status(400).json({ error: 'The password is not strong enough.' });
        case 'auth/operation-not-allowed':
          return res.status(400).json({ error: 'Operation not allowed. Please enable the email/password sign-in method in the Firebase Console.' });
        default:
          return res.status(500).json({ error: 'Internal server error (firebase error)', errorCode: error.code });
      }
    } else if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

//SignIn
export const handleSignIn = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try{
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const issuer = await IssuerModel.findOne({ businessMail: email }).exec();

    if(!issuer) {
      return res.status(404).json({ error: 'Issuer not found.' });
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user?.getIdToken();

    let message;

    if(!userCredential.user.emailVerified) {
      await sendEmailVerification(userCredential.user);
      message = "Email not verified. Verification email sent.";
    } else if(!issuer.onboarding) {
      message = "You haven't done onboarding.";
    } else message = "Sign-in successful.";

    return res.status(200).json({ message, token });
  } catch (error: any) {
    if (error.code) {
      return res.status(400).json({error: error.code});
    } else if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

//Read
export const handleGetIssuerById = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (user not found)' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.issuerId)) {
      return res.status(400).json({ error: 'Invalid issuer ID' });
    }

    const issuer = await IssuerModel.findById(req.issuerId).exec();

    if (!issuer) {
      return res.status(404).json({ error: 'Issuer not found' });
    }

    return res.status(200).json(issuer);
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

//Update
export const handleUpdateIssuerById = async (req: Request, res: Response): Promise<Response> => {
  const { issuerName } = req.body;

  try {
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (user not found)' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.issuerId)) {
      return res.status(400).json({ error: 'Invalid Issuer ID' });
    }

    const updatedIssuer = await IssuerModel.findByIdAndUpdate(
      req.issuerId,
      { 
        issuerName: issuerName
      },
      { new: true }
    ).exec();

    if (!updatedIssuer) {
      return res.status(404).json({ error: 'Issuer not found' });
    }

    return res.status(200).json(updatedIssuer);
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

//Check Onboarding Status
export const handleCheckOnboardingStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (user not found)' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.issuerId)) {
      return res.status(400).json({ error: 'Invalid Issuer ID' });
    }

    const issuer = await IssuerModel.findById(req.issuerId).exec();

    if (!issuer) {
      return res.status(404).json({ error: 'Issuer not found' });
    }

    return res.status(200).json({ status: issuer.onboarding });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

//Onboarding
export const handleDoOnboarding = async (req: Request, res: Response): Promise<Response> => {
  const { category, companyName, CIN, instituteName, issuerName, designation, address } = req.body;

  try {
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (user not found)' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.issuerId)) {
      return res.status(400).json({ error: 'Invalid Issuer ID' });
    }

    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    let isValid = true;

    if (category === 'INDIVIDUAL') {
      isValid = issuerName && designation && address;
    } else if (category === 'COMPANY') {
      isValid = issuerName && companyName && CIN && designation && address;
    } else if (category === 'INSTITUTE') {
      isValid = issuerName && instituteName && designation && address;
    } else {
      isValid = false;
    }

    if (!isValid) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const updatedIssuer = await IssuerModel.findByIdAndUpdate(
      req.issuerId,
      { 
        onboarding: true,
        category: category,
        companyName: companyName,
        CIN: CIN,
        instituteName: instituteName,
        issuerName: issuerName,
        designation: designation,
        address: address
      },
      { new: true }
    ).exec();

    if (!updatedIssuer) {
      return res.status(404).json({ error: 'Issuer not found' });
    }

    return res.status(200).json({ error: 'Issuer onboarded successfully.'});
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

//Delete
export const handleDeleteIssuerById = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (user not found)' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.issuerId)) {
      return res.status(400).json({ error: 'Invalid Issuer ID' });
    }

    const deletedIssuer = await IssuerModel.findByIdAndDelete(req.issuerId).exec();

    if (!deletedIssuer) {
      return res.status(404).json({ error: 'Issuer not found' });
    }

    await admin.auth().deleteUser(req.user.uid);

    return res.status(200).json({ message: 'Issuer deleted successfully' });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
