
import { ObjectId } from 'mongodb';

const customerResolver = {
    Query: {
      async customerCount (parent, args, { db }) {
        return await db.collection(`Customer`).estimatedDocumentCount()
      },
      async customers (parent, args, {db}) {
        return await db.collection(`Customer`).find().toArray()
      },
      async customer (parent, args, {db}) {
        let customers = await db.collection(`Customer`).find().toArray()
        return customers.find((row) => row._id == args._id)
      }
    },
    Mutation: {
        async postCustomer(parent, args, { db }) {
          const newCustomer = {
            ...args.input,
          }
          console.log("🚀 ~ file: customerResolver.js ~ line 21 ~ postCustomer ~ newCustomer", newCustomer)
          const createResult = await db.collection(`Customer`).insertOne(newCustomer)
          if (!createResult.WriteError){
            return {message:"Successfully created new Customer."}
          }
          return {message:"A problem occurred during creation."}
        },
        async updateCustomer(parent, args, {db}) {
          const updateCustomer = {
            ...args.input,
          }
          const updateResult = await db.collection(`Customer`).update({_id:ObjectId(args._id)}, {$set:updateCustomer})
          if (updateResult.writeError){
            return {message:updateResult.writeError}
          }
          let customers = await db.collection(`Customer`).find().toArray()
          console.log("🚀 ~ file: customerResolver.js ~ line 39 ~ updateCustomer ~ customers", customers)
          return customers.find((row) => row._id == args._id)
        },
        async deleteCustomer(parent, args, {db}) {
          let deleteResult = await db.collection(`Customer`).deleteOne({_id:ObjectId(args._id)})
          if (deleteResult.deletedCount > 0){
            return {message:"Successfully deleted."}
          }
          return {message:"Delete failed."}
        }
    }
}

export default customerResolver;
// module.exports = customerResolver