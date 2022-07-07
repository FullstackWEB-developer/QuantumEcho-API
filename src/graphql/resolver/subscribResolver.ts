import {SubscribModel} from "../../models/dbmodel";
import {ModuleModel} from "../../models/dbmodel"; 
const global = require('../../global');

const subscribResolver = {
    Query: {
      async subscribCount (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const count = await SubscribModel.countDocuments(_args);
        return count;
      },

      async subscribs (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const lists = await SubscribModel.find(_args.condition).populate('features').populate('creator');        
        
        var pageNum:number = 0;
        if (_args.pageNum && _args.pageNum > 0) {
          pageNum = _args.pageNum - 1;
          return {lists:lists.slice(pageNum*Number(process.env.PAGE_PER_COUNT), (pageNum+1) * Number(process.env.PAGE_PER_COUNT)), totalCount:lists.length, perCount:Number(process.env.PAGE_PER_COUNT)};
        }
        return {lists:lists, totalCount:lists.length, perCount:Number(process.env.PAGE_PER_COUNT)};
      },

      async subscrib (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await SubscribModel.findOne({_id: _args._id}) as any;
        if (result) {
          const moduleData = await ModuleModel.findOne({_id: result.features});
          if (moduleData) {
            result.features = moduleData
          }
        }
        
        return result;
      }
    },
    Mutation: {
        async postSubscrib(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const newData = {
            ..._args.input,
          }
          let result;
          await SubscribModel.create(newData)
          .then(() => {
            result = {message:"Successfully created."}
          })
          .catch((error) => {
            console.log("🚀 ~ file: subscribResolver.ts ~ line 34 ~ postSubscrib ~ error", error)
            result = {message:error._message};
          });
          return result;
        },
        async updateSubscrib(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const updateData = {
            ..._args.input,
          }
          let results;
          await SubscribModel.findOneAndUpdate({_id:_args._id}, updateData, {new: true})
          .then((result) => {
              results = result;
          }).catch((error) => {
            results = null;
          });
          return results;
        },
        async deleteSubscrib(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          let results;
          await SubscribModel.findOneAndDelete({_id:_args._id})
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

export default subscribResolver;