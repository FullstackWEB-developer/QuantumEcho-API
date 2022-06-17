import { prop, getModelForClass, Ref} from '@typegoose/typegoose';
import { Session } from 'inspector';

export class Evaluation {

    @prop({type: () => String})
    public evaluationId!: string; // mongoose will add _id field for us that we consider as  evaluationId
    
    @prop({ref: () => Session})
    public sessionId!: Ref<Session>;
     
    @prop({type: () => Number})
    public modulesOfEvaluation!: number;

    @prop({type: () => Number})
    public groupOfEvaluation!: number;

    @prop({type: () => Number})
    public subGroupOfEvaluation!: number;


}


// const EvaluationModel = getModelForClass(Evaluation);

export default Evaluation;