import { ModelOptions, prop, Ref} from '@typegoose/typegoose';
import ResonanceSubGroup from './resonanceSubGroup';

@ModelOptions({ schemaOptions: { timestamps: true } })
export class  ResonanceGroup{

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

    @prop({type:() => String, ref:() => ResonanceSubGroup})
    public resonanceSubGroups!: Ref<ResonanceSubGroup>[];

}

export default ResonanceGroup;