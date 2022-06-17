import { prop, Ref} from '@typegoose/typegoose';
import { Operator } from './operator';
import { Subscription } from './subscription';

export class Transaction {

    // @prop({type: () => mongoose.Types.ObjectId})
    // public transactionId!: string;

    @prop({ref: () => Subscription})
    public subscriptions!: Ref<Subscription>[];

    // @prop({type: () => Date, default: Date.now})
    // public dateOfTransaction!: Date; // mongoose can create Date of transaction automatically

    @prop({ref: () => Operator})
    public operatorBuyer!: Ref<Operator>;

}

// const TransactionModel = getModelForClass(Transaction);

export default Transaction;