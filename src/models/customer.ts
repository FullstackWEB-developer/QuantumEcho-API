import { prop, Ref} from '@typegoose/typegoose';
import  { DailySurvey } from './dailySurvey';
import { Project } from './project';

enum Sex {

    MALE = 'male',
    FEMALE = 'female',
    OTHER = "other"

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

    @prop({type: () => String, required: true})
    public phoneNumber!: string; 

}

export class Customer {

// NEED TO WORK ON THIS
    // @prop({ref: () => User})   //customerId is taken from AWS cognito (userId)
    // public customerId!: 
    
    @prop({type: () => String, required: true})
    public firstName!: string;

    @prop({type: () => String, required: true})
    public lastName!: string;

    @prop({type: () => String, required: true})
    public placeOfBirth!: string;

    @prop({type: () => String, required: true})
    public dateOfBirth!: string;

    @prop({type: () => ContactInfo})
    public contactInfo?: ContactInfo;

    @prop({type: () => String, required: true})
    public email!: string; 

    @prop({type: () => String, required: true})
    public kingdom?: string;

    @prop({type: () => String, required: true})
    public species?: string;

    @prop({type: () => String, required: true})
    public profileImage!: string;

    @prop({required: true, type: () => String, enum:Object.values(Sex)})
    public bioSex!: string;

    @prop({type: () => Date, required: true})
    public lastAccess!: Date;

    @prop({ref: () => DailySurvey})
    public  dailySurveys! : Ref<DailySurvey>[];

    @prop({ref: () => Project})
    public  projects! : Ref<Project>[];
    
}

// const CustomerModel = getModelForClass(Customer)

export default Customer

