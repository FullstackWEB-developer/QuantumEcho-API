import { prop, Ref} from '@typegoose/typegoose';
import { Operator } from './operator';
import { Session } from './session';

export class Project {

    @prop({type: () => String})
    public projectId!: string; // mongoose will add _id field for us 

    @prop({type: () => String})
    public projectName?: string;  // create new project or we seleceted projectName from Project's Model

    @prop({ref: () => Operator}) // this is a reference to Operator as coordinator
    public coordinator?: Ref<Operator>;

    @prop({ref: () => Session })
    public sessions?: Ref<Session>[];

}

// const ProjectModel = getModelForClass(Project);

export  default Project;   