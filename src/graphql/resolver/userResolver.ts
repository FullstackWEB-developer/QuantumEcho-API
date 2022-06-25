import DBModel from "../../models/user";
import { OperatorModel } from "../../models/dbmodel";
const global = require('../../global');
const crypto = require('crypto');

const userResolver = {
    Query: {
      async userCount (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const count = await DBModel.countDocuments(_args);
        return count;
      },
      async users (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const lists = await DBModel.find();
        return lists;
      },
      async user (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await DBModel.findOne({email: _args.email});
        return result;
      }
    },
    Mutation: {
        async postUser(_parent: any, _args: any, { headers }: any) {
        // await global.isAuthorization(headers, false);
          const newData = {
            ..._args.input,
            password: crypto.createHash('sha256').update(_args.input.password).digest('hex'),
          }
          let result;
          await DBModel.create(newData)
          .then(() => {
            result = {message:"Successfully created."}
          })
          .catch((error) => {
            result = {message:error._message};
          });
          return result;
        },

        async updateUser(_parent: any, _args: any, { headers }: any) {
        // await global.isAuthorization(headers, false);
          const updateData = {
            ..._args.input,
            password: crypto.createHash('sha256').update(_args.input.password).digest('hex'),
          };
          let results;
          if (await DBModel.findOne({cognitoId: updateData.cognitoId})) {
            await DBModel.findOneAndUpdate({cognitoId:updateData.cognitoId}, updateData, {new: true})
            .then(async (result) => {
              results = await OperatorModel.findOne({operatorId:updateData.cognitoId});
            }).catch((error) => {
              results = error;
            });
          }else{
            await DBModel.create(updateData)
            .then((result) => {
              results = null;
            })
            .catch((error) => {
              results = error;
            });
          }
          
          return results;
        },
        async deleteUser(_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
          let results;
          await DBModel.findOneAndDelete({email:_args.email})
          .then((result) => {
              results = {message:"Successfully deleted."};              
          })
          .catch((error) => {
              results = {message:error._message};
          });
          return results;
        }
    }
}

export default userResolver;