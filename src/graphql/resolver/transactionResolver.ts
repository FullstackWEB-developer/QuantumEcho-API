import {OperatorModel, TransactionModel, SubscribModel, StripeHistoryModel} from "../../models/dbmodel";
const global = require('../../global');
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const transactionResolver = {
    Query: {
      async transactionCount (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const count = await TransactionModel.countDocuments(_args);
        return count;
      },
      async transactions (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const lists = await TransactionModel.find();
        return lists;
      },
      async transaction (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await TransactionModel.findOne({_id: _args._id});
        return result;
      }
    },
    Mutation: {
        async postTransaction(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);

          const paymentIntentClientSecret = _args.input.paymentIntentClientSecret ? _args.input.paymentIntentClientSecret : '' ;
          const paymentIntent = _args.input.paymentIntent ? _args.input.paymentIntent : ''
          if (paymentIntentClientSecret === '' || paymentIntent === '') {
            throw new Error('Fake Payment!!!');
            return;
          }

          const subscribData = await SubscribModel.findOne({_id: _args.input.subscribs}).exec();
          if (!subscribData) {
            throw new Error('Param Error!!!');
            return;
          }

          const stripeHistory = await StripeHistoryModel.findOne({
            paymentId: paymentIntent,
            operatorId: _args.input.operatorBuyer,
            paymentIntentClientSecret: paymentIntentClientSecret
          }).exec();

          if (!stripeHistory) {
            throw new Error('Not found payment history!!!');
            return;
          }

          await StripeHistoryModel.findOneAndDelete({_id: stripeHistory._id}).exec();

          let results;
          // const oldData = await TransactionModel.findOne({operatorBuyer:_args.input.operatorBuyer}).exec();
          // if (oldData) {
          //   await TransactionModel.findOneAndUpdate(
          //     {_id:oldData._id},
          //     {$push:{subscribs:_args.input.subscribs}},
          //     { new: true, useFindAndModify: false }
          //   ).then(async(updateResult) => {
          //     await OperatorModel.findOneAndUpdate(
          //       {_id:_args.input.operatorBuyer},
          //       {$push:{store:_args.input.subscribs}},
          //       { new: true, useFindAndModify: false }
          //     );
          //     results = {message:"Successfully buy."};
          //   }).catch((updateError) => {  
          //     throw new Error(updateError._message);            
          //     // results = {message:updateError._message};
          //   });
          // }else{
            await TransactionModel.create({operatorBuyer:_args.input.operatorBuyer, subscribs:_args.input.subscribs, paymentIntentClientSecret, paymentIntent})
            .then(async(createResult) => {
              await OperatorModel.findOneAndUpdate(
                {_id:_args.input.operatorBuyer},
                {$push:{store:_args.input.subscribs}},
                { new: true, useFindAndModify: false }
              );
              results = {message:"Successfully buy."};
            }).catch((createError) => {
              throw new Error(createError._message);
              // results = {message:createError._message};
            });
          // }
          return results;
        },

        async updateTransaction(_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
          const updateData = {
            ..._args.input,
          }
          let results;
          await TransactionModel.findOneAndUpdate({_id:_args._id}, updateData, {new: true})
          .then((result) => {
              results = result;
          }).catch((error) => {
            results = null;
          });
          return results;
        },
        
        async deleteTransaction(_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
          let results;
          await TransactionModel.findOneAndDelete({_id:_args._id})
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

export default transactionResolver;