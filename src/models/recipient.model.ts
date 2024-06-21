import mongoose, { Document, Schema } from 'mongoose';

interface Recipient extends Document{
    recipientName: string;
    email: string,
    achievedCertifications: mongoose.Schema.Types.ObjectId[];
}

const recipientSchema = new Schema<Recipient>({
    recipientName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    achievedCertifications: [{
        type: mongoose.Schema.Types.ObjectId,
    }]
},
{timestamps: true}
);

const RecipientModel = mongoose.model<Recipient>('recipient', recipientSchema);

export { RecipientModel, Recipient };
