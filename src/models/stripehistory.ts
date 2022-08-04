import { ModelOptions, prop, Ref} from '@typegoose/typegoose';

@ModelOptions({ schemaOptions: { timestamps: true } })
export class StripeHistory {

    @prop({type: () => String, required: true})
    public paymentId!: string;

    @prop({type: () => String, required: true})
    public operatorId!: string;

    @prop({type: () => String, required: true})
    public paymentIntentClientSecret!: string

}

export default StripeHistory;