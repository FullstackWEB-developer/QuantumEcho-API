import { ModelOptions, prop} from '@typegoose/typegoose';

@ModelOptions({ schemaOptions: { timestamps: true } })
export class  ResonanceSubGroup{

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

}

export default ResonanceSubGroup;