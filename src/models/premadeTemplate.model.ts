import mongoose, { Schema, Document } from 'mongoose';

interface Component {
    id: number;
    name: string;
    type: string;
    z_index: number;
    left?: number;
    top?: number;
    opacity?: number;
    rotate?: number;
    width?: number;
    height?: number;
    padding?: number;
    font?: string;
<<<<<<< HEAD
=======
    fontFamily?: string;
    lineHeight?: number;
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
    title?: string;
    weight?: number;
    color?: string;
    radius?: number;
    image?: string;
}
  
interface PremadeTemplate extends Document {
    recipientName: Component;
<<<<<<< HEAD
    qrcode: Component;
=======
    qrCode: Component;
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
    components: Component[];
    templateImageURL: string;
}
  
const componentSchema = new Schema<Component>({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    z_index: {
        type: Number,
        required: true
    },
    left: Number,
    top: Number,
    opacity: Number,
    rotate: Number,
    width: Number,
    height: Number,
    padding: Number,
    font: String,
<<<<<<< HEAD
=======
    fontFamily: String,
    lineHeight: Number,
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
    title: String,
    weight: Number,
    color: String,
    radius: Number,
    image: String
});
  
const premadeTemplateSchema = new Schema<PremadeTemplate>({
    recipientName: {
        type: componentSchema,
        required: true
    },
<<<<<<< HEAD
    qrcode: {
=======
    qrCode: {
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
        type: componentSchema,
        required: true
    },
    components: [componentSchema],
    templateImageURL: {
        type: String,
        required: true
    }
<<<<<<< HEAD
}, { timestamps: true });
=======
},
{ timestamps: true }
);
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73

const PremadeTemplateModel = mongoose.model<PremadeTemplate>('premadeTemplate', premadeTemplateSchema);

export { PremadeTemplateModel, Component };
