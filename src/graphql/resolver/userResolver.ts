import DBModel from "../../models/user";
import { OperatorModel, CustomerModel, AdminModel } from '../../models/dbmodel';
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

        const users = await DBModel.aggregate([
          {
            $match:{
              cognitoId:{$not:{ $regex: _args.cognitoId }},
            },
          },
          {
            $lookup:{
              from:'customers',
              localField:'cognitoId',
              foreignField:'customerId',
              as: 'customer'
            }, 
          },
          {
            $lookup:{
              from:'operators',
              localField:'cognitoId',
              foreignField:'operatorId',
              as: 'operator'
            }, 
          },
          //
        ]);

        var pageNum:number = 0;
        if (_args.pageNum && _args.pageNum > 0) {
          pageNum = _args.pageNum - 1;
          return {lists:users.slice(pageNum*Number(process.env.PAGE_PER_COUNT), (pageNum+1) * Number(process.env.PAGE_PER_COUNT)), totalCount:users.length, perCount:Number(process.env.PAGE_PER_COUNT)};
        }
        return {lists:users, totalCount:users.length, perCount:Number(process.env.PAGE_PER_COUNT)};
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

        async updateUserData(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers, false);
          let result;
          await DBModel.findOneAndUpdate({_id:_args._id}, _args.input, {new: true})
          .then(() => {
            result = {message:"Successfully updated."};
          }).catch((error) => {
            result = {message:error._message};
          });
          return result;
        },

        async updateUser(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers, false);
          const updateData = {
            ..._args.input,
            password: crypto.createHash('sha256').update(_args.input.password).digest('hex'),
          };
          let results;
          if (await DBModel.findOne({cognitoId: updateData.cognitoId})) {
            await DBModel.findOneAndUpdate({cognitoId:updateData.cognitoId}, updateData, {new: true})
            .then(async (result) => {
              results = await OperatorModel.findOne({operatorId:updateData.cognitoId});
              if (results) {
                await OperatorModel.findOneAndUpdate({_id: results._id}, {lastAccess: new Date()}, {new: true});
              }
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

        async updateUserWithCustomer(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers, false);
          const updateData = {
            ..._args.input,
            password: crypto.createHash('sha256').update(_args.input.password).digest('hex'),
          };
          let results;
          if (await DBModel.findOne({cognitoId: updateData.cognitoId})) {
            await DBModel.findOneAndUpdate({cognitoId:updateData.cognitoId}, updateData, {new: true})
            .then(async (result) => {
              await CustomerModel.findOneAndUpdate({customerId:updateData.cognitoId}, {lastAccess: new Date()}, {new: true});
              results = await CustomerModel.findOne({customerId:updateData.cognitoId});
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

        async upateUserWithAdmin(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers, true);
          const updateData = {
            ..._args.input,
            password: crypto.createHash('sha256').update(_args.input.password).digest('hex'),
          };
          let results;
          if (await DBModel.findOne({cognitoId: updateData.cognitoId})) {
            await DBModel.findOneAndUpdate({cognitoId:updateData.cognitoId}, updateData, {new: true})
            .then(async (result) => {              
              results = await AdminModel.findOne({adminId:updateData.cognitoId});
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