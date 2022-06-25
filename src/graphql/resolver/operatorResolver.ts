import { OperatorModel } from "../../models/dbmodel";
const global = require('../../global');

import fs from 'fs';
import path from 'path';

const operatorResolver = {
    Query: {
      async operatorCount (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const count = await OperatorModel.countDocuments(_args);
        return count;
      },
      async operators (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const lists = await OperatorModel.find();
        return lists;
      },
      async operator (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await OperatorModel.findOne({operatorId: _args.operatorId}).populate('customers').populate('protocols');
        return result;
      }
    },
    Mutation: {
        async postOperator(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const newData = {
            ..._args.input,
          }
          let result;
          await OperatorModel.create(newData)
          .then(() => {
            result = {message:"Successfully created."}
          })
          .catch((error:any) => {
            result = {message:error._message};
          });
          return result;
        },
        
        async updateOperator(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const updateData = {
            ..._args.input,
          }
          let newOperator
          if (updateData.profileImage){
            let _path = path.join(path.resolve(), updateData.profileImage)
            if (fs.existsSync(_path)) {
              var fileName = path.basename(_path)
              var fileType = path.extname(fileName)
              // const newFileName = _args.operatorId + Date.now() + fileType
              const newFileName = (await global.generateRandomString(8)) + fileType;
              const operatorDirPath = `${process.env.UPLOAD_OPERATOR_PROFILE_DIR}`
              fs.mkdirSync(path.join(path.resolve(), operatorDirPath), { recursive: true });
              var newPath = path.join(path.resolve(), `${operatorDirPath}${newFileName}`)
              newOperator = {
                ...updateData,
                profileImage:`${operatorDirPath}${newFileName}`,
              }
              fs.rename(_path, newPath, function (err) {
                if (err) throw err
                // delete temp directory
                fs.rm(path.dirname(_path), { recursive: true }, (err) => {});              
              })
            }else{
              newOperator = {
                ...updateData,
              }
            }
          }else{
            newOperator = {
              ...updateData,
            }
          }
          if (await OperatorModel.findOne({operatorId: _args.operatorId})) {
            let results;
            await OperatorModel.findOneAndUpdate({operatorId:_args.operatorId}, newOperator, {new: true})
            .then((result:any) => {
                results = result;
            }).catch((error:any) => {
              results = null;
            });
            return results;
          }else{
            let results;
            await OperatorModel.create(newOperator)
            .then((result:any) => {
              results = result
            })
            .catch((error:any) => {
              results = null;
            });
            return results;
          }
        },
        async deleteOperator(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          let results;
          await OperatorModel.findOneAndDelete({operatorId:_args.operatorId})
          .then((result:any) => {
              results = {message:"Successfully deleted."};              
          })
          .catch((error:any) => {
              results = {message:error._message}
          });
          return results;
        }
    }
}

export default operatorResolver;