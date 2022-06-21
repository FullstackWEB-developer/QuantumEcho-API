import {SubscribModel} from "../../models/dbmodel";
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
        const lists = await SubscribModel.find({creator:_args.creator});
        return lists;
      },
      async subscrib (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await SubscribModel.findOne({_id: _args._id});
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