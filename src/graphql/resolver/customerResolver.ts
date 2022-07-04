
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

        var pageNum:number = 0;
        if (_args.pageNum && _args.pageNum > 0) {
            pageNum = _args.pageNum - 1;
            return {lists:lists.slice(pageNum*Number(process.env.PAGE_PER_COUNT), (pageNum+1) * Number(process.env.PAGE_PER_COUNT)), totalCount:lists.length, perCount:Number(process.env.PAGE_PER_COUNT)};
        }else{
          return {lists, totalCount:lists.length, perCount:Number(process.env.PAGE_PER_COUNT)};
        }
        
      },
      
      async customer (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await CustomerModel.findOne({customerId: _args.customerId});
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
              // const newFileName = Date.now() + fileType
              const newFileName = (await global.generateRandomString(8)) + fileType;
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
            result = {message:"Successfully created.", _id:res._id};
            // result = res;
          })
          .catch((error:any) => {
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
          let newCustomer
          if (updateData.profileImage){
            let _path = path.join(path.resolve(), updateData.profileImage)
            if (fs.existsSync(_path)) {
              var fileName = path.basename(_path)
              var fileType = path.extname(fileName)
              const newFileName = (await global.generateRandomString(8)) + fileType;
              const customerDirPath = `${process.env.UPLOAD_CLIENT_PROFILE_DIR}`
              fs.mkdirSync(path.join(path.resolve(), customerDirPath), { recursive: true });
              var newPath = path.join(path.resolve(), `${customerDirPath}${newFileName}`)
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
                lastAccess:Date.now(),
              }
            }
          }else{
            newCustomer = {
              ...updateData,
              lastAccess:Date.now(),              
            }
          }

          if (await CustomerModel.findOne({customerId: _args.customerId})) {
            let results;
            await CustomerModel.findOneAndUpdate({customerId:_args.customerId}, newCustomer, {new: true})
            .then((result:any) => {
                results = result;
            }).catch((error:any) => {
              results = null;
            });
            return results;
          }else{
            let results;
            await CustomerModel.create(newCustomer)
            .then((result:any) => {
              results = result
            })
            .catch((error:any) => {
              results = null;
            });
            return results;
          }
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