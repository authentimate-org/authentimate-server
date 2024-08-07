import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

<<<<<<< HEAD
interface Certification {
    issuerId: mongoose.Types.ObjectId | undefined;
    recipientId:mongoose.Types.ObjectId | undefined;
    projectId: mongoose.Types.ObjectId | unknown;
    imageURL: string | undefined;
=======
interface Certification extends Document{
    issuerId: mongoose.Types.ObjectId;
    recipientId: mongoose.Types.ObjectId | string;
    recipientName: string;
    projectId: mongoose.Types.ObjectId;
    certificationId: string;
    status: 'CERTIFICATION_CREATED' | 'SENDING_MAIL' | 'MAIL_SENT' | 'MAIL_NOT_SENT' | 'MAIL_NOT_DELIVERED';
    createdAt:Date;
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
}

const certificationSchema = new Schema<Certification>({
    issuerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'issuer',
        required: true
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recepient'
    },
    recipientName: {
        type: String,
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        required: true
    },
    certificationId: {
        type: String,
        default: () => uuidv4(),
        unique: true
    },
    status: {
        type: String,
        enum: ['CERTIFICATION_CREATED', 'SENDING_MAIL', 'MAIL_SENT' , 'MAIL_NOT_SENT', 'MAIL_NOT_DELIVERED'],
        default: 'CERTIFICATION_CREATED',
        required: true,
    }
},
{ timestamps: true }
);

const CertificationModel = mongoose.model<Certification>('certification', certificationSchema);
export { CertificationModel, Certification };
