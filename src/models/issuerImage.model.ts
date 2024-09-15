import mongoose, { Schema, Document } from 'mongoose';

interface IssuerImage extends Document {
    issuerId: mongoose.Schema.Types.ObjectId;
    imageUrl: string;
}

const issuerImageSchema = new Schema<IssuerImage>({
  issuerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'issuer'
  },
  imageUrl: {
    type: String,
    required: true
  }
},
{ timestamps: true }
);

const IssuerImageModel = mongoose.model<IssuerImage>('issuerImage', issuerImageSchema);

export { IssuerImageModel, IssuerImage };