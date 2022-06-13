
// var ObjectId = require('mongodb').ObjectId
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

const operatorResolver = {
    Query: {
      async operatorCount (parent, args, { db }) {
        return db.collection(`Operator`).estimatedDocumentCount()
      },
      async operators (parent, args, {db}) {
        return db.collection(`Operator`).find().toArray()
      },
      async operator (parent, args, {db}) {
        let operators = await db.collection(`Operator`).find().toArray()
        return operators.find((row) => row._id == args._id)
      }
    },
    Mutation: {
        async postOperator(parent, args, { db }) {
          const newOperator = {
            ...args.input,
          }
          const createResult = await db.collection(`Operator`).insertOne(newOperator)
          if (!createResult.WriteError){
            return {message:"Successfully created new operator."}
          }
          return {message:"A problem occurred during creation."}
        },
        async updateOperator(parent, args, {db}) {          
          const updateOperator = {
            ...args.input,
          }
          console.log("🚀 ~ file: operatorResolver.js ~ line 34 ~ updateOperator ~ updateOperator", updateOperator)
          let newOperator
          let _path = path.join(path.resolve(), updateOperator.profileImage)
          if (fs.existsSync(_path)) {
            var fileName = path.basename(_path)
            console.log("🚀 ~ file: operatorResolver.js ~ line 38 ~ updateOperator ~ fileName", fileName)
            let fileType = path.extname(fileName)
            console.log("🚀 ~ file: operatorResolver.js ~ line 40 ~ updateOperator ~ fileType", fileType)
            const newFileName = args._id + fileType
            console.log("🚀 ~ file: operatorResolver.js ~ line 42 ~ updateOperator ~ newFileName", newFileName)
            var newPath = path.join(path.resolve(), `public/uploads/${newFileName}`)
            console.log("🚀 ~ file: operatorResolver.js ~ line 44 ~ updateOperator ~ newPath", newPath)
            newOperator = {
              ...updateOperator,
              profileImage:`/public/uploads/${newFileName}`,
            }
            fs.rename(_path, newPath, function (err) {
              if (err) throw err
              // delete temp directory
              fs.rm(path.dirname(_path), { recursive: true }, (err) => {
              if (err) console.log("🚀 ~ file: operatorResolver.js ~ line 50 ~ fs.rmdir ~ err", err)
              });
              
            })
          }else{
            
          }
          console.log("🚀 ~ file: operatorResolver.js ~ line 54 ~ newOperator", newOperator)

          const result = await db.collection(`Operator`).update({_id:ObjectId(args._id)}, {$set:newOperator})
          if (result.writeError){
            return {message:result.writeError}
          }
          let operators = await db.collection(`Operator`).find().toArray()
          return operators.find((row) => row._id == args._id)
        },
        async deleteOperator(parent, args, {db}) {
          let deleteResult = await db.collection(`Operator`).deleteOne({_id:ObjectId(args._id)})
          if (deleteResult.deletedCount > 0){
            return {message:"Successfully deleted."}
          }
          return {message:"Delete failed."}
        }
    }
}

export default operatorResolver;
// module.exports = operatorResolver