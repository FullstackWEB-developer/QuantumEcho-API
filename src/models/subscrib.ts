import { ModelOptions, mongoose, prop, Ref} from '@typegoose/typegoose';
import Module from './module';
import Admin from './admin';

enum Typology {

    PUBLIC = 'Public',
    CUSTOM = 'Custom'
}

enum Status {
    PUBLISHED = 'Published',
    UNPUBLISHED = 'Unpublished'
}

@ModelOptions({ schemaOptions: { timestamps: true } })
export class Subscrib {

    // @prop()
    // public subscribId!: mongoose.Types.ObjectId; // mongoose will add _id field for us that we consider as  subscribId

    @prop({type: () => String, required: true})
    public coverImage!: string;

    @prop({type: () => String, required: true})
    public description!: string;

    @prop({type: () => String, required: true})
    public typology!: string;

    @prop({type: () => String, required: true})
    public status!: string;

    @prop({type: () => String, required: true, default: []})
    public roles! : string[]; 

    @prop({ref: () =>  Module})
    public features! : Ref<Module>;

    @prop({type: () => Number, required: true, default: 0})
    public monthlyPrice!: number;

    @prop({type: () => String, required: true})
    public termPeriod!: string;

    // @prop({type: () => Date, required: true}) // mongoose will generate the date of creation
    // public creationDate!: Date;

    @prop({ref: () =>  Admin, type: () => String}) // OperatorId is a reference to Operator in that way we can get the operator name
    public creator!: Ref<Admin>;

}

export default Subscrib;