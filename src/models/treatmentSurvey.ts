import { ModelOptions, prop } from '@typegoose/typegoose';

class Questions {

    @prop({type: () => Number, required: true, enum: [1,2,3,4,5,6,7,8,9,10]})
    public question1!: Number;

    @prop({type: () => Number, required: true, enum: [1,2,3,4,5,6,7,8,9,10]})
    public question2!: Number;  

    @prop({type: () => Number, required: true, enum: [1,2,3,4,5,6,7,8,9,10]})
    public question3!: Number;

}

@ModelOptions({ schemaOptions: { timestamps: true } })
export class TreatmentSurvey {

  // @prop({ type: () => String}) // mongoose will add _id field for us that we consider as  treatmentSurveyId
  // treatmentSurveyId?: string;

  @prop({ type: () => Date })
  public SurveyDate?: Date;

  @prop({type: () => Questions, required: true})
  public questions!: Questions;

  @prop({type: () => String})
  public comments?: string;

}

export default TreatmentSurvey;