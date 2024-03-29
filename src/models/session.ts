import { prop, Ref, ModelOptions} from '@typegoose/typegoose';
import { Operator } from './operator';
import { Treatment } from './treatment';


class Interview {

    @prop({type: () => [String]})
    public repeptorImages?: string[];

    @prop({type: () => String})
    motherNameOrRelativeName?: string;

    @prop({type: () => String})
    fatherNameOrRelativeName?: string;

    @prop({type: () => [String]})
    public  symptoms?: string[];

    @prop({type: () => [String]})
    public goals?: string[];

    @prop({type: () => String})
    public additionalInfo?: string;
    
}

@ModelOptions({ schemaOptions: { timestamps: true } })
export class Session {

    // @prop({type: () => String})
    // public sessionId!: string; // mongoose will add _id field for us

    // need to address below things
    // coordinator (he can add operator to session) 
    // there is set of operators that can be added to session(teamMembers)

    @prop({type: () => String})
    public sessionTitle?: string;

    @prop({type: () => String})
    public sessionInfo?: string;

    @prop({ref: () => Operator, default:[]})
    public teamMembers?: Ref<Operator>[];

    @prop({type: () => Interview})
    public interview?: Interview;

    @prop({type: () => Date})
    public sessionStartDate?: Date;

    @prop({type: () => Date})
    public sessionEndDate?: Date;

    @prop ({type: () => String})
    public conversionTable!: string;

    @prop ({type: () => Number})
    public randomFactor!: number

    @prop({type: () => String})
    public causes!: string;

    @prop({type: () => String})
    public effects!: string;

    @prop({type: () => [String]})
    public selectedTreatments!: string[];

    @prop({ref: () => Treatment, type: () => [String]})
    public treatmentSurveys?: Ref<Treatment>[];
    
}

export default Session