// import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { finished } from 'stream/promises';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';


const singleUploadResolver = {
    // Upload: GraphQLUpload,
    Mutation: {
        async singleUpload(parent, args, { db }) {
            console.log("🚀 ~ file: singleUploadResolver.js ~ line 12 ~ singleUpload ~ args", args.file)
            const { createReadStream, filename, mimetype, encording } = await args.file
            console.log("🚀 ~ file: singleUploadResolver.js ~ line 14 ~ filename", filename)

            const stream = createReadStream()      
            // fs.mkdirSync(path.join(__dirname, 'files'), { recursive: true });
            const pathName = path.join(__dirname, `/public/images/${filename}`)
            await stream.pipe(fs.createWriteStream(pathName))
      
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
      
          return { filename:pathName, mimetype, encoding };
        },
      },
}

export default singleUploadResolver;
// module.exports = singleUploadResolver