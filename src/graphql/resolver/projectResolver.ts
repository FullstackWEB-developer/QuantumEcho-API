import {OperatorModel, ProjectModel, SessionModel} from "../../models/dbmodel";
const global = require('../../global');

const projectResolver = {
    Query: {
      async projectCount (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const count = await ProjectModel.countDocuments(_args);
        return count;
      },
      async projects (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const lists = await ProjectModel.find();    
        lists.sort(function (a:any, b:any) {
          return b.createdAt - a.createdAt;
        });

        let tempArr:any[] = [];
        await Promise.all(
          lists.map(async(row) => {
            row.coordinator = await OperatorModel.findOne({_id: row.coordinator}) as any;
            const sessions = row.sessions as any[]
            let tempSessions:any = [];
            await Promise.all(
              sessions?.map(async(element) => {
                const sessionData = await SessionModel.findOne({_id:element}) as any;
                tempSessions.push(sessionData);
              })              
            );

            row.sessions = tempSessions;
                       
            tempArr.push(row);
          })
        );

        var pageNum:number = 0;
        if (_args.pageNum && _args.pageNum > 0) {
          pageNum = _args.pageNum - 1;
          return {lists:tempArr.slice(pageNum*Number(process.env.PAGE_PER_COUNT), (pageNum+1) * Number(process.env.PAGE_PER_COUNT)), totalCount:tempArr.length, perCount:Number(process.env.PAGE_PER_COUNT)};
        }
        return {lists:tempArr, totalCount:tempArr.length, perCount:Number(process.env.PAGE_PER_COUNT)};
      },
      async project (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await ProjectModel.findOne({_id: _args._id});
        return result;
      }
    },
    Mutation: {
        async postProject(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const newData = {
            ..._args.input,
          }
          return await ProjectModel.create(newData)
        },

        async updateProject(_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
          const updateData = {
            ..._args.input,
          }
          let results;
          await ProjectModel.findOneAndUpdate({_id:_args._id}, updateData, {new: true})
          .then((result) => {
              results = result;
          }).catch((error) => {
            results = null;
          });
          return results;
        },
        
        async deleteProject(_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
          let results;
          await ProjectModel.findOneAndDelete({_id:_args._id})
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

export default projectResolver;