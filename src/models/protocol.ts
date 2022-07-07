import { ModelOptions, prop, Ref} from '@typegoose/typegoose';
import { Operator } from './operator';

@ModelOptions({ schemaOptions: { timestamps: true } })
export class Protocol {

    @prop({ref: () =>  Operator, type: () => String})
    public coordinator!: Ref<Operator>; // we refer to one operator(coordinator), he can add operator to session

    @prop({ref: () =>  Operator})
    public teamOperators!: Ref<Operator>[];

    @prop({type: () => String, required: true})
    public protocolName!: string;

    @prop({type: () => Date, default:Date.now()})
    public createdDate?: Date

    // @prop({type: () => mongoose.Types.ObjectId, ref: 'Treatment'})   (its not clear what is the purpose of this field we wìll discuss it later)
    // public treatments!: Ref<Treatment>[];
    
}

export default Protocol;