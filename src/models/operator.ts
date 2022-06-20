import { prop, getModelForClass, Ref, modelOptions} from '@typegoose/typegoose';
import { Customer } from './customer';
import { Protocol } from './protocol';
import { Subscription } from './subscription';

enum Sex {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = "other"
} 

enum Role {
    GENERAL_MANAGER = 'general_manager',
    PROJECT_MANAGER = 'project_manager',
    WELLNESS_OPERATOR = 'wellness_operator'
}

class ContactInfo {

    @prop({type: () => String, required: true })
    public address!: string

    @prop({type: () => String })
    public city!: string;

    @prop({type: () => String })
    public province!: string;

    @prop({type: () => String })
    public country!: string;

    @prop({type: () => String })
    public CAP!: string;

    @prop({type: () => String})
    public website?: string;

    @prop({type: () => String, required: true, unique: true})
    public phoneNumber!: string; 
}

export class Operator {
    // NEED TO WORK ON THIS
    // @prop({ref: () => User})   // operatorId is taken from AWS cognito
    // public operatorId!: 

    @prop({type:() =>String, required:true})
    public username!: string; // username is AWS cognito's username

    @prop({type: () => String, required: true})
    public firstName!: string; 

    @prop({type: () => String, required: true})
    public lastName!: string; 

    @prop({type: () => String, required: true})
    public placeOfBirth!: string; // City of Birth, Country (Rome, Italy)

    @prop({type: () => String, required: true})
    public dateOfBirth!: string; // DD/MM/YYYY

    @prop({type: () => ContactInfo, required: true})
    public contactInfo!: ContactInfo; 

    @prop({type: () => String, required: true})
    public profileImage!: string; 

    @prop({required: true, type: () => String})
    public bioSex!: string; 

    @prop({type: () => String, required: true, unique: true})
    public email!: string; 

    @prop({type: () => String})
    public activity!: string; 

    @prop({type: () => String})
    public company?: string;

    @prop()
    public kingdom?: string;

    @prop()
    public species?: string;

    @prop({ref: () => Subscription, default: []})
    public store?: Ref<Subscription>[];

    @prop({ref: () => Customer, default: []})
    public customers?: Ref<Customer>[];

    @prop({ref: () => Protocol, default: []})
    public protocols?: Ref<Protocol>[];

}   
            
// const OperatorModel = getModelForClass(Operator);

export default Operator;