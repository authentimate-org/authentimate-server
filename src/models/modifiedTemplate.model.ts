import mongoose, { Schema, Document } from 'mongoose';

interface Text {
    id: number;
    name: string;
    type: string;
    left?: number;
    top?: number;
    opacity?: number;
    width?: number;
    height?: number;
    rotate?: number;
    z_index?: number;
    padding?: number;
    font?: string;
    title: string;
    weight?: number;
    color: string;
};
  
interface GraphicElement {
    id: number;
    name: string;
    type: string;
    left?: number;
    top?: number;
    opacity?: number;
    width?: number;
    height?: number;
    rotate?: number;
    z_index?: number;
    color: string;
}
  
interface Image {
    id: number;
    name: string;
    type: string;
    left?: number;
    top?: number;
    opacity?: number;
    width?: number;
    height?: number;
    rotate?: number;
    z_index?: number;
    radius?: number;
    image: string;
}
  
interface ModifiedTemplate extends Document {
    projectId: mongoose.Schema.Types.ObjectId;
    issuerId: mongoose.Schema.Types.ObjectId;
    recipientName: Text;
    qrcode: GraphicElement;
    components: {
        graphicElements: GraphicElement[];
        images: Image[];
        texts: Text[];
    };
}
  
const textSchema = new Schema<Text>({
    id: Number,
    name: String,
    type: String,
    left: Number,
    top: Number,
    opacity: Number,
    width: Number,
    height: Number,
    rotate: Number,
    z_index: Number,
    padding: Number,
    font: String,
    title: String,
    weight: Number,
    color: String
});
  
const graphicElementSchema = new Schema<GraphicElement>({
    id: Number,
    name: String,
    type: String,
    left: Number,
    top: Number,
    opacity: Number,
    width: Number,
    height: Number,
    rotate: Number,
    z_index: Number,
    color: String
});
  
const imageSchema = new Schema<Image>({
    id: Number,
    name: String,
    type: String,
    left: Number,
    top: Number,
    opacity: Number,
    width: Number,
    height: Number,
    rotate: Number,
    z_index: Number,
    radius: Number,
    image: String
});
  
const modifiedTemplateSchema = new Schema<ModifiedTemplate>({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        required: true
    },
    issuerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'issuer',
        required: true
    },
    recipientName: {
        type: textSchema,
        required: true
    },
    qrcode: {
        type: graphicElementSchema,
        required: true
    },
    components: {
      graphicElements: [graphicElementSchema],
      images: [imageSchema],
      texts: [textSchema]
    }
}, { timestamps: true });

// interface position {
//     x: number;
//     y: number;
// };

// interface size {
//     height: number;
//     width: number;
// };

// interface text {
//     content: String;
//     position: position;
//     color: String;
//     fontFamily: String;
//     fontSize: number;
//     fontWeight: String;
// };

// interface graphicElement {
//     svg: String;
//     position: position;
//     colors: { [key: string]: string };
//     size: size;
// }

// interface ModifiedTemplate {
//     projectId: mongoose.Types.ObjectId | String,
//     templateId: mongoose.Schema.Types.ObjectId | unknown,
//     texts: text[];
//     recipientName: text;
//     graphicElements: graphicElement[];
//     bgColor: String;
// }

// const modifiedTemplateSchema = new Schema<ModifiedTemplate & Document>({
//     projectId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'project',
//         required: true
//     },
//     templateId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'premadeTemplate',
//         required: true
//     },
//     texts: [{
//         type: Schema.Types.Mixed
//         // required: true
//     }],
//     recipientName: {
//         type: Schema.Types.Mixed
//         // required: true
//     },
//     graphicElements: [{
//         type: Schema.Types.Mixed
//     }],  
//     bgColor: {
//         type: String,
//         // required: true
//     },
// });

const ModifiedTemplateModel = mongoose.model<ModifiedTemplate>('modifiedTemplate', modifiedTemplateSchema);

export { ModifiedTemplateModel, Text, GraphicElement, Image };
