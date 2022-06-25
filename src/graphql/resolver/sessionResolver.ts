import {SessionModel} from "../../models/dbmodel";
const global = require('../../global');
import path from 'path';
import fs from 'fs';

const sessionResolver = {
    Query: {
      async sessionCount (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const count = await SessionModel.countDocuments(_args);
        return count;
      },

      async sessions (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const lists = await SessionModel.find();

        var pageNum:number = 0;
        if (_args.pageNum && _args.pageNum > 0) {
          pageNum = _args.pageNum - 1;
          return {lists:lists.slice(pageNum*Number(process.env.PAGE_PER_COUNT), (pageNum+1) * Number(process.env.PAGE_PER_COUNT)), totalCount:lists.length, perCount:Number(process.env.PAGE_PER_COUNT)};
        }
        return {lists:lists, totalCount:lists.length, perCount:Number(process.env.PAGE_PER_COUNT)};
      },

      async session (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await SessionModel.findOne({_id: _args._id});
        return result;
      }
    },

    Mutation: {

        async postSession(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);          
          
          const interviewImages = _args.input.interview && _args.input.interview.repeptorImages ? _args.input.interview.repeptorImages : null;
          const repeptorImages:string[] = [];
          if (interviewImages) {
            await Promise.all(              
              interviewImages.map(async(row:string) => {
                const tempFilePath = path.join(path.resolve(), row)
                if (tempFilePath.includes(`${process.env.UPLOAD_DIR}repeptors/`)){
                  repeptorImages.push(row);
                }else{
                  if (fs.existsSync(tempFilePath)) {
                    const fileName = path.basename(tempFilePath)
                    const fileType = path.extname(fileName)
                    const newFileName = (await global.generateRandomString(8)) + fileType;  
                    const repeptorDirPath = `${process.env.UPLOAD_DIR}repeptors/`;
                    await fs.mkdirSync(path.join(path.resolve(), repeptorDirPath), { recursive: true });
                    var newPath = path.join(path.resolve(), `${repeptorDirPath}${newFileName}`)
                    await fs.rename(tempFilePath, newPath, function (err) {
                      // delete temp directory
                      fs.rm(path.dirname(tempFilePath), { recursive: true }, (err) => {});              
                    })
                    repeptorImages.push(`${repeptorDirPath}${newFileName}`);
                  }
                }
              })
            );
          }

          const newData = {
            ..._args.input, interview:{..._args.input.interview, repeptorImages}
          }

          let results;
          await SessionModel.create(newData)
          .then(async (result: any) => {
            results = result;
          })
          .catch((error) => {
            results = null;
            throw new Error(error._message);
          });
          return results;
        },

        async updateSession(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);

          const interviewImages = _args.input.interview && _args.input.interview.repeptorImages ? _args.input.interview.repeptorImages : null;
          const repeptorImages:string[] = [];
          if (interviewImages) {
            await Promise.all(              
              interviewImages.map(async(row:string) => {
                if (row.includes(`${process.env.UPLOAD_TEMP_DIR}`)){
                  const tempFilePath = path.join(path.resolve(), row)
                  if (fs.existsSync(tempFilePath)) {
                    const fileName = path.basename(tempFilePath)
                    const fileType = path.extname(fileName)
                    const newFileName = (await global.generateRandomString(8)) + fileType;  
                    const repeptorDirPath = `${process.env.UPLOAD_DIR}repeptors/`;
                    await fs.mkdirSync(path.join(path.resolve(), repeptorDirPath), { recursive: true });
                    var newPath = path.join(path.resolve(), `${repeptorDirPath}${newFileName}`)
                    await fs.rename(tempFilePath, newPath, function (err) {
                      // delete temp directory
                      fs.rm(path.dirname(tempFilePath), { recursive: true }, (err) => {});              
                    })
                    repeptorImages.push(`${repeptorDirPath}${newFileName}`);
                  }
                }else{                  
                  repeptorImages.push(row);
                }
              })
            );
          }

          const newData = {
            ..._args.input, interview:{..._args.input.interview, repeptorImages}
          }
          
          let results;
          await SessionModel.findOneAndUpdate({_id:_args._id}, newData, {new: true})
          .then((result) => {
            results = result;
          }).catch((error) => {
            results = error
            throw new Error(error._message);
          });
          return results;
        },

        async deleteSession(_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
          let results;
          await SessionModel.findOneAndDelete({_id:_args._id})
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

export default sessionResolver;