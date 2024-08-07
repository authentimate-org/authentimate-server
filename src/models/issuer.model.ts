import { triggerAsyncId } from 'async_hooks';
import mongoose, { Document, Schema } from 'mongoose';

interface Issuer extends Document {
    _id: mongoose.Types.ObjectId;
    firebaseUid: string;
    businessMail: string;
    createdProjects: mongoose.Types.ObjectId[];
<<<<<<< HEAD
=======
    totalCertifications: number;
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
    onboarding: boolean;
    category: 'COMPANY' | 'INSTITUTE' | 'INDIVIDUAL';
    companyName?: string;
    CIN?: string;
    instituteName?: string;
    issuerName?: string;
    designation?: string;
    address?: string;
}

const issuerSchema = new Schema<Issuer>({
    firebaseUid: {
        type: String,
        required: true,
        unique: true
    },
    businessMail: {
        type: String,
        required: true,
        unique: true
    },
    createdProjects: [{
        type: Schema.Types.ObjectId,
        ref: 'project'
    }],
<<<<<<< HEAD
=======
    totalCertifications: {
        type: Number,
        default: 0
    },
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
    onboarding: {
        type: Boolean,
        required: true,
        default: false
    },
    category: {
        type: String,
        enum: ['COMPANY', 'INSTITUTE', 'INDIVIDUAL'],
        required: function(this: Issuer) {
            return this.onboarding;
        }
    },
    companyName: {
        type: String,
        required: function(this: Issuer) {
            return this.category === 'COMPANY';
        }
    },
    CIN: {
        type: String,
        required: function(this: Issuer) {
            return this.category === 'COMPANY';
        }
    },
    instituteName: {
        type: String,
        required: function(this: Issuer) {
            return this.category === 'INSTITUTE';
        }
    },
    issuerName: {
        type: String,
        required: function(this: Issuer) {
            return this.category === 'INDIVIDUAL';
        }
    },
    designation: {
        type: String,
        required: function(this: Issuer) {
            return this.onboarding;
        }
    },
    address: {
        type: String,
        required: function(this: Issuer) {
            return this.onboarding;
        }
    }
},
{ timestamps: true }
);

issuerSchema.index({ firebaseUid: 1 }, { unique: true });

const IssuerModel = mongoose.model<Issuer>('Issuer', issuerSchema);

export { IssuerModel, Issuer };
