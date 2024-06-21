import { triggerAsyncId } from 'async_hooks';
import mongoose, { Document, Schema } from 'mongoose';

interface Issuer extends Document {
    issuerName: string;
    businessMail: string;
    firebaseUid: string;
    createdProjects: mongoose.Types.ObjectId[];
    _id: mongoose.Types.ObjectId; // Explicitly declare _id
}

const issuerSchema = new Schema<Issuer>({
    issuerName: {
        type: String,
        required: true // Ensure issuerName is required
    },
    firebaseUid: {
        type: String,
        required: true,
        unique: true // Ensure Firebase UID is unique
    },
    businessMail: {
        type: String,
        required: true,
        unique: true // Ensure business email is unique
    },
    createdProjects: [{
        type: Schema.Types.ObjectId,
        ref: 'project'
    }]
},
{timestamps: true}
);

const IssuerModel = mongoose.model<Issuer>('Issuer', issuerSchema);

export { IssuerModel, Issuer };
