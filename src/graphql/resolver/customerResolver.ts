
import {CustomerModel} from "../../models/dbmodel";
const global = require('../../global');

import fs from 'fs';
import path from 'path';

const customerResolver = {
    Query: {
      async customerCount (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const count = await CustomerModel.countDocuments(_args);
        return count;
      },
      async customers (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const lists = await CustomerModel.find();
        return lists;
      },
      async customer (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await CustomerModel.findOne({_id: _args._id});
        return result;
      }
    },
    Mutation: {
        async postCustomer(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const postData = {
            ..._args.input,
          }
          
          let newData
          if (postData.profileImage){
            let _path = path.join(path.resolve(), postData.profileImage)
            if (fs.existsSync(_path)) {
              var fileName = path.basename(_path)
              let fileType = path.extname(fileName)
              const newFileName = Date.now() + fileType
              const clientDirPath = `${process.env.UPLOAD_CLIENT_PROFILE_DIR}`
              fs.mkdirSync(path.join(path.resolve(), clientDirPath), { recursive: true });
              var newPath = path.join(path.resolve(), `${clientDirPath}${newFileName}`)
              newData = {
                ...postData,
                profileImage:`${clientDirPath}${newFileName}`,
              }
              fs.rename(_path, newPath, function (err) {
                if (err) throw err
                // delete temp directory
                fs.rm(path.dirname(_path), { recursive: true }, (err) => {});              
              })
            }else{
              newData = {
                ...postData,
              }
            }
          }else{
            newData = {
              ...postData,
            }
          }
          let result;
          await CustomerModel.create(newData)
          .then((res:any) => {
            console.log("🚀 ~ file: customerResolver.ts ~ line 32 ~ .then ~ res", res)
            result = {message:"Successfully created.", _id:res._id};
            // result = res;
          })
          .catch((error:any) => {
            console.log("🚀 ~ file: customerResolver.ts ~ line 37 ~ postCustomer ~ error", error)
            result = {message:error._message};
            // result = null;
          });
          return result;
        },
        async updateCustomer(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const updateData = {
            ..._args.input,
          }
          let results;
          await CustomerModel.findOneAndUpdate({_id:_args._id}, updateData, {new: true})
          .then((result:any) => {
              results = result;
          }).catch((error:any) => {
            results = null;
          });
          return results;
        },
        async deleteCustomer(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          let results;
          await CustomerModel.findOneAndDelete({_id:_args._id})
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

export default customerResolver;