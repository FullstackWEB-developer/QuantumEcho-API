import {SubscribModel} from "../../models/dbmodel";
import {ModuleModel} from "../../models/dbmodel"; 
const global = require('../../global');

import fs from 'fs';
import path from 'path';

const subscribResolver = {
    Query: {
      async subscribCount (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const count = await SubscribModel.countDocuments(_args);
        return count;
      },

      async subscribs (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const lists = await SubscribModel.find(_args.condition).populate('features').populate('creator').sort({'createdAt':'desc'});        
        
        var pageNum:number = 0;
        if (_args.pageNum && _args.pageNum > 0) {
          pageNum = _args.pageNum - 1;
          return {lists:lists.slice(pageNum*Number(process.env.PAGE_PER_COUNT), (pageNum+1) * Number(process.env.PAGE_PER_COUNT)), totalCount:lists.length, perCount:Number(process.env.PAGE_PER_COUNT)};
        }
        return {lists:lists, totalCount:lists.length, perCount:Number(process.env.PAGE_PER_COUNT)};
      },

      async subscrib (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await SubscribModel.findOne({_id: _args._id}) as any;
        if (result) {
          const moduleData = await ModuleModel.findOne({_id: result.features});
          if (moduleData) {
            result.features = moduleData
          }
        }
        
        return result;
      }
    },
    Mutation: {
        async postSubscrib(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const postData = {
            ..._args.input,
          }

          let newData
          if (postData.coverImage){
            let _path = path.join(path.resolve(), postData.coverImage)
            if (fs.existsSync(_path)) {
              var fileName = path.basename(_path)
              let fileType = path.extname(fileName)
              const newFileName = (await global.generateRandomString(8)) + fileType;
              const clientDirPath = `${process.env.UPLOAD_SUBSCRIPTION_DIR}`
              fs.mkdirSync(path.join(path.resolve(), clientDirPath), { recursive: true });
              var newPath = path.join(path.resolve(), `${clientDirPath}${newFileName}`)
              newData = {
                ...postData,
                coverImage:`${clientDirPath}${newFileName}`,
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
          await SubscribModel.create(newData)
          .then(() => {
            result = {message:"Successfully created."}
          })
          .catch((error) => {
            result = {message:error._message};
          });
          return result;
        },

        async updateSubscrib(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const postData = {
            ..._args.input,
          }          

          let newData
          if (postData.coverImage){
            let _path = path.join(path.resolve(), postData.coverImage)
            if (fs.existsSync(_path)) {
              var fileName = path.basename(_path)
              let fileType = path.extname(fileName)
              const newFileName = (await global.generateRandomString(8)) + fileType;
              const clientDirPath = `${process.env.UPLOAD_SUBSCRIPTION_DIR}`
              fs.mkdirSync(path.join(path.resolve(), clientDirPath), { recursive: true });
              var newPath = path.join(path.resolve(), `${clientDirPath}${newFileName}`)
              newData = {
                ...postData,
                coverImage:`${clientDirPath}${newFileName}`,
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

          let results;
          await SubscribModel.findOneAndUpdate({_id:_args._id}, newData, {new: true})
          .then((result) => {
              results = result;
          }).catch((error) => {
            results = null;
          });
          return results;
        },
        async deleteSubscrib(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          let subscribeData = await SubscribModel.findOne({_id:_args._id});
          if (subscribeData && subscribeData.coverImage){
            var coverImagePath = path.join(path.resolve(), subscribeData.coverImage);
            fs.unlinkSync(coverImagePath);
          }
          let results;
          await SubscribModel.findOneAndDelete({_id:_args._id})
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

export default subscribResolver;