import { DailySurveyModel, CustomerModel } from "../../models/dbmodel";
const global = require('../../global');
import { format } from 'date-fns';

const dailysurveyResolver = {
    Query: {
      async dailySurveyCount (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const count = await DailySurveyModel.countDocuments(_args);
        return count;
      },
      async dailySurveys (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const customerId = _args.customerId;
        const dateOfSurvey = _args.dateOfSurvey;
        const surveyType = _args.surveyType;
        const customer = await CustomerModel.findOne({_id: customerId})
            .populate(
              {
                path: 'dailySurveys',
                options:{
                  sort:{dateOfSurvey:'desc'},                  
                },
                match:{
                  'dateOfSurvey':{$regex:dateOfSurvey},
                  'surveyType':{$regex:surveyType}
                }
              }
            ) as any;

        const dailySurveys:any[] = [];
        let tempDate:String = '01/01/1900';

        Promise.all(
          customer.dailySurveys.map(async(survey:any) => {
            let dateOfSurvey:String = survey.dateOfSurvey as String;
            if (tempDate !== dateOfSurvey){
              tempDate = dateOfSurvey;
              const morningData = customer.dailySurveys.find((item:any) => item.dateOfSurvey === tempDate && item.surveyType === 'Morning');
              const eveningData = customer.dailySurveys.find((item:any) => item.dateOfSurvey === tempDate && item.surveyType === 'Evening');
              const data = {
                dateOfSurvey,
                morningData,
                eveningData
              }              
              dailySurveys.push(data);
            }
          })
        );

        var pageNum:number = 0;
        if (_args.pageNum && _args.pageNum > 0) {
          pageNum = _args.pageNum - 1;
          return {lists:dailySurveys.slice(pageNum*Number(process.env.PAGE_PER_COUNT), (pageNum+1) * Number(process.env.PAGE_PER_COUNT)), totalCount:dailySurveys.length, perCount:Number(process.env.PAGE_PER_COUNT)};
        }
        return {lists:dailySurveys, totalCount:dailySurveys.length, perCount:Number(process.env.PAGE_PER_COUNT)};
      },

      async dailySurvey (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await DailySurveyModel.findOne(_args.condition);
        return result;
      }
    },

    Mutation: {

        async postDailySurvey(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);

          const dateOfSurvey = format(new Date(), 'MM/dd/yyyy');
          const surveyTime = format(new Date(), 'hh:mm');
          // const dateOfSurvey = _args.input.dateOfSurvey;
          // const surveyTime = _args.input.surveyTime;
          const customerId = _args.customerId;
          const surveyId = _args.input._id;
          const newData = {
            questions:_args.input.questions,
            surveyType:_args.input.surveyType,
            dateOfSurvey,
            surveyTime,
          }

          let result;          
          if (surveyId !== '') {
            await DailySurveyModel.findOneAndUpdate({_id:surveyId}, newData, {new: true})
            .then(() => {
              result = {message:"Successfully created."};
            }).catch((error:any) => {
              result = {message:error._message};
            });
          }else{
            await DailySurveyModel.create(newData)
            .then(async(docDailySurvey) => {
              await CustomerModel.findByIdAndUpdate(
                customerId,
                {$push:{dailySurveys:docDailySurvey._id}},
                { new: true, useFindAndModify: false }
              ); 
              result = {message:"Successfully created."}
            })
            .catch((error:any) => {
              result = {message:error._message};
            });
          } 
          
          return result;
        },

        async updateDailySurvey(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const updateData = {
            ..._args.input,
          }
          let results;
          await DailySurveyModel.findOneAndUpdate({_id:_args._id}, updateData, {new: true})
          .then((result:any) => {
              results = result;
          }).catch((error:any) => {
            results = null;
          });
          return results;
        },
        async deleteDailySurvey(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          let results;
          await DailySurveyModel.findOneAndDelete({_id:_args._id})
          .then((result:any) => {
              results = {message:"Successfully deleted."};              
          })
          .catch((error:any) => {
              results = {message:error._message}
          });
          return results;
        }
    }
}

export default dailysurveyResolver;