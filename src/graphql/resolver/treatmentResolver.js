
import { ObjectId } from 'mongodb';

const treatmentResolver = {
    Query: {
      async treatmentCount (parent, args, { db }) {
        return db.collection(`Treatment`).estimatedDocumentCount()
      },
      async treatments (parent, args, {db}) {
        return db.collection(`Treatment`).find().toArray()
      },
      async treatment (parent, args, {db}) {
        let treatments = await db.collection(`Treatment`).find().toArray()
        return treatments.find((row) => row._id == args._id)
      }
    },
    Mutation: {
        async postTreatment(parent, args, { db }) {
          const newData = {
            ...args.input,
          }
          const createResult = await db.collection(`Treatment`).insertOne(newData)
          if (!createResult.WriteError){
            return {message:"Successfully created new treatment."}
          }
          return {message:"A problem occurred during creation."}
        },
        async updateTreatment(parent, args, {db}) {
          const updateData = {
            ...args.input,
          }
          const result = await db.collection(`Treatment`).update({_id:ObjectId(args._id)}, {$set:updateData})
          if (result.writeError){
            return {message:result.writeError}
          }
          let treatments = await db.collection(`Treatment`).find().toArray()
          return treatments.find((row) => row._id == args._id)
        },
        async deleteTreatment(parent, args, {db}) {
          let deleteResult = await db.collection(`Treatment`).deleteOne({_id:ObjectId(args._id)})
          if (deleteResult.deletedCount > 0){
            return {message:"Successfully deleted."}
          }
          return {message:"Delete failed."}
        }
    }
}

export default treatmentResolver;
// module.exports = treatmentResolver