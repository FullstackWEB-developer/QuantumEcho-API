import DBModel from "../../models/user";
import { OperatorModel } from "../../models/dbmodel";

const userResolver = {
    Query: {
      async userCount (_parent: any, _args: any) {
        const count = await DBModel.countDocuments(_args);
        return count;
      },
      async users (_parent: any, _args: any) {
        const lists = await DBModel.find();
        return lists;
      },
      async user (_parent: any, _args: any) {
        const result = await DBModel.findOne({username: _args.username});
        return result;
      }
    },
    Mutation: {
        async postUser(_parent: any, _args: any) {
          const newData = {
            ..._args.input,
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
        async updateUser(_parent: any, _args: any) {
          const updateData = {
            ..._args.input,
          };
          let results;
          if (await DBModel.findOne({username: updateData.username})) {
            await DBModel.findOneAndUpdate({username:_args.username}, updateData, {new: true})
            .then(async (result) => {
              results = await OperatorModel.findOne({username:_args.username});
            }).catch((error) => {
              results = null;
            });
          }else{
            await DBModel.create(updateData)
            .then((result) => {
              results = result;
            })
            .catch((error) => {
              results = null;
            });
          }
          
          return results;
        },
        async deleteUser(_parent: any, _args: any) {
          let results;
          await DBModel.findOneAndDelete({username:_args.username})
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