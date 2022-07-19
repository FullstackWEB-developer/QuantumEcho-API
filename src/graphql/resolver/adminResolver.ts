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

        let allUserCount: number = 0;

        const generalManagerCnt = await OperatorModel.countDocuments({activity:'general_manager'});
        const projectManagerCnt = await OperatorModel.countDocuments({activity:'project_manager'});
        const operatorCnt = await OperatorModel.countDocuments(_args);
        const clientCnt = await CustomerModel.countDocuments(_args);
        const user_aggregate = {general_managers:generalManagerCnt, project_managers: projectManagerCnt, operators: operatorCnt, clients:clientCnt}
        allUserCount = Number(operatorCnt) + Number(clientCnt);

        const nowDate = new Date();

        // user trend chart value                
        const operatorTrends = [];
        const customerTrends = [];
        const nowDateYear = nowDate.getFullYear();
        for(let i = 1; i < 13; i ++){
          const startDate = new Date(`${nowDateYear}-${i}-01`);
          const endDate = new Date(`${nowDateYear}-${i}-31`);
          const operatorCnt = await OperatorModel.countDocuments(
            {createdAt:{$gt:startDate, $lt:endDate}}
          );
          operatorTrends.push(operatorCnt);
          const customerCnt = await CustomerModel.countDocuments(
            {createdAt:{$gt:startDate, $lt:endDate}}
          );
          customerTrends.push(customerCnt);
        }
        const trend_aggregate = {
          series: [
            {
              name: 'Operator',
              data: operatorTrends,
            },
            {
              name: 'Client',
              data: customerTrends,
            },
          ],
          colors: ['#89DBF5', '#7B85A8'],
          categories:['January', 'Febbruary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        }

        // age chart value
        const ageAggregateValues: number[] = [];
        //+ 60 years
        const more60Date = new Date(nowDate.getFullYear()-60, nowDate.getMonth(), nowDate.getDay());
        const more60OperatorCnt = await OperatorModel.countDocuments(
          {dateOfBirth:{$lt:more60Date}}
        );
        const more60CustomerCnt = await CustomerModel.countDocuments(
          {dateOfBirth:{$lt:more60Date}}
        );
        const more60Cnt: number = Number(more60OperatorCnt) + Number(more60CustomerCnt);
        const more60Per: number = allUserCount > 0 ? Math.round((more60Cnt / allUserCount) * 100) : 0;
        ageAggregateValues.push(more60Per);
        // 45 - 60 years
        const less60StartDate = new Date(nowDate.getFullYear()-59, nowDate.getMonth(), nowDate.getDay());
        const less60EndDate = new Date(nowDate.getFullYear()-45, nowDate.getMonth(), nowDate.getDay());
        const less60OperatorCnt = await OperatorModel.countDocuments(
          {dateOfBirth:{$gt:less60StartDate, $lt:less60EndDate}}
        );
        const less60CustomerCnt = await CustomerModel.countDocuments(
          {dateOfBirth:{$gt:less60StartDate, $lt:less60EndDate}}
        );
        const less60Per = allUserCount > 0 ? Math.round(((Number(less60OperatorCnt)+Number(less60CustomerCnt))/allUserCount)*100) : 0;
        ageAggregateValues.push(less60Per);
        // 30 - 45 years
        const more45StartDate = new Date(nowDate.getFullYear()-44, nowDate.getMonth(), nowDate.getDay());
        const more45EndDate = new Date(nowDate.getFullYear()-30, nowDate.getMonth(), nowDate.getDay());
        const more45OperatorCnt = await OperatorModel.countDocuments(
          {dateOfBirth:{$gt:more45StartDate, $lt:more45EndDate}}
        );
        const more45CustomerCnt = await CustomerModel.countDocuments(
          {dateOfBirth:{$gt:more45StartDate, $lt:more45EndDate}}
        );
        const more45Per = allUserCount > 0 ? Math.round(((Number(more45OperatorCnt)+Number(more45CustomerCnt))/allUserCount)*100) : 0;
        ageAggregateValues.push(more45Per);
        // - 30 years
        const lessStartDate = new Date(nowDate.getFullYear()-29, nowDate.getMonth(), nowDate.getDay());
        const less30OperatorCnt = await OperatorModel.countDocuments(
          {dateOfBirth:{$gt:lessStartDate}}
        );
        const less30CustomerCnt = await CustomerModel.countDocuments(
          {dateOfBirth:{$gt:lessStartDate}}
        );
        const less30Per = allUserCount > 0 ? Math.round(((Number(less30OperatorCnt)+Number(less30CustomerCnt))/allUserCount)*100) : 0;
        ageAggregateValues.push(less30Per);
        
        const age_aggregate = {
          colors: ['#89DBF5', '#DDE2FF', '#7B85A8', '#93949C'],
          labels: ['+ 60 years', '45 - 60 years', '30 - 45 years', '- 30 years'],
          values: ageAggregateValues,
        }

        // sex chart value
        const sexAggregateValues: number[] = [];
        const femaleOperatorCnt = await OperatorModel.countDocuments(
          {bioSex:'Female'}
        );
        const femaleCustomerCnt = await CustomerModel.countDocuments(
          {bioSex:'Female'}
        );
        const femalePer = allUserCount > 0 ? Math.round(((Number(femaleOperatorCnt)+Number(femaleCustomerCnt))/allUserCount)*100) : 0;
        sexAggregateValues.push(femalePer);
        const maleOperatorCnt = await OperatorModel.countDocuments(
          {bioSex:'Male'}
        );
        const maleCustomerCnt = await CustomerModel.countDocuments(
          {bioSex:'Male'}
        );
        const malePer = allUserCount > 0 ? Math.round(((Number(maleOperatorCnt)+Number(maleCustomerCnt))/allUserCount)*100) : 0;
        sexAggregateValues.push(malePer);
        const otherOperatorCnt = await OperatorModel.countDocuments(
          {bioSex:'Other'}
        );
        const otherCustomerCnt = await CustomerModel.countDocuments(
          {bioSex:'Other'}
        );
        const otherPer = allUserCount > 0 ? Math.round(((Number(otherOperatorCnt)+Number(otherCustomerCnt))/allUserCount)*100) : 0;
        sexAggregateValues.push(otherPer);
        const sex_aggregate = {
          colors: ['#89DBF5', '#7B85A8', '#DDE2FF'],
          labels: ['Female', 'Male', 'Other'],
          values:sexAggregateValues,
        }

        // kingdom chart value
        const kingdomAggregateValues: number[] = [];
        const animalsOperatorCnt = await OperatorModel.countDocuments(
          {kingdom:'Animals'}
        );
        const animalsCustomerCnt = await CustomerModel.countDocuments(
          {kingdom:'Animals'}
        );
        const animalsPer = allUserCount > 0 ? Math.round(((Number(animalsOperatorCnt)+Number(animalsCustomerCnt))/allUserCount)*100) : 0;
        kingdomAggregateValues.push(animalsPer);
        const vegetablesOperatorCnt = await OperatorModel.countDocuments(
          {kingdom:'Vegetables'}
        );
        const vegetablesCustomerCnt = await CustomerModel.countDocuments(
          {kingdom:'Vegetables'}
        );
        const vegetablesPer = allUserCount > 0 ? Math.round(((Number(vegetablesOperatorCnt)+Number(vegetablesCustomerCnt))/allUserCount)*100) : 0;
        kingdomAggregateValues.push(vegetablesPer);
        const othersOperatorCnt = await OperatorModel.countDocuments(
          {kingdom:'Other'}
        );
        const othersCustomerCnt = await CustomerModel.countDocuments(
          {kingdom:'Other'}
        );
        const othersPer = allUserCount > 0 ? Math.round(((Number(othersOperatorCnt)+Number(othersCustomerCnt))/allUserCount)*100) : 0;
        kingdomAggregateValues.push(othersPer);
        const kingdom_aggregate = {
          colors: ['#89DBF5', '#7B85A8', '#DDE2FF'],
          labels: ['Animals', 'Vegetables', 'Other'],
          values:kingdomAggregateValues,
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

        const spending_aggregate = {
          series: [
            {
              name: 'Operators',
              data: [31, 40, 28, 51, 42, 109, 100, 80],
            },
            {
              name: 'Clients',
              data: [11, 32, 45, 32, 34, 52, 41, 70],
            },
          ],
          colors: ['#89DBF5', '#7B85A8'],
          categories: ['January', 'Febbruary', 'March', 'April', 'May', 'June', 'June', 'July']
        }

        return {
          subscriptions_aggregate,
          trend_aggregate,
          payments_status_aggregate,
          payments_methods_aggregate,
          spending_aggregate,
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