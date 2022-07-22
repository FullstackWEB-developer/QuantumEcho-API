import { OperatorModel } from "../../models/dbmodel";
const global = require('../../global');

import fs from 'fs';
import path from 'path';
import Customer from "../../models/customer";

const operatorResolver = {
    Query: {
      async operatorCount (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const count = await OperatorModel.countDocuments(_args);
        return count;
      },
      async operators (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const lists = await OperatorModel.find();
        return lists;
      },
      async operator (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await OperatorModel.findOne({operatorId: _args.operatorId}).populate('customers');
        return result;
      },
      async operatorById (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await OperatorModel.findById(_args._id)
        .populate({
          path:'store',
          populate:{
            path:'features'
          }
        });
        return result;
      },

      async operatorAggregates(_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);

        const nowDate = new Date().getTime();
        const onlineLimitStartDate = new Date(Number(nowDate-30*60*1000));
        const onlineLimitEndDate = new Date(Number(nowDate+30*60*1000));

        const operatorData = await OperatorModel.findOne({_id:_args._id})
        .populate('store').populate('customers').populate('protocols');
        const subscriptions = operatorData && operatorData.store ? operatorData.store?.length : 0;
        
        let online_clients: number = 0;
        operatorData?.customers?.map(async(customer:any) => {
          if (customer.lastAccess) {
            if (customer.lastAccess > onlineLimitStartDate && customer.lastAccess < onlineLimitEndDate) {
              online_clients ++;
            }
          }
        })
        

        // admin's general tab aggregates
        const general_aggregate = {
          user_from:'01/02/2019',
          subscriptions,
          current_credits:500,
          earned_credits:200,
        }

        // overview aggregate
        const subscriptions_aggregate = {
          online_clients,
          active_treatments:123,
          saved_sessions:1200,
          defined_protocols:1000,
        }

        // clients trend chart value
        const trend_aggregate = {
          series: [
            {
              name: '',
              data: [30, 35, 40, 50, 60, 70, 70, 80, 83, 86, 90, 100],
            },
          ],
          colors: ['#89DBF5'],
          categories:[],
        }

        const age_aggregate = {
          colors: ['#AE95FF', '#DDE2FF', '#F2F2F2', '#93949C'],
          labels: ['+ 60 years', '45 - 60 years', '30 - 45 years', '- 30 years'],
          values:[10, 30, 35, 25],
        }

        const sex_aggregate = {
          colors: ['#AE95FF', '#DDE2FF', '#93949C'],
          labels: ['Female', 'Male', 'Other'],
          values:[45, 30, 25],
        }

        const kingdom_aggregate = {
          colors: ['#AE95FF', '#DDE2FF', '#93949C'],
          labels: ['Animals', 'Vegetables', 'Other'],
          values:[50, 35, 15],
        }

        const weekly_aggregate = {
          series: [
            {
              name: 'Last Week',
              data: [44, 55, 57, 56, 61, 58, 79],
            },
            {
              name: 'This Week',
              data: [76, 85, 101, 98, 87, 105, 91],
            },
          ],
          colors: ['#7B85A8', '#89DBF5'],
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        }

        // Current users’ performance chart value
        const current_users_aggregate = {
          colors: ['#89dbf5'],
          labels: [],
          values:[40, 60], // first(40): Online, seconde(60): Active
        }

        //Current clients’ performance chart value
        const current_clients_aggregate = {
          colors: ['#8DEFA9', '#E7E26E', '#FF8B36', '#F97070'],
          labels: ['completed +75%', 'completed 50-75%', 'completed 30-50%', 'completed -30%'],
          values:[10, 30, 35, 25],
        }

        // Trend of treatments’ quality chart value
        const treatment_aggregate = {
          series: [
            {
              name: 'Positive answersPositive answers (from 6/10)',
              data: [31, 40, 28, 51, 42, 109, 100, 80],
            },
            {
              name: 'Negative answers (less than 6/10)',
              data: [11, 32, 45, 32, 34, 52, 41, 70],
            },
          ],
          colors: ['#8DEFA9', '#F97070'],
          categories: ['January', 'Febbruary', 'March', 'April', 'May', 'June', 'June', 'July']
        }

        const income_trend_aggregate = {
          series: [
            {
              name: '2021',
              data: [31, 40, 28, 51, 42, 109, 100, 80],
            },
            {
              name: '2022',
              data: [11, 32, 45, 32, 34, 52, 41, 70],
            },
          ],
          colors: ['#89DBF5', '#5c637f'],
          categories: ['January', 'Febbruary', 'March', 'April', 'May', 'June', 'June', 'July']
        }

        return {
          general_aggregate,
          subscriptions_aggregate,
          trend_aggregate,
          age_aggregate,
          sex_aggregate,
          kingdom_aggregate,
          weekly_aggregate,
          current_users_aggregate,
          current_clients_aggregate,
          treatment_aggregate,
          income_trend_aggregate,
        }

      }

    },
    Mutation: {
        async postOperator(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const newData = {
            ..._args.input,
          }
          let result;
          await OperatorModel.create(newData)
          .then(() => {
            result = {message:"Successfully created."}
          })
          .catch((error:any) => {
            result = {message:error._message};
          });
          return result;
        },
        
        async updateOperator(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const updateData = {
            ..._args.input,
          }
          
          let newOperator
          if (updateData.profileImage){
            let _path = path.join(path.resolve(), updateData.profileImage)
            if (fs.existsSync(_path)) {
              var fileName = path.basename(_path)
              var fileType = path.extname(fileName)
              // const newFileName = _args.operatorId + Date.now() + fileType
              const newFileName = (await global.generateRandomString(8)) + fileType;
              const operatorDirPath = `${process.env.UPLOAD_OPERATOR_PROFILE_DIR}`
              fs.mkdirSync(path.join(path.resolve(), operatorDirPath), { recursive: true });
              var newPath = path.join(path.resolve(), `${operatorDirPath}${newFileName}`)
              newOperator = {
                ...updateData,
                profileImage:`${operatorDirPath}${newFileName}`,
              }
              fs.rename(_path, newPath, function (err) {
                if (err) throw err
                // delete temp directory
                fs.rm(path.dirname(_path), { recursive: true }, (err) => {});              
              })
            }else{
              newOperator = {
                ...updateData,
              }
            }
          }else{
            newOperator = {
              ...updateData,
            }
          }
          
          if (await OperatorModel.findOne({operatorId: _args.operatorId})) {
            let results;
            await OperatorModel.findOneAndUpdate({operatorId:_args.operatorId}, newOperator, {new: true})
            .then((result:any) => {
              results = result;
            }).catch((error:any) => {
              results = null;
            });
            return results;
          }else{
            let results;
            await OperatorModel.create(newOperator)
            .then((result:any) => {
              results = result
            })
            .catch((error:any) => {
              results = null;
            });
            return results;
          }
        },
        async deleteOperator(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          let results;
          await OperatorModel.findOneAndDelete({operatorId:_args.operatorId})
          .then((result:any) => {
              results = {message:"Successfully deleted."};              
          })
          .catch((error:any) => {
              results = {message:error._message}
          });
          return results;
        }
    }
}

export default operatorResolver;