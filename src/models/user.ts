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

    @prop ({type: () => String, required: true, unique: true})
    public username!: string; //

    @prop ({type: () => String, required: true, unique: true})
    public email!: string; //

    @prop ({type: () => String, required: true})
    public password!: string;
 //  NOTE: we will DECIDE what is the purpose of this field later
    @prop ({type: () => String, default: ['operator']})
    public role!: string[];

    @prop ({type: () => String})
    public accessToken?: string;
    
    // @prop ({type: () => Date})
    // public creationDate = new Date();

    @prop({type: () => String, required: true, enum: Object.values(Status)})
    public status?: string;    
    
}

const UserModel = getModelForClass(User);

export default UserModel;