
import {TreatmentModel} from "../../models/dbmodel";

const treatmentResolver = {
    Query: {
      async treatmentCount (_parent: any, _args: any) {
        const count = await TreatmentModel.countDocuments(_args);
        return count;
      },
      async treatments (_parent: any, _args: any) {
        const lists = await TreatmentModel.find();
        return lists;
      },
      async treatment (_parent: any, _args: any) {
        const result = await TreatmentModel.findOne({_id: _args._id});
        return result;
      }
    },
    Mutation: {
        async postTreatment(_parent: any, _args: any) {
          const newData = {
            ..._args.input,
          }
          let result;
          await TreatmentModel.create(newData)
          .then(() => {
            result = {message:"Successfully created."}
          })
          .catch((error) => {
            result = {message:error._message};
          });
          return result;
        },
        async updateTreatment(_parent: any, _args: any) {
          const updateData = {
            ..._args.input,
          }
          let results;
          await TreatmentModel.findOneAndUpdate({_id:_args._id}, updateData, {new: true})
          .then((result) => {
              results = result;
          }).catch((error) => {
            results = null;
          });
          return results;
        },
        async deleteTreatment(_parent: any, _args: any) {
          let results;
          await TreatmentModel.findOneAndDelete({_id:_args._id})
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

export default treatmentResolver;