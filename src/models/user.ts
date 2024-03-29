import { prop, getModelForClass, ModelOptions, pre} from '@typegoose/typegoose';
import mongoose from 'mongoose';


enum Role {
    ADMIN = 'admin',
    OPERATOR = 'operator',
    CLIENT = 'customer'
}

enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    BLOCKED = 'blocked'
}

@ModelOptions({ schemaOptions: { timestamps: true } })
export class User {
    
    // [x: string]: any; 

    // @prop()
    // public userId?: mongoose.Types.ObjectId; // mongoose will add _id (THAT IS userId) field for us

    @prop ({type: () => String, required:true})
    public cognitoId!: string

    @prop ({type: () => String, required: true, unique: true})
    public email!: string; //

    @prop ({type: () => String, required: true})
    public password?: string;
 //  NOTE: we will DECIDE what is the purpose of this field later
    @prop ({type: () => String, default: ['operator']})
    public role!: string[];

    @prop ({type: () => String})
    public accessToken?: string;

    @prop({type: () => String, enum: Object.values(Status)})
    public status?: string;    

    @prop({type: () => Date, default:Date.now()})
    public lastAccess?: Date;
    
}

const UserModel = getModelForClass(User);

export default UserModel;