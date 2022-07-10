import { AdminModel } from "../../models/dbmodel";
const global = require('../../global');
import fs from 'fs';
import path from 'path';

const adminResolver = {
    Query: {
      async adminCount (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const count = await AdminModel.countDocuments(_args);
        return count;
      },
      async admins (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const lists = await AdminModel.find();
        return lists;
      },
      async adminById (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await AdminModel.findById(_args._id);
        return result;
      },
      async adminByCognitoId (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await AdminModel.findOne({adminId:_args.cognitoId});
        return result;
      }
    },
    Mutation: {
        async postAdmin(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const postData = {
            ..._args.input,
          }

          let newData;
          if (postData.profileImage){
            let _path = path.join(path.resolve(), postData.profileImage);
            if (fs.existsSync(_path)) {
              var fileName = path.basename(_path);
              let fileType = path.extname(fileName);
              const newFileName = (await global.generateRandomString(8)) + fileType;
              const clientDirPath = '/public/uploads/profiles/admin/';
              fs.mkdirSync(path.join(path.resolve(), clientDirPath), { recursive: true });
              var newPath = path.join(path.resolve(), `${clientDirPath}${newFileName}`);
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
          await AdminModel.create(newData)
          .then((res) => {
            result = res;
          })
          .catch((error:any) => {
            result = null;
          });
          return result;
        },

        async updateAdmin(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const updateData = {
            ..._args.input,
          }          
          let newCustomer;
          if (updateData.profileImage){
            let _path = path.join(path.resolve(), updateData.profileImage)
            if (fs.existsSync(_path)) {
              var fileName = path.basename(_path);
              var fileType = path.extname(fileName);
              const newFileName = (await global.generateRandomString(8)) + fileType;
              const customerDirPath = '/public/uploads/profiles/admin/';
              fs.mkdirSync(path.join(path.resolve(), customerDirPath), { recursive: true });
              var newPath = path.join(path.resolve(), `${customerDirPath}${newFileName}`);
              newCustomer = {
                ...updateData,
                profileImage:`${customerDirPath}${newFileName}`,
              }
              fs.rename(_path, newPath, function (err) {
                if (err) throw err
                // delete temp directory
                fs.rm(path.dirname(_path), { recursive: true }, (err) => {});              
              })
            }else{
              newCustomer = {
                ...updateData,
              }
            }
          }else{
            newCustomer = {
              ...updateData,           
            }
          }
          
          let results;
          await AdminModel.findOneAndUpdate({_id:_args._id}, newCustomer, {new: true})
          .then((result:any) => {
              results = result;
          }).catch((error:any) => {
            results = null;
          });
          return results;
        },

        async deleteAdmin(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          let results;
          await AdminModel.findOneAndDelete({_id:_args._id})
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

export default adminResolver;