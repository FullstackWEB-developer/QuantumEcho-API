
var ObjectId = require('mongodb').ObjectId

const transactionResolver = {
    Query: {
      async transactionCount (parent, args, { db }) {
        return db.collection(`Transaction`).estimatedDocumentCount()
      },
      async transactions (parent, args, {db}) {
        return db.collection(`Transaction`).find().toArray()
      },
      async transaction (parent, args, {db}) {
        let transactions = await db.collection(`Transaction`).find().toArray()
        return transactions.find((row) => row._id == args._id)
      }
    },
    Mutation: {
        async postTransaction(parent, args, { db }) {
          const newTransaction = {
            ...args.input,
          }
          const createResult = await db.collection(`Transaction`).insertOne(newTransaction)
          if (!createResult.WriteError){
            return {message:"Successfully created new transaction."}
          }
          return {message:"A problem occurred during creation."}
        },
        async updateTransaction(parent, args, {db}) {
          const updateTransaction = {
            ...args.input,
          }
          const result = await db.collection(`Transaction`).update({_id:ObjectId(args._id)}, {$set:updateTransaction})
          if (result.writeError){
            return {message:result.writeError}
          }
          let transactions = await db.collection(`Transaction`).find().toArray()
          return transactions.find((row) => row._id == args._id)
        },
        async deleteTransaction(parent, args, {db}) {
          let deleteResult = await db.collection(`Transaction`).deleteOne({_id:ObjectId(args._id)})
          if (deleteResult.deletedCount > 0){
            return {message:"Successfully deleted."}
          }
          return {message:"Delete failed."}
        }
    }
}

module.exports = transactionResolver