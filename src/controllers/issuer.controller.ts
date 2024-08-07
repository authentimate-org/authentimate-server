import { Request, Response } from 'express'
import mongoose from 'mongoose'
import admin from '../config/firebase-admin';
import firebaseApp from '../config/firebase-client';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, User as FirebaseUser } from 'firebase/auth';
import { IssuerModel, Issuer } from '../models/issuer.model'
<<<<<<< HEAD


const auth = getAuth(firebaseApp);

async function signInWithCustomToken(customToken: string): Promise<string> {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.VITE_FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          token: customToken,
          returnSecureToken: true,
      }),
  });

  const data = await response.json();
  if (!response.ok) {
      throw new Error(data.error.message);
  }

  return data.idToken;
}

//SignUp
export const handleSignUp = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // const user = await admin.auth().createUser({
    //   email: email,
    //   password: password,
    // });

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user as FirebaseUser;

    // const user = await admin.auth().getUser(user.uid);
=======



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
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
    
    if (!user) {
      return res.status(400).json({ error: "Couldn't create user on fireabse." })
    }
<<<<<<< HEAD
    console.log(userCredential);
    console.log("-------------------------------------------");
    console.log(user);

    const customToken = await admin.auth().createCustomToken(user.uid);
    const idToken = await signInWithCustomToken(customToken);

    if (!customToken || !idToken) {
      await admin.auth().deleteUser(user.uid);
      return res.json({ error: "Couldn't create token." });
=======

    const customToken = await admin.auth().createCustomToken(user.uid);
    // const idToken = await signInWithCustomToken(customToken);

    if (!customToken) {
      await admin.auth().deleteUser(user.uid);
      return res.status(400).json({ error: "Couldn't create token." });
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
    }
 
    const newIssuer: Issuer = new IssuerModel({
      businessMail: email,
      firebaseUid: user.uid
    });

    const createdIssuer = await newIssuer.save();

    if (!createdIssuer) {
      await admin.auth().deleteUser(user.uid);
<<<<<<< HEAD
      return res.json({ error: "Couldn't create issuer on MongoDB." });
=======
      return res.status(400).json({ error: "Couldn't create issuer on MongoDB." });
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
    }

    await sendEmailVerification(user);

<<<<<<< HEAD
    // const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // console.log(userCredential);

    // await sendEmailVerification(userCredential.user);

    return res.status(201).json({ messsage: "Sign-up successful. Verification email sent.", token: idToken });
=======
    return res.status(201).json({ messsage: "Sign-up successful. Verification email sent.", token: customToken });
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
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
<<<<<<< HEAD
      return res.status(400).json({ error: 'Issuer not found.' });
=======
      return res.status(404).json({ error: 'Issuer not found.' });
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user?.getIdToken();

<<<<<<< HEAD
    let message_1, message_2;

    if(!userCredential.user.emailVerified) {
      await sendEmailVerification(userCredential.user);
      message_1 = "Email not verified. Verification email sent.";
    } else if(!issuer.onboarding) {
      message_2 = "You haven't done onboarding.";
    } else message_2 = "Sign-in successful.";

    return res.status(200).json({ message_1, message_2, token });
=======
    let message;

    if(!userCredential.user.emailVerified) {
      await sendEmailVerification(userCredential.user);
      message = "Email not verified. Verification email sent.";
    } else if(!issuer.onboarding) {
      message = "You haven't done onboarding.";
    } else message = "Sign-in successful.";

    return res.status(200).json({ message, token });
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
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

<<<<<<< HEAD
    return res.json(issuer);
=======
    return res.status(200).json(issuer);
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
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

<<<<<<< HEAD
    return res.json(updatedIssuer);
=======
    return res.status(200).json(updatedIssuer);
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
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

<<<<<<< HEAD
    return res.json({ status: issuer.onboarding });
=======
    return res.status(200).json({ status: issuer.onboarding });
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
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

<<<<<<< HEAD
    if (!(category && ((companyName && CIN) ^ instituteName ^ issuerName) && designation && address)) {
      return res.send('All fields are required');
=======
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
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
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

<<<<<<< HEAD
    return res.json(updatedIssuer);
=======
    return res.status(200).json({ error: 'Issuer onboarded successfully.'});
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
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

<<<<<<< HEAD
    return res.json({ message: 'Issuer deleted successfully' });
=======
    return res.status(200).json({ message: 'Issuer deleted successfully' });
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
