import mongoose, { Document, Schema } from 'mongoose';

interface recipient extends Document{
    recipientName: string;
    email: string,
    achievedCertifications: mongoose.Schema.Types.ObjectId[];
}

const recipientSchema = new Schema<recipient>({
    recipientName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    achievedCertifications: [{
        type: mongoose.Schema.Types.ObjectId,
    }]
},
{timestamps: true}
);

const recipientModel = mongoose.model<recipient>('recipient', recipientSchema);

export { recipientModel, recipient };
