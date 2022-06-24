import {ProjectModel} from "../../models/dbmodel";
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
        return lists;
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
          let result;
          await ProjectModel.create(newData)
          .then(() => {
            result = {message:"Successfully created."}
          })
          .catch((error) => {
            result = {message:error._message};
          });
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