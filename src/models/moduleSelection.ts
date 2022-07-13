import { ModelOptions, prop, Ref} from '@typegoose/typegoose';
import ResonanceGroup from './resonanceGroup';

@ModelOptions({ schemaOptions: { timestamps: true } })
export class  ModuleSelection{

    @prop({type: () => String, required: true})
    public moduleName!: string;

    @prop({type: () => Number})
    public moduleValue!: number;

    @prop({type:() => Number})
    public resonancevalue!:number;

    @prop({type:() => String})
    public description!:string

    @prop({type:() => String})
    public picture!: string

    @prop({type:() => String, ref:() => ResonanceGroup})
    public resonanceGroups!: Ref<ResonanceGroup>[];

}

export default ModuleSelection;