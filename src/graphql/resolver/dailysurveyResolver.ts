import { DailySurveyModel } from "../../models/dbmodel";
const global = require('../../global');

const dailysurveyResolver = {
    Query: {
      async daliySurveyCount (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const count = await DailySurveyModel.countDocuments(_args);
        return count;
      },
      async daliySurveys (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const lists = await DailySurveyModel.find();
        return lists;
      },
      async daliySurvey (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await DailySurveyModel.findOne({_id: _args._id});
        return result;
      }
    },
    Mutation: {
        async postDailySurvey(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const newData = {
            ..._args.input,
          }
          let result;
          await DailySurveyModel.create(newData)
          .then(() => {
            result = {message:"Successfully created."}
          })
          .catch((error) => {
            result = {message:error._message};
          });
          return result;
        },
        async updateDailySurvey(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const updateData = {
            ..._args.input,
          }
          let results;
          await DailySurveyModel.findOneAndUpdate({_id:_args._id}, updateData, {new: true})
          .then((result) => {
              results = result;
          }).catch((error) => {
            results = null;
          });
          return results;
        },
        async deleteDailySurvey(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          let results;
          await DailySurveyModel.findOneAndDelete({_id:_args._id})
          .then((result) => {
              results = {message:"Successfully deleted."};              
          })
          .catch((error) => {
              results = {message:error._message}
          });
          return results;
        }
    }
}

export default dailysurveyResolver;