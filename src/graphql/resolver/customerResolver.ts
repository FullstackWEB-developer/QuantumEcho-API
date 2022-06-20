
import {CustomerModel} from "../../models/dbmodel";
const global = require('../../global');

const customerResolver = {
    Query: {
      async customerCount (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const count = await CustomerModel.countDocuments(_args);
        return count;
      },
      async customers (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const lists = await CustomerModel.find();
        return lists;
      },
      async customer (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await CustomerModel.findOne({_id: _args._id});
        return result;
      }
    },
    Mutation: {
        async postCustomer(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const newData = {
            ..._args.input,
          }
          let result;
          await CustomerModel.create(newData)
          .then(() => {
            result = {message:"Successfully created new treatment."}
          })
          .catch((error) => {
            result = {message:error._message};
          });
          return result;
        },
        async updateCustomer(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const updateData = {
            ..._args.input,
          }
          let results;
          await CustomerModel.findOneAndUpdate({_id:_args._id}, updateData, {new: true})
          .then((result) => {
              results = result;
          }).catch((error) => {
            results = null;
          });
          return results;
        },
        async deleteCustomer(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          let results;
          await CustomerModel.findOneAndDelete({_id:_args._id})
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

export default customerResolver;