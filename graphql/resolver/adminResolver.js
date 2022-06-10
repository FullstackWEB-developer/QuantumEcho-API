
var ObjectId = require('mongodb').ObjectId

const adminResolver = {
    Query: {
      async adminCount (parent, args, { db }) {
        return db.collection(`Admin`).estimatedDocumentCount()
      },
      async admins (parent, args, {db}) {
        return db.collection(`Admin`).find().toArray()
      },
      async admin (parent, args, {db}) {
        let users = await db.collection(`Admin`).find().toArray()
        return users.find((row) => row._id == args._id)
      }
    },
    Mutation: {
        async postAdmin(parent, args, { db }) {
          const newAdmin = {
            ...args.input,
          }
          const createResult = await db.collection(`Admin`).insertOne(newAdmin)
          if (!createResult.WriteError){
            return {message:"Successfully created new admin."}
          }
          return {message:"A problem occurred during creation."}
        },
        async updateAdmin(parent, args, {db}) {
          const updateAdmin = {
            ...args.input,
          }
          const result = await db.collection(`Admin`).update({_id:ObjectId(args._id)}, {$set:updateAdmin})
          if (result.writeError){
            return {message:result.writeError}
          }
          let admins = await db.collection(`Admin`).find().toArray()
          return admins.find((row) => row._id == args._id)
        },
        async deleteAdmin(parent, args, {db}) {
          let deleteResult = await db.collection(`Admin`).deleteOne({_id:ObjectId(args._id)})
          if (deleteResult.deletedCount > 0){
            return {message:"Successfully deleted."}
          }
          return {message:"Delete failed."}
        }
    }
}

module.exports = adminResolver