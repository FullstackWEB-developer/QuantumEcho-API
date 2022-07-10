import { ModelOptions, prop } from '@typegoose/typegoose';

class Questions {

    @prop({type: () => Number, required: true, enum: [1,2,3,4,5,6,7,8,9,10]})
    public question1!: Number;

    @prop({type: () => Number, required: true, enum: [1,2,3,4,5,6,7,8,9,10]})
    public question2!: Number;
  

    @prop({type: () => Number, required: true, enum: [1,2,3,4,5,6,7,8,9,10]})
    public question3!: Number;

}

enum SurveyType {
    Morning = 'Morning',
    Evening = 'Evening'
}

@ModelOptions({ schemaOptions: { timestamps: true } })
export class DailySurvey {

    // @prop({type: () => mongoose.Types.ObjectId})
    // public dailySurveyId!: string;

    @prop({type: () => String})
    public dateOfSurvey!: string; // mongoose can create Date of survey automatically

    @prop({type: () => Questions, required: true})
    public questions!: Questions;

    //***** add by Sheng Ben *****//
    @prop({type: () => String})
    public surveyTime!: string;

    @prop({type:() => String, default: SurveyType.Morning})
    public surveyType!: string;
    //***** add by Sheng Ben *****//

}

export default DailySurvey;