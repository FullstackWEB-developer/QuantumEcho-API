
// var ObjectId = require('mongodb').ObjectId
import { ObjectId } from 'mongodb';

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
          const result = await db.collection(`Operator`).update({_id:ObjectId(args._id)}, {$set:updateOperator})
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