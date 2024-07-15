import mongoose, { Document, Schema } from 'mongoose';

interface Certification {
    issuerId: mongoose.Types.ObjectId | undefined;
    recipientId:mongoose.Types.ObjectId | undefined;
    projectId: mongoose.Types.ObjectId | unknown;
    imageURL: string | undefined;
}

const certificationSchema = new Schema<Certification>({
    issuerId: {
        type: Schema.Types.ObjectId,
        ref: 'issuer',
        required: true
    },
    recipientId: {
        type: Schema.Types.ObjectId,
        ref: 'recepient'
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'project',
        required: true
    },
    imageURL: {
        type: String,
        default: './public/certificates/<recipientId>.jpg'
    }
});

const CertificationModel = mongoose.model<Certification>('certification', certificationSchema);
export { CertificationModel, Certification };
