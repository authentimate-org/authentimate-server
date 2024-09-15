import mongoose, { Document, Schema } from 'mongoose';

interface Recipient extends Document{
    email: string,
    achievedCertifications: mongoose.Schema.Types.ObjectId[];
}

const recipientSchema = new Schema<Recipient>({
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
