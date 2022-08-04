import { ModelOptions, prop, Ref} from '@typegoose/typegoose';
import  { DailySurvey } from './dailySurvey';
import { Project } from './project';

enum Sex {

    MALE = 'Male',
    FEMALE = 'Female',
    OTHER = "Other"

}

class ContactInfo {

    @prop({type: () => String, required: true })
    public address?: string
 
    @prop({type: () => String })
    public city?: string;

    @prop({type: () => String })
    public province?: string;

    @prop({type: () => String })
    public country?: string;

    @prop({type: () => String })
    public CAP?: string;

    @prop({type: () => String, required: true})
    public phoneNumber?: string; 

}

@ModelOptions({ schemaOptions: { timestamps: true } })
export class Customer {

// NEED TO WORK ON THIS
    @prop({type: () => String})   //customerId is taken from AWS cognito (userId)
    public customerId?: string; 
    
    @prop({type: () => String, required: true})
    public firstName!: string;

    @prop({type: () => String, required: true})
    public lastName!: string;

    @prop({type: () => String, required: true})
    public placeOfBirth!: string;

    @prop({type: () => Date, required: true})
    public dateOfBirth!: Date;

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

    @prop({required: true, type: () => String})
    public bioSex!: string;

    @prop({type: () => Date, default: new Date('01/02/1902')})
    public lastAccess?: Date;

    @prop({ref: () => DailySurvey})
    public  dailySurveys? : Ref<DailySurvey>[];

    @prop({ref: () => Project})
    public  projects? : Ref<Project>[];  
    
}

// const CustomerModel = getModelForClass(Customer)

export default Customer

