
import fs from 'fs';
import path from 'path';
const global = require('../../global');

const uploadResolver = {
  Query: {
    async otherFields (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
      return true;
    }
  },
  Mutation: {
      async singleUpload(_parent: any, _args: any, { headers }: any) {
        if (_args.authCheck){
          await global.isAuthorization(headers);
        }      
        const filename = _args.filename
        const id = await global.generateRandomString(8);
        const imgPath = `${process.env.UPLOAD_TEMP_DIR}${id}`
        fs.mkdirSync(path.join(path.resolve(), imgPath), { recursive: true });
        const base64Data = _args.base64Str.replace("data:"+_args.type+";base64,", "")
        const pathName = path.join(path.resolve(), `${imgPath}/${filename}`)

        fs.writeFile(pathName, base64Data, 'base64', (err) => {
          if (err) throw new Error('File Upload Error');
        });
        return { filePath:`${imgPath}/${filename}` };
      },

      async deleteFile(_parent: any, _args: any, {headers}: any) {
        await global.isAuthorization(headers);
        const imagePath = path.join(path.resolve(), _args.imgPath);
        console.log("🚀 ~ file: uploadResolver.ts ~ line 33 ~ deleteFile ~ imagePath", imagePath)
        if (fs.existsSync(imagePath)) {
          fs.rm(path.dirname(imagePath), { recursive: true }, (err) => {
          });           
          return {message:"success"}
        }else{
          throw new Error('File not found');
        }
      },
    },
}

export default uploadResolver;