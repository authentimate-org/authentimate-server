import { model, Schema, Document } from 'mongoose';

interface IUserImage extends Document {
  user_id: Schema.Types.ObjectId;
  image_url: string;
}

const userImageSchema = new Schema<IUserImage>({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "users"
  },
  image_url: {
    type: String,
    required: true
  }
}, { timestamps: true });

const UserImage = model<IUserImage>('user_images', userImageSchema);
export default UserImage;
export { IUserImage };
