import { prop } from '@typegoose/typegoose';



class Questions {

    @prop({type: () => Number, required: true, enum: [1,2,3,4,5,6,7,8,9,10]})
    public question1!: Number;

    @prop({type: () => Number, required: true, enum: [1,2,3,4,5,6,7,8,9,10]})
    public question2!: Number;
  

    @prop({type: () => Number, required: true, enum: [1,2,3,4,5,6,7,8,9,10]})
    public question3!: Number;

}

export class DailySurvey {

    // @prop({type: () => mongoose.Types.ObjectId})
    // public dailySurveyId!: string;

    @prop({type: () => String})
    public dateOfSurvey!: string; // mongoose can create Date of survey automatically

    @prop({type: () => Questions, required: true})
    public questions!: Questions;

}


// const DailySurveyModel = getModelForClass(DailySurvey);

export default DailySurvey;