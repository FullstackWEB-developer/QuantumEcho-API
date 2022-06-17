import { AdminModel } from "../../models/dbmodel";

const adminResolver = {
    Query: {
      async adminCount (_parent: any, _args: any) {
        const count = await AdminModel.countDocuments(_args);
        return count;
      },
      async admins (_parent: any, _args: any) {
        const lists = await AdminModel.find();
        return lists;
      },
      async admin (_parent: any, _args: any) {
        const result = await AdminModel.findOne({_id: _args._id});
        return result;
      }
    },
    Mutation: {
        async postAdmin(_parent: any, _args: any) {
          const newData = {
            ..._args.input,
          }
          let result;
          await AdminModel.create(newData)
          .then(() => {
            result = {message:"Successfully created new treatment."}
          })
          .catch((error) => {
            result = {message:error._message};
          });
          return result;
        },
        async updateAdmin(_parent: any, _args: any) {
          const updateData = {
            ..._args.input,
          }
          let results;
          await AdminModel.findOneAndUpdate({_id:_args._id}, updateData, {new: true})
          .then((result) => {
              results = result;
          }).catch((error) => {
            results = null;
          });
          return results;
        },
        async deleteAdmin(_parent: any, _args: any) {
          let results;
          await AdminModel.findOneAndDelete({_id:_args._id})
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

export default adminResolver;