import { prop, Ref} from '@typegoose/typegoose';
import Module from './module';

enum Typology {

    PUBLIC = 'public',
    CUSTOM = 'custom'
}

enum Status {
    PUBLISHED = 'published',
    UNPUBLISHED = 'unpublished'
}

export class Subscrib {

    // @prop()
    // public subscribId!: mongoose.Types.ObjectId; // mongoose will add _id field for us that we consider as  subscribId

    @prop({type: () => String, required: true})
    public coverImage!: string;

    @prop({type: () => String, required: true})
    public description!: string;

    @prop({type: () => String, required: true, enum: Object.values(Typology)})
    public typology!: string;

    @prop({type: () => String, required: true, enum: Object.values(Status)})
    public status!: string;

    @prop({type: () => String, required: true, default: []})
    public roles! : string[]; 

    @prop({ref: () =>  Module})
    public features! : Ref<Module>

    @prop({type: () => Number, required: true, default: 0})
    public monthlyPrice!: number;

    @prop({type: () => String, required: true})
    public termPeriod!: string;

    // @prop({type: () => Date, required: true}) // mongoose will generate the date of creation
    // public creationDate!: Date;

    // @prop({ref: () =>  Operator}) // OperatorId is a reference to Operator in that way we can get the operator name
    @prop({type: () => String})
    public creator!: string;

}

export default Subscrib;