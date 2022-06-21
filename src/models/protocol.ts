import { prop, Ref} from '@typegoose/typegoose';
import { Operator } from './operator';

export class Protocol {

    // @prop({type: () => mongoose.Types.ObjectId})
    // public protocolId!: string;  // mongoose will add _id field for us that we consider as  protocolId

    // @prop({ref: () =>  Operator})
    // public coordinator!: Ref<Operator>; // we refer to one operator(coordinator), he can add operator to session
    @prop({type: () => String, default: ''})
    public coordinator!: string;

    // @prop({ref: () =>  Operator})
    // public teamOperators!: Ref<Operator>[];
    @prop({type: () => String, default: []})
    public teamOperators!: string[];

    @prop({type: () => String, required: true})
    public protocolName!: string;

    @prop({type: () => Date, default:Date.now()})
    public createdDate?: Date

    // @prop({type: () => mongoose.Types.ObjectId, ref: 'Treatment'})   (its not clear what is the purpose of this field we wìll discuss it later)
    // public treatments!: Ref<Treatment>[];
    
}


// const ProtocolModel = getModelForClass(Protocol);

export default Protocol;