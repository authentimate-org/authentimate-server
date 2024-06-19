import mongoose, { Schema, Document } from 'mongoose';


interface position {
    x: number;
    y: number;
};

interface size {
    height: number;
    width: number;
};

interface text {
    content: String;
    position: position;
    color: String;
    fontFamily: String;
    fontSize: number;
    fontWeight: String;
};

interface graphicElement {
    svg: String;
    position: position;
    colors: { [key: string]: string };
    size: size;
}

interface modifiedTemplate {
    projectId: mongoose.Types.ObjectId | unknown,
    templateId: mongoose.Schema.Types.ObjectId,
    texts: text[];
    recipientName: text;
    graphicElements: graphicElement[];
    bgColor: String;
}

const modifiedTemplateSchema = new Schema<modifiedTemplate & Document>({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        required: true
    },
    templateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'premadeTemplate',
        required: true
    },
    texts: [{
        type: Schema.Types.Mixed,
        required: true
    }],
    recipientName: {
        type: Schema.Types.Mixed,
        required: true
    },
    graphicElements: [{
        type: Schema.Types.Mixed
    }],  
    bgColor: {
        type: String,
        required: true
    },
});

const modifiedTemplateModel = mongoose.model<modifiedTemplate & Document>('modifiedTemplate', modifiedTemplateSchema);

export { modifiedTemplate, modifiedTemplateModel };
