
var ObjectId = require('mongodb').ObjectId

const dailysurveyResolver = {
    Query: {
      async daliySurveyCount (parent, args, { db }) {
        return db.collection(`DailySurvey`).estimatedDocumentCount()
      },
      async daliySurveys (parent, args, {db}) {
        return db.collection(`DailySurvey`).find().toArray()
      },
      async daliySurvey (parent, args, {db}) {
        let subscriptions = await db.collection(`DailySurvey`).find().toArray()
        return subscriptions.find((row) => row._id == args._id)
      }
    },
    Mutation: {
        async postDailySurvey(parent, args, { db }) {
          const newDailySurvey = {
            ...args.input,
          }
          const createResult = await db.collection(`DailySurvey`).insertOne(newDailySurvey)
          if (!createResult.WriteError){
            return {message:"Successfully created new daliySurvey."}
          }
          return {message:"A problem occurred during creation."}
        },
        async updateDailySurvey(parent, args, {db}) {
          const updateDailySurvey = {
            ...args.input,
          }
          const result = await db.collection(`DailySurvey`).update({_id:ObjectId(args._id)}, {$set:updateDailySurvey})
          if (result.writeError){
            return {message:result.writeError}
          }
          let dailySurveys = await db.collection(`DailySurvey`).find().toArray()
          return dailySurveys.find((row) => row._id == args._id)
        },
        async deleteDailySurvey(parent, args, {db}) {
          let deleteResult = await db.collection(`DailySurvey`).deleteOne({_id:ObjectId(args._id)})
          if (deleteResult.deletedCount > 0){
            return {message:"Successfully deleted."}
          }
          return {message:"Delete failed."}
        }
    }
}

module.exports = dailysurveyResolver