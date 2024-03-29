
import { prop, ModelOptions } from "@typegoose/typegoose";

@ModelOptions({ schemaOptions: { timestamps: true } })
export class Treatment {

    @prop({ type: () => String, required: true, unique: true })
    public treatmentName!: string;

    @prop({ type: () => String, required: true, unique: true })
    public treatmentGroup!: string;

    @prop({ type: () => String, required: true, unique: true })
    public treatmentSubGroup!: string;

    @prop({type:()=> Number, required: true})
    public frequencies!: number;

    @prop({type: () => String, required: true})
    public fractals!: string[];

}

export default Treatment;