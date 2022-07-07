import {ProtocolModel} from "../../models/dbmodel";
const global = require('../../global');

const protocolResolver = {

    Query: {

      async protocolCount (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const count = await ProtocolModel.countDocuments(_args);
        return count;
      },

      async protocols (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const lists = await ProtocolModel.find({coordinator:_args.condition.coordinator, protocolName:{$regex:_args.condition.protocolName}});
        
        var pageNum:number = 0;
        if (_args.pageNum && _args.pageNum > 0) {
          pageNum = _args.pageNum - 1;
          return {lists:lists.slice(pageNum*Number(process.env.PAGE_PER_COUNT), (pageNum+1) * Number(process.env.PAGE_PER_COUNT)), totalCount:lists.length, perCount:Number(process.env.PAGE_PER_COUNT)};
        }
        return {lists:lists, totalCount:lists.length, perCount:Number(process.env.PAGE_PER_COUNT)};
      },

      async protocol (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await ProtocolModel.findOne({_id: _args._id});
        return result;
      }
    },

    Mutation: {

        async postProtocol(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const newData = {
            ..._args.input,
          }
          let result;
          await ProtocolModel.create(newData)
          .then(() => {
            result = {message:"Successfully created."}
          })
          .catch((error) => {
            result = {message:error._message};
          });
          return result;
        },

        async updateProtocol(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const updateData = {
            ..._args.input,
          }
          let results;
          await ProtocolModel.findOneAndUpdate({_id:_args._id}, updateData, {new: true})
          .then((result) => {
              results = result;
          }).catch((error) => {
            results = null;
          });
          return results;
        },

        async deleteProtocol(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          let results;
          await ProtocolModel.findOneAndDelete({_id:_args._id})
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

export default protocolResolver;