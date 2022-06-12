import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { finished } from 'stream/promises';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';


const singleUploadResolver = {
    Upload: GraphQLUpload,
    Mutation: {
        async singleUpload(parent, args, { db }) {
            const filename = args.filename
            const base64Data = args.base64Str.replace("data:"+args.type+";base64,", "")
            const pathName = path.join(path.resolve(), `/public/images/${args.filename}`)

            fs.writeFile(pathName, base64Data, 'base64', (err) => {
              console.log(err);
            });

            // const pathName = path.join(path.resolve(), `/public/images/out.png`)
            // await fs.writeFileSync(pathName, base64Data, 'base64')
            
            // const { createReadStream, filename, mimetype, encording } = await file
            // console.log("🚀 ~ file: singleUploadResolver.js ~ line 14 ~ filename", filename)

            // const stream = createReadStream()      
            // // fs.mkdirSync(path.join(__dirname, 'files'), { recursive: true });
            // const pathName = path.join(__dirname, `/public/images/${filename}`)
            // await stream.pipe(fs.createWriteStream(pathName))
      
        //   const output = fs.createWriteStream(
        //     path.join(
        //       __dirname,
        //       'files',
        //       `${randomBytes(6).toString('hex')}_${filename}`
        //     )
        //   );
      
        //   stream.pipe(output);
      
        //   await new Promise(function (resolve, reject) {
        //     output.on('close', () => {
        //       console.log('File uploaded');
        //       resolve();
        //     });
      
        //     output.on('error', (err) => {
        //       console.log(err);
        //       reject(err);
        //     });
        //   });
      
          return { filename:`/public/images/${args.filename}` };
        },
      },
}

export default singleUploadResolver;
// module.exports = singleUploadResolver