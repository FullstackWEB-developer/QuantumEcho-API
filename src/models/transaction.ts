import { prop, Ref} from '@typegoose/typegoose';
import { Operator } from './operator';
import { Subscrib } from './subscrib';

export class Transaction {

    // @prop({type: () => mongoose.Types.ObjectId})
    // public transactionId!: string;

    @prop({ref: () => Subscrib})
    public subscribs!: Ref<Subscrib>[];

    // @prop({type: () => Date, default: Date.now})
    // public dateOfTransaction!: Date; // mongoose can create Date of transaction automatically

    @prop({ref: () => Operator})
    public operatorBuyer!: Ref<Operator>;

}

// const TransactionModel = getModelForClass(Transaction);

export default Transaction;