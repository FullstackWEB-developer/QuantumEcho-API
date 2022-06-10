
var ObjectId = require('mongodb').ObjectId

const subscriptionResolver = {
    Query: {
      async subscriptionCount (parent, args, { db }) {
        return db.collection(`Subscription`).estimatedDocumentCount()
      },
      async subscriptions (parent, args, {db}) {
        return db.collection(`Subscription`).find().toArray()
      },
      async subscription (parent, args, {db}) {
        let subscriptions = await db.collection(`Subscription`).find().toArray()
        return subscriptions.find((row) => row._id == args._id)
      }
    },
    Mutation: {
        async postSubscription(parent, args, { db }) {
          const newSubscription = {
            ...args.input,
          }
          const createResult = await db.collection(`Subscription`).insertOne(newSubscription)
          if (!createResult.WriteError){
            return {message:"Successfully created new subscription."}
          }
          return {message:"A problem occurred during creation."}
        },
        async updateSubscription(parent, args, {db}) {
          const updateSubscription = {
            ...args.input,
          }
          const result = await db.collection(`Subscription`).update({_id:ObjectId(args._id)}, {$set:updateSubscription})
          if (result.writeError){
            return {message:result.writeError}
          }
          let subscriptions = await db.collection(`Subscription`).find().toArray()
          return subscriptions.find((row) => row._id == args._id)
        },
        async deleteSubscription(parent, args, {db}) {
          let deleteResult = await db.collection(`Subscription`).deleteOne({_id:ObjectId(args._id)})
          if (deleteResult.deletedCount > 0){
            return {message:"Successfully deleted."}
          }
          return {message:"Delete failed."}
        }
    }
}

module.exports = subscriptionResolver