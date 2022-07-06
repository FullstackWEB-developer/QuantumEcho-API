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
        const allLists = await ProjectModel.find(_args.condition).populate('sessions');    
        allLists.sort(function (a:any, b:any) {
          return b.createdAt - a.createdAt;
        });

        let lists:any[] = [];
        await Promise.all(
          allLists.map(async(row:any) => {
            row.coordinator = await OperatorModel.findOne({_id: row.coordinator}) as any;
            const sessions = row.sessions.sort(function (a:any, b:any) {
              return b.createdAt - a.createdAt;
            });

            row.sessions = sessions;
                       
            lists.push(row);
          })
        );

        var pageNum:number = 0;
        if (_args.pageNum && _args.pageNum > 0) {
          pageNum = _args.pageNum - 1;
          return {lists:lists.slice(pageNum*Number(process.env.PAGE_PER_COUNT), (pageNum+1) * Number(process.env.PAGE_PER_COUNT)), totalCount:lists.length, perCount:Number(process.env.PAGE_PER_COUNT)};
        }
        return {lists:lists, totalCount:lists.length, perCount:Number(process.env.PAGE_PER_COUNT)};
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
          const sessions = _args.input.sessions;
          const newData = {
            projectName:_args.input.projectName,
            coordinator:_args.input.coordinator,
          }
          // create project
          const result = await ProjectModel.create(newData);

          // create session and update project's sessions
          Promise.all(
            sessions.map(async(row:any) => {
              const session = {sessionTitle:row.sessionTitle, teamMembers:row.teamMembers}
              await SessionModel.create(session).then(async docSession => {
                await ProjectModel.findByIdAndUpdate(
                  result._id,
                  {$push: {sessions:docSession._id}},
                  { new: true, useFindAndModify: false }
                );
              })
            })
          );
          
          return result;
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