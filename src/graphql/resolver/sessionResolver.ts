import {SessionModel} from "../../models/dbmodel";
const global = require('../../global');

const sessionResolver = {
    Query: {
      async sessionCount (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const count = await SessionModel.countDocuments(_args);
        return count;
      },

      async sessions (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const lists = await SessionModel.find();

        var pageNum:number = 0;
        if (_args.pageNum && _args.pageNum > 0) {
          pageNum = _args.pageNum - 1;
          return {lists:lists.slice(pageNum*Number(process.env.PAGE_PER_COUNT), (pageNum+1) * Number(process.env.PAGE_PER_COUNT)), totalCount:lists.length, perCount:Number(process.env.PAGE_PER_COUNT)};
        }
        return {lists:lists, totalCount:lists.length, perCount:Number(process.env.PAGE_PER_COUNT)};
      },

      async session (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await SessionModel.findOne({_id: _args._id});
        return result;
      }
    },
    Mutation: {
        async postSession(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const newData = {
            ..._args.input,
          }
          let result;
          await SessionModel.create(newData)
          .then(() => {
            result = {message:"Successfully created."}
          })
          .catch((error) => {
            result = {message:error._message};
          });
          return result;
        },
        async updateSession(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const updateData = {
            ..._args.input,
          }
          let results;
          await SessionModel.findOneAndUpdate({_id:_args._id}, updateData, {new: true})
          .then((result) => {
              results = result;
          }).catch((error) => {
            results = null;
          });
          return results;
        },
        async deleteSession(_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
          let results;
          await SessionModel.findOneAndDelete({_id:_args._id})
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

export default sessionResolver;