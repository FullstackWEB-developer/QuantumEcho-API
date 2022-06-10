
var ObjectId = require('mongodb').ObjectId

const projectResolver = {
    Query: {
      async projectCount (parent, args, { db }) {
        return db.collection(`Project`).estimatedDocumentCount()
      },
      async projects (parent, args, {db}) {
        return db.collection(`Project`).find().toArray()
      },
      async project (parent, args, {db}) {
        let projects = await db.collection(`Project`).find().toArray()
        return projects.find((row) => row._id == args._id)
      }
    },
    Mutation: {
        async postProject(parent, args, { db }) {
          const newProject = {
            ...args.input,
          }
          const createResult = await db.collection(`Project`).insertOne(newProject)
          if (!createResult.WriteError){
            return {message:"Successfully created new project."}
          }
          return {message:"A problem occurred during creation."}
        },
        async updateProject(parent, args, {db}) {
          const updateProject = {
            ...args.input,
          }
          const result = await db.collection(`Project`).update({_id:ObjectId(args._id)}, {$set:updateProject})
          if (result.writeError){
            return {message:result.writeError}
          }
          let projects = await db.collection(`Project`).find().toArray()
          return projects.find((row) => row._id == args._id)
        },
        async deleteProject(parent, args, {db}) {
          let deleteResult = await db.collection(`Project`).deleteOne({_id:ObjectId(args._id)})
          if (deleteResult.deletedCount > 0){
            return {message:"Successfully deleted."}
          }
          return {message:"Delete failed."}
        }
    }
}

module.exports = projectResolver