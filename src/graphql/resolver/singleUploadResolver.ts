
import fs from 'fs';
import path from 'path';
const global = require('../../global');

const singleUploadResolver = {
  Query: {
    async otherFields (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
      return true;
    }
  },
  Mutation: {
      async singleUpload(_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);      
        const filename = _args.filename
        const username = _args.username
        const imgPath = `${process.env.UPLOAD_TEMP_DIR}${username}`
        fs.mkdirSync(path.join(path.resolve(), imgPath), { recursive: true });
        const base64Data = _args.base64Str.replace("data:"+_args.type+";base64,", "")
        const pathName = path.join(path.resolve(), `${imgPath}/${filename}`)

        fs.writeFile(pathName, base64Data, 'base64', (err) => {
          console.log("File Upload Error >>>> ", err);
          if (err) throw new Error('File Upload Error');
        });
        return { filePath:`${imgPath}/${filename}` };
      },
    },
}

export default singleUploadResolver;