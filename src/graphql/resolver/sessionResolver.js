
var ObjectId = require('mongodb').ObjectId

const sessionResolver = {
    Query: {
      async sessionCount (parent, args, { db }) {
        return db.collection(`Session`).estimatedDocumentCount()
      },
      async sessions (parent, args, {db}) {
        return db.collection(`Session`).find().toArray()
      },
      async session (parent, args, {db}) {
        let sessions = await db.collection(`Session`).find().toArray()
        return sessions.find((row) => row._id == args._id)
      }
    },
    Mutation: {
        async postSession(parent, args, { db }) {
          const newSession = {
            ...args.input,
          }
          const createResult = await db.collection(`Session`).insertOne(newSession)
          if (!createResult.WriteError){
            return {message:"Successfully created new session."}
          }
          return {message:"A problem occurred during creation."}
        },
        async updateSession(parent, args, {db}) {
          const updateSession = {
            ...args.input,
          }
          const result = await db.collection(`Session`).update({_id:ObjectId(args._id)}, {$set:updateSession})
          if (result.writeError){
            return {message:result.writeError}
          }
          let sessions = await db.collection(`Session`).find().toArray()
          return sessions.find((row) => row._id == args._id)
        },
        async deleteSession(parent, args, {db}) {
          let deleteResult = await db.collection(`Session`).deleteOne({_id:ObjectId(args._id)})
          if (deleteResult.deletedCount > 0){
            return {message:"Successfully deleted."}
          }
          return {message:"Delete failed."}
        }
    }
}

module.exports = sessionResolver