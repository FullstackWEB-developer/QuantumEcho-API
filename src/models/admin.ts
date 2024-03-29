import { prop, Ref, ModelOptions} from '@typegoose/typegoose';
import mongoose, { Schema, SchemaTypes } from 'mongoose';
import { Subscrib } from './subscrib';

class Address {

    @prop({type: () => String})
    street?: string;

    @prop({type: () => String })
    city?: string;

    @prop({type: () => String })
    province?: string;

    @prop({type: () => String })
    country?: string;

    @prop({type: () => String })
    postCode?: string; // CAP 

}


enum SubRoles {

    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin'
}

@ModelOptions({ schemaOptions: { timestamps: true } })
export class Admin {
    // NEED TO WORK ON THIS
    @prop({type:() => String}) 
    public adminId!: string; //is taken from AWS cognito 

    @prop({type: () => String, required: true})
    public profileImage!: string;

    @prop({type: () => String, required: true, unique: true})  
    public phoneNumber!: string;

    @prop({type: () => Address, required: true})
    public address!: Address; 

    @prop({type: () => String, required: true})
    public firstName!: string; 

    @prop({type: () => String, required: true})
    public lastName!: string; 

    @prop({type: () => String, required: true, unique: true})
    public email!: string; 

    @prop({type : () => mongoose.Types.ObjectId, required: true, ref:'Subscrib'})
    public subscribs!: Ref<Subscrib>[];

    @prop({type: () => String, required: true, enum: Object.values(SubRoles)}) 
    public subRole!: string;
     //TO DO: add adminId
    // @prop({type: () => String, required: true})   
   // public adminId!: Ref<Admin>[];


}

// const adminModel = getModelForClass(Admin);

export default Admin;
