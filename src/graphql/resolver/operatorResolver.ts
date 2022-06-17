import { OperatorModel } from "../../models/dbmodel";

import fs from 'fs';
import path from 'path';

const operatorResolver = {
    Query: {
      async operatorCount (_parent: any, _args: any) {
        const count = await OperatorModel.countDocuments(_args);
        return count;
      },
      async operators (_parent: any, _args: any) {
        const lists = await OperatorModel.find();
        return lists;
      },
      async operator (_parent: any, _args: any) {
        const result = await OperatorModel.findOne({username: _args.username});
        return result;
      }
    },
    Mutation: {
        async postOperator(_parent: any, _args: any) {
          const newData = {
            ..._args.input,
          }
          let result;
          await OperatorModel.create(newData)
          .then(() => {
            result = {message:"Successfully created."}
          })
          .catch((error) => {
            result = {message:error._message};
          });
          return result;
        },
        async updateOperator(_parent: any, _args: any) {
          const updateData = {
            ..._args.input,
          }
          let newOperator
          let _path = path.join(path.resolve(), updateData.profileImage)
          if (fs.existsSync(_path)) {
            var fileName = path.basename(_path)
            let fileType = path.extname(fileName)
            const newFileName = _args.username + Date.now() + fileType
            var newPath = path.join(path.resolve(), `${process.env.UPLOAD_PROFILE_DIR}${newFileName}`)
            newOperator = {
              ...updateData,
              profileImage:`${process.env.UPLOAD_PROFILE_DIR}${newFileName}`,
            }
            fs.rename(_path, newPath, function (err) {
              if (err) throw err
              // delete temp directory
              fs.rm(path.dirname(_path), { recursive: true }, (err) => {});              
            })
          }else{
            
          }
          if (await OperatorModel.findOne({username: _args.username})) {
            let results;
            await OperatorModel.findOneAndUpdate({username:_args.username}, newOperator, {new: true})
            .then((result) => {
                results = result;
            }).catch((error) => {
              results = null;
            });
            return results;
          }else{
            let results;
            await OperatorModel.create(newOperator)
            .then((result) => {
              results = result
            })
            .catch((error) => {
              results = null;
            });
            return results;
          }
        },
        async deleteOperator(_parent: any, _args: any) {
          let results;
          await OperatorModel.findOneAndDelete({username:_args.username})
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

export default operatorResolver;