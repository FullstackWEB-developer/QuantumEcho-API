import { ModelOptions, prop} from '@typegoose/typegoose';

@ModelOptions({ schemaOptions: { timestamps: true } })
export class  Module{

    // @prop({type: () => mongoose.Types.ObjectId})
    // public moduleId!: string;  // mongoose will add _id field for us that we consider as  moduleId

    @prop({type: () => String, required: true})
    public moduleName!: string;

}


// const ModuleModel = getModelForClass(Module);

export default Module;