import { ObjectId } from 'mongodb';

const userResolver = {
    Query: {
      async userCount (parent, args, { db }) {
        return db.collection(`User`).estimatedDocumentCount()
      },
      async users (parent, args, {db}) {
        return db.collection(`User`).find().toArray()
      },
      async user (parent, args, {db}) {
        let users = await db.collection(`User`).find().toArray()
        return users.find((row) => row._id == args.userId)
      }
    },
    Mutation: {
        async postUser(parent, args, { db }) {
          const newUser = {
            ...args.input,
          }
          const createResult = await db.collection(`User`).insertOne(newUser)
          if (!createResult.WriteError){
            return {message:"Successfully created new user."}
          }
          return {message:"A problem occurred during creation."}
        },
        async updateUser(parent, args, {db}) {
          const updateUser = {
            ...args.input,
          }
          const result = await db.collection(`User`).update({_id:ObjectId(args.userId)}, {$set:updateUser})
          if (result.writeError){
            return {message:result.writeError}
          }
          let users = await db.collection(`User`).find().toArray()
          return users.find((row) => row._id == args.userId)
        },
        async deleteUser(parent, args, {db}) {
          let deleteResult = await db.collection(`User`).deleteOne({_id:ObjectId(args.userId)})
          if (deleteResult.deletedCount > 0){
            return {message:"Successfully deleted."}
          }
          return {message:"Delete failed."}
        }
    }
}

export default userResolver;
// module.exports = userResolver