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

interface ModifiedTemplate {
    projectId: mongoose.Types.ObjectId,
    templateId: mongoose.Schema.Types.ObjectId | unknown,
    texts: text[];
    recipientName: text;
    graphicElements: graphicElement[];
    bgColor: String;
}

const modifiedTemplateSchema = new Schema<ModifiedTemplate & Document>({
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

const ModifiedTemplateModel = mongoose.model<ModifiedTemplate & Document>('modifiedTemplate', modifiedTemplateSchema);

export { ModifiedTemplate, ModifiedTemplateModel };
