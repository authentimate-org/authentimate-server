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

interface premadeTemplate {
    texts: text[];
    recipientName: text;
    graphicElements: graphicElement[];
    bgColor: String;
    templateImageURL: String;
};

const premadeTemplateSchema = new Schema<premadeTemplate & Document>({
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
    templateImageURL: {
        type: String,
        required: true
    }
});

const premadeTemplateModel = mongoose.model<premadeTemplate & Document>('premadeTemplate', premadeTemplateSchema);

export { premadeTemplate, premadeTemplateModel };
