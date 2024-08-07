import mongoose, { Document, Schema } from 'mongoose';

interface Recipient extends Document{
<<<<<<< HEAD
    recipientName: string;
=======
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
    email: string,
    achievedCertifications: mongoose.Schema.Types.ObjectId[];
}

const recipientSchema = new Schema<Recipient>({
<<<<<<< HEAD
    recipientName: {
        type: String,
        required: true
    },
=======
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
    email: {
        type: String,
        required: true,
        unique: true
    },
    achievedCertifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'certification'
    }]
},
{timestamps: true}
);

const RecipientModel = mongoose.model<Recipient>('recipient', recipientSchema);

export { RecipientModel, Recipient };
