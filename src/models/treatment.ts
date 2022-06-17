
import { prop, Ref, getModelForClass } from "@typegoose/typegoose";
import mongoose from "mongoose";


export class Treatment {

    // @prop({type: () => mongoose.Types.ObjectId})
    // public _id!: string;

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


// const TreatmentModel = getModelForClass(Treatment);

export default Treatment;