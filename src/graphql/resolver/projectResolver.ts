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

        const allLists = await ProjectModel.find(_args.condition)
        .populate('coordinator')
        .populate(
          {
            path:'sessions', 
            options:{sort:{'createdAt':'desc'}}, 
            populate:{path:'teamMembers'}
          })
        .sort({'createdAt':'desc'});

        var pageNum:number = 0;
        if (_args.pageNum && _args.pageNum > 0) {
          pageNum = _args.pageNum - 1;
          return {lists:allLists.slice(pageNum*Number(process.env.PAGE_PER_COUNT), (pageNum+1) * Number(process.env.PAGE_PER_COUNT)), totalCount:allLists.length, perCount:Number(process.env.PAGE_PER_COUNT)};
        }
        return {lists:allLists, totalCount:allLists.length, perCount:Number(process.env.PAGE_PER_COUNT)};
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

          const sessions = _args.input.sessions;
          const newData = {
            projectName:_args.input.projectName,
            coordinator:_args.input.coordinator,
            sessions:[],
          }
          // update project
          const result = await ProjectModel.findOneAndUpdate({_id:_args._id}, newData, {new:true}) as any;

          // update session and update project's sessions
          Promise.all(
            sessions.map(async(row:any) => {
              console.log("🚀 ~ file: projectResolver.ts ~ line 99 ~ sessions.map ~ row", row)
              const session = {sessionTitle:row.sessionTitle, teamMembers:row.teamMembers}
              if (row._id === '') {
                await SessionModel.create(session).then(async docSession => {
                  await ProjectModel.findByIdAndUpdate(
                    result._id,
                    {$push: {sessions:docSession._id}},
                    { new: true, useFindAndModify: false }
                  );
                })
              }else{
                await SessionModel.findOneAndUpdate({_id:row._id}, session, {new: true}).then(async docSession => {
                  await ProjectModel.findByIdAndUpdate(
                    result._id,
                    {$push: {sessions: row._id}},
                    { new: true, useFindAndModify: false }
                  );
                })
              }
            })
          );
          
          return result;
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