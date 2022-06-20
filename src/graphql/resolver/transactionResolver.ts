import {TransactionModel} from "../../models/dbmodel";
const global = require('../../global');

const transactionResolver = {
    Query: {
      async transactionCount (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const count = await TransactionModel.countDocuments(_args);
        return count;
      },
      async transactions (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const lists = await TransactionModel.find();
        return lists;
      },
      async transaction (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await TransactionModel.findOne({_id: _args._id});
        return result;
      }
    },
    Mutation: {
        async postTransaction(_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
          const newData = {
            ..._args.input,
          }
          let result;
          await TransactionModel.create(newData)
          .then(() => {
            result = {message:"Successfully created."}
          })
          .catch((error) => {
            result = {message:error._message};
          });
          return result;
        },
        async updateTransaction(_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
          const updateData = {
            ..._args.input,
          }
          let results;
          await TransactionModel.findOneAndUpdate({_id:_args._id}, updateData, {new: true})
          .then((result) => {
              results = result;
          }).catch((error) => {
            results = null;
          });
          return results;
        },
        async deleteTransaction(_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
          let results;
          await TransactionModel.findOneAndDelete({_id:_args._id})
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

export default transactionResolver;