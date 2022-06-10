
var ObjectId = require('mongodb').ObjectId

const protocolResolver = {
    Query: {
      async protocolCount (parent, args, { db }) {
        return db.collection(`Protocol`).estimatedDocumentCount()
      },
      async protocols (parent, args, {db}) {
        return db.collection(`Protocol`).find().toArray()
      },
      async protocol (parent, args, {db}) {
        let protocols = await db.collection(`Protocol`).find().toArray()
        return protocols.find((row) => row._id == args._id)
      }
    },
    Mutation: {
        async postProtocol(parent, args, { db }) {
          const newProtocol = {
            ...args.input,
          }
          const createResult = await db.collection(`Protocol`).insertOne(newProtocol)
          if (!createResult.WriteError){
            return {message:"Successfully created new protocol."}
          }
          return {message:"A problem occurred during creation."}
        },
        async updateProtocol(parent, args, {db}) {
          const updateProtocol = {
            ...args.input,
          }
          const result = await db.collection(`Protocol`).update({_id:ObjectId(args._id)}, {$set:updateProtocol})
          if (result.writeError){
            return {message:result.writeError}
          }
          let projects = await db.collection(`Protocol`).find().toArray()
          return projects.find((row) => row._id == args._id)
        },
        async deleteProtocol(parent, args, {db}) {
          let deleteResult = await db.collection(`Protocol`).deleteOne({_id:ObjectId(args._id)})
          if (deleteResult.deletedCount > 0){
            return {message:"Successfully deleted."}
          }
          return {message:"Delete failed."}
        }
    }
}

module.exports = protocolResolver