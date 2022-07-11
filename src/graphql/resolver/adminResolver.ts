import { AdminModel, CustomerModel, OperatorModel } from "../../models/dbmodel";
const global = require('../../global');
import fs from 'fs';
import path from 'path';

const adminResolver = {
    Query: {
      async adminCount (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const count = await AdminModel.countDocuments(_args);
        return count;
      },
      async admins (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const lists = await AdminModel.find();
        return lists;
      },
      async adminById (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await AdminModel.findById(_args._id);
        return result;
      },
      async adminByCognitoId (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await AdminModel.findOne({adminId:_args.cognitoId});
        return result;
      },

      async adminGneralDashboard (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const operatorCnt = await OperatorModel.countDocuments(_args);
        const clientCnt = await CustomerModel.countDocuments(_args);
        const user_aggregate = {general_managers:1200, project_managers: 1100, operators: operatorCnt, clients:clientCnt}

        // user trend chart value
        const trend_aggregate = {
          series: [
            {
              name: 'Operator',
              data: [30, 35, 40, 50, 60, 70, 70, 80, 83, 86, 90, 100],
            },
            {
              name: 'Client',
              data: [15, 20, 30, 45, 73, 84, 85, 95, 97, 100, 104, 115],
            },
          ],
          colors: ['#89DBF5', '#7B85A8'],
          categories:[],
        }

        // age chart value
        const age_aggregate = {
          colors: ['#89DBF5', '#DDE2FF', '#7B85A8', '#93949C'],
          labels: ['+ 60 years', '45 - 60 years', '30 - 45 years', '- 30 years'],
          values:[10, 30, 45, 15],
        }

        // sex chart value
        const sex_aggregate = {
          colors: ['#89DBF5', '#7B85A8', '#DDE2FF'],
          labels: ['Female', 'Male', 'Other'],
          values:[25, 30, 45],
        }

        // kingdom chart value
        const kingdom_aggregate = {
          colors: ['#89DBF5', '#7B85A8', '#DDE2FF'],
          labels: ['Animals', 'Vegetables', 'Other'],
          values:[50, 35, 15],
        }

        // Weekly activity chart value
        const online_aggregate = {
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
        const treatment_quality_aggregate = {
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

        return {
          user_aggregate, 
          trend_aggregate,
          age_aggregate,
          sex_aggregate,
          kingdom_aggregate,
          online_aggregate,
          current_users_aggregate,
          current_clients_aggregate,
          treatment_quality_aggregate
        }
      },
      async adminAccountingDashboard (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);

        const subscriptions_aggregate = {
          subscriptions:1000,
          new_subscriptions:200,
          credits:500,
          earned_credits:100,
        }

        //Total of income trend chart value
        const trend_aggregate = {
          series: [
            {
              name: '2021',
              data: [31, 40, 28, 51, 42, 109, 100, 80],
            },
            {
              name: '2020',
              data: [11, 32, 45, 32, 34, 52, 41, 70],
            },
          ],
          colors: ['#89DBF5', '#7B85A8'],
          categories: ['January', 'Febbruary', 'March', 'April', 'May', 'June', 'June', 'July']
        }

        //Current payments status chart value
        const payments_status_aggregate = {
          colors: ['#8DEFA9', '#E7E26E', '#F97070'],
          labels: ['Chiusi', 'In attesa', 'In ritardo'],
          values:[10, 30, 60],
        }

        //Current payments methods chart value
        const payments_methods_aggregate = {
          colors: ['#89DBF5', '#7B85A8'],
          labels: ['Subscriptions', 'Via credits'],
          values:[30, 70],
        }

        return {
          subscriptions_aggregate,
          trend_aggregate,
          payments_status_aggregate,
          payments_methods_aggregate,
        }

      },
      
    },
    Mutation: {
        async postAdmin(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const postData = {
            ..._args.input,
          }

          let newData;
          if (postData.profileImage){
            let _path = path.join(path.resolve(), postData.profileImage);
            if (fs.existsSync(_path)) {
              var fileName = path.basename(_path);
              let fileType = path.extname(fileName);
              const newFileName = (await global.generateRandomString(8)) + fileType;
              const clientDirPath = '/public/uploads/profiles/admin/';
              fs.mkdirSync(path.join(path.resolve(), clientDirPath), { recursive: true });
              var newPath = path.join(path.resolve(), `${clientDirPath}${newFileName}`);
              newData = {
                ...postData,
                profileImage:`${clientDirPath}${newFileName}`,
              }
              fs.rename(_path, newPath, function (err) {
                if (err) throw err
                // delete temp directory
                fs.rm(path.dirname(_path), { recursive: true }, (err) => {});              
              })
            }else{
              newData = {
                ...postData,
              }
            }
          }else{
            newData = {
              ...postData,
            }
          }

          let result;
          await AdminModel.create(newData)
          .then((res) => {
            result = res;
          })
          .catch((error:any) => {
            result = null;
          });
          return result;
        },

        async updateAdmin(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const updateData = {
            ..._args.input,
          }          
          let newCustomer;
          if (updateData.profileImage){
            let _path = path.join(path.resolve(), updateData.profileImage)
            if (fs.existsSync(_path)) {
              var fileName = path.basename(_path);
              var fileType = path.extname(fileName);
              const newFileName = (await global.generateRandomString(8)) + fileType;
              const customerDirPath = '/public/uploads/profiles/admin/';
              fs.mkdirSync(path.join(path.resolve(), customerDirPath), { recursive: true });
              var newPath = path.join(path.resolve(), `${customerDirPath}${newFileName}`);
              newCustomer = {
                ...updateData,
                profileImage:`${customerDirPath}${newFileName}`,
              }
              fs.rename(_path, newPath, function (err) {
                if (err) throw err
                // delete temp directory
                fs.rm(path.dirname(_path), { recursive: true }, (err) => {});              
              })
            }else{
              newCustomer = {
                ...updateData,
              }
            }
          }else{
            newCustomer = {
              ...updateData,           
            }
          }
          
          let results;
          await AdminModel.findOneAndUpdate({_id:_args._id}, newCustomer, {new: true})
          .then((result:any) => {
              results = result;
          }).catch((error:any) => {
            results = null;
          });
          return results;
        },

        async deleteAdmin(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          let results;
          await AdminModel.findOneAndDelete({_id:_args._id})
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

export default adminResolver;