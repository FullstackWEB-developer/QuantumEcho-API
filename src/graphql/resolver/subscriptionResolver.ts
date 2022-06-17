import {SubscriptionModel} from "../../models/dbmodel";

const subscriptionResolver = {
    Query: {
      async subscriptionCount (_parent: any, _args: any) {
        const count = await SubscriptionModel.countDocuments(_args);
        return count;
      },
      async subscriptions (_parent: any, _args: any) {
        const lists = await SubscriptionModel.find({creator:_args.creator});
        return lists;
      },
      async subscription (_parent: any, _args: any) {
        const result = await SubscriptionModel.findOne({_id: _args._id});
        return result;
      }
    },
    Mutation: {
        async postSubscription(_parent: any, _args: any) {
          const newData = {
            ..._args.input,
          }
          console.log("🚀 ~ file: subscriptionResolver.ts ~ line 22 ~ postSubscription ~ newData", newData)
          let result;
          await SubscriptionModel.create(newData)
          .then(() => {
            result = {message:"Successfully created."}
          })
          .catch((error) => {
            console.log("🚀 ~ file: subscriptionResolver.ts ~ line 30 ~ postSubscription ~ error", error)
            result = {message:error._message};
          });
          return result;
        },
        async updateSubscription(_parent: any, _args: any) {
          const updateData = {
            ..._args.input,
          }
          let results;
          await SubscriptionModel.findOneAndUpdate({_id:_args._id}, updateData, {new: true})
          .then((result) => {
              results = result;
          }).catch((error) => {
            results = null;
          });
          return results;
        },
        async deleteSubscription(_parent: any, _args: any) {
          let results;
          await SubscriptionModel.findOneAndDelete({_id:_args._id})
          .then((result) => {
              results = {message:"Successfully deleted."};              
          })
          .catch((error) => {
              results = {message:error._message}
          });
          return results;
        }
    }
}

export default subscriptionResolver;