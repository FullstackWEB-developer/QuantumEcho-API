
import { CustomerModel, OperatorModel, SessionModel } from '../../models/dbmodel';
import format from 'date-fns/format';
import moment from 'moment';
const global = require('../../global');

import fs from 'fs';
import path from 'path';

const customerResolver = {
    Query: {

      async customerCount (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const count = await CustomerModel.countDocuments(_args);
        return count;
      },

      async customers (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers); 

        const condition = _args.condition ? _args.condition : {};
        const filters = condition.filters ? condition.filters : {};
        const idArray: string[] = filters.nameFilters ? filters.nameFilters : [];
        const lastAccessFilter: string = filters.lastAccessFilter ? filters.lastAccessFilter : 'All';
        const performanceFilter: string = filters.performanceFilter ? filters.performanceFilter : 'All';
        const qualityFilter: string = filters.qualityFilter ? filters.qualityFilter : 'All';
        const sexFilter: string = filters.sexFilter ? filters.sexFilter : 'All';
        const kingdomFilter: string = filters.kingdomFilter ? filters.kingdomFilter : 'All';
        const speciesFilter: string = filters.speciesFilter ? filters.speciesFilter : 'All';

        let startDate = `${format(Number(new Date('01/01/1901').getTime()), 'MM/dd/yyyy')} 00:00:00`;
        let endDate = `${format(Number(new Date('01/01/2300').getTime()), 'MM/dd/yyyy')} 23:59:59`;
        if ( lastAccessFilter === 'Today') {
          startDate = `${format(Number(new Date().getTime()), 'MM/dd/yyyy')} 00:00:00`;
          endDate = `${format(Number(new Date().getTime()), 'MM/dd/yyyy')} 23:59:59`;
        }else if (lastAccessFilter === 'Yesterday') {
          startDate = `${format(
            Number(new Date().getTime() - 3600 * 24 * 1000),
            'MM/dd/yyyy'
          )} 00:00:00`;
          endDate = `${format(Number(new Date().getTime() - 3600 * 24 * 1000), 'MM/dd/yyyy')} 23:59:59`;
        } else if (lastAccessFilter === 'This Week') {
          const today = moment();
          const begginingOfCurrentWeek = today.startOf('week');
          startDate = `${begginingOfCurrentWeek.format('MM/DD/yyyy')} 00:00:00`;
          const endOfWeek = today.endOf('week');
          endDate = `${endOfWeek.format('MM/DD/yyyy')} 23:59:59`;
        } else if (lastAccessFilter === 'Last Week') {
          const today = moment();
          const begginingOfCurrentWeek = today.startOf('week');
          startDate = `${begginingOfCurrentWeek.format('MM/DD/yyyy')} 00:00:00`;
          startDate = format(
            Number(new Date(startDate).getTime() - 3600 * 24 * 7 * 1000),
            'MM/dd/yyyy'
          );
          const endOfWeek = today.endOf('week');
          endDate = `${endOfWeek.format('MM/DD/yyyy')} 23:59:59`;
          endDate = format(Number(new Date(endDate).getTime() - 3600 * 24 * 7 * 1000), 'MM/dd/yyyy');
        }

        const sexValue = sexFilter !== 'All' ? sexFilter : '';
        const kingdomValue = kingdomFilter !== 'All' ? kingdomFilter : '';
        const speciesValue = speciesFilter !== 'All' ? speciesFilter : '';

        let lists = [];
        // if (idArray.length > 0) {
        //   lists = await CustomerModel.find({
        //     lastAccess: {$gt:new Date(startDate), $lt: new Date(endDate)},
        //     _id: {$in: idArray},
        //     bioSex: sexValue,
        //     kingdom: kingdomValue,
        //     species: speciesValue
        //   })
        //   .populate({
        //     path:'projects', 
        //     options:{sort:{'createdAt':'desc'}},
        //     populate:[{
        //         path:'sessions', 
        //         options:{sort:{'createdAt':'desc'}},
        //         populate:{path:'teamMembers'}
        //       },
        //       {
        //         path:'coordinator'
        //     }]
        //   })
        //   .populate('dailySurveys');
        // } else {
        lists = await CustomerModel.find(
          {
            lastAccess: {$gt:new Date(startDate), $lt: new Date(endDate)},
            bioSex: sexValue !== '' ? {$eq: sexValue} : {$ne: sexValue},
            kingdom: kingdomValue !== '' ? {$eq: kingdomValue} : {$ne: kingdomValue},
            species: speciesValue !== '' ? {$eq: speciesValue} : {$ne: speciesValue},
          }
        )
        .populate({
          path:'projects', 
          options:{sort:{'createdAt':'desc'}},
          populate:[{
              path:'sessions', 
              options:{sort:{'createdAt':'desc'}},
              populate:{path:'teamMembers'}
            },
            {
              path:'coordinator'
          }]
        })
        .populate('dailySurveys')

        if (condition.sort){
          const sort = condition.sort;
          if (sort.clientName){
            if (sort.clientName === 'asc') {              
              lists = lists.sort((a, b) => {
                return a.firstName.localeCompare(b.firstName);
              });
            }else {
              lists = lists.sort((a, b) => {
                return b.firstName.localeCompare(a.firstName);
              });
            }
          }
          if (sort.lastaccess) {
            if (sort.lastaccess === 'asc') {
              lists = lists.sort((a, b) => {
                return Number(a.lastAccess ? a.lastAccess : 0) - Number(b.lastAccess ? b.lastAccess : 0);
              });
            }else {
              lists = lists.sort((a, b) => {
                return Number(b.lastAccess ? b.lastAccess : 0) - Number(a.lastAccess ? a.lastAccess : 0);
              });
            }
          }
          if (sort.sex) {
            if (sort.sex === 'asc') {
              lists = lists.sort((a, b) => {
                return a.bioSex.localeCompare(b.bioSex);
              });
            }else {
              lists = lists.sort((a, b) => {
                return b.bioSex.localeCompare(a.bioSex);
              });
            }
          }
          if (sort.kingdom) {
            if (sort.kingdom === 'asc') {
              lists = lists.sort((a, b) => {
                return a.kingdom.localeCompare(b.kingdom);
              });
            }else {
              lists = lists.sort((a, b) => {
                return b.kingdom.localeCompare(a.kingdom);
              });
            }
          }
          if (sort.species) {
            if (sort.species === 'asc') {
              lists = lists.sort((a, b) => {
                return a.species.localeCompare(b.species);
              });
            }else {
              lists = lists.sort((a, b) => {
                return b.species.localeCompare(a.species);
              });
            }
          }
          if (sort.performance){
            if (sort.performance === 'asc') {

            }else {

            }
          }
          if (sort.quality) {
            if (sort.quality === 'asc') {

            }else {

            }
          }
          if (sort.treatments){
            if (sort.treatments === 'asc') {

            }else {

            }
          }
        }
        
        var pageNum:number = 0;
        if (_args.pageNum && _args.pageNum > 0) {
            pageNum = _args.pageNum - 1;
            return {lists:lists.slice(pageNum*Number(process.env.PAGE_PER_COUNT), (pageNum+1) * Number(process.env.PAGE_PER_COUNT)), totalCount:lists.length, perCount:Number(process.env.PAGE_PER_COUNT)};
        }else{
          return {lists:lists, totalCount:lists.length, perCount:Number(process.env.PAGE_PER_COUNT)};
        }
        
      },
      
      async customer (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const result = await CustomerModel.findOne({customerId: _args.customerId})
                                          .populate({
                                            path:'projects', 
                                            options:{sort:{'createdAt':'desc'}},
                                            populate:[{
                                                path:'sessions', 
                                                options:{sort:{'createdAt':'desc'}},
                                                populate:{path:'teamMembers'}
                                              },
                                              {
                                                path:'coordinator'
                                            }]
                                          })
                                          .populate('dailySurveys');
        return result;
      },

      async customerById (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const customer = await CustomerModel.findOne({_id: _args._id})
                                            .populate({
                                                path:'projects', 
                                                options:{sort:{'createdAt':'desc'}},
                                                populate:[{
                                                    path:'sessions', 
                                                    options:{sort:{'createdAt':'desc'}},
                                                    populate:{path:'teamMembers'}
                                                  },
                                                  {
                                                    path:'coordinator'
                                                }]
                                              })
                                              .populate('dailySurveys');
        
        return customer;
      },

      async customerOperators(_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);

        const results:any[] = [];
        for (let i = 0; i < 20; i++){
          let item = {
            _id:"62c433ea971bf67f1deb2e88",
            operator:{
              _id:"62c433ea971bf67f1deb2e4c",
              firstName:"Name",
              lastName:`Surname ${i}`,
              profileImage:'assets/images/avatars/brian-hughes.jpg',
            },
            treatmentName:`Treatment ${i}`,
            from: `00/00/200${i}`,
            to: `00/00/200${i}`,
            actual: `00/00/200${i}`,
            delay: `00/00/200${i}`,
            duration: `00/00/200${i}`,
            progress: 70+i,
          }
          results.push(item);
        }

        var pageNum:number = 0;
        if (_args.pageNum && _args.pageNum > 0) {
            pageNum = _args.pageNum - 1;
            return {lists:results.slice(pageNum*Number(process.env.PAGE_PER_COUNT), (pageNum+1) * Number(process.env.PAGE_PER_COUNT)), totalCount:results.length, perCount:Number(process.env.PAGE_PER_COUNT)};
        }else{
          return {lists:results, totalCount:results.length, perCount:Number(process.env.PAGE_PER_COUNT)};
        }
      }
      
    },
    Mutation: {
        async postCustomer(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const postData = {
            ..._args.input,
          }
          
          let newData
          if (postData.profileImage){
            let _path = path.join(path.resolve(), postData.profileImage)
            if (fs.existsSync(_path)) {
              var fileName = path.basename(_path)
              let fileType = path.extname(fileName)
              const newFileName = (await global.generateRandomString(8)) + fileType;
              const clientDirPath = `${process.env.UPLOAD_CLIENT_PROFILE_DIR}`
              fs.mkdirSync(path.join(path.resolve(), clientDirPath), { recursive: true });
              var newPath = path.join(path.resolve(), `${clientDirPath}${newFileName}`)
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
          await CustomerModel.create(newData)
          .then((res:any) => {
            result = {message:"Successfully created.", _id:res._id};
          })
          .catch((error:any) => {
            result = {message:error._message};
          });
          return result;
        },

        async updateCustomer(_parent: any, _args: any, { headers }: any) {
          
          if (_args.authCheck){
            await global.isAuthorization(headers);
          }   
        
          const updateData = {
            ..._args.input,
          }          
          let newCustomer
          if (updateData.profileImage){
            let _path = path.join(path.resolve(), updateData.profileImage)
            if (fs.existsSync(_path)) {
              var fileName = path.basename(_path)
              var fileType = path.extname(fileName)
              const newFileName = (await global.generateRandomString(8)) + fileType;
              const customerDirPath = `${process.env.UPLOAD_CLIENT_PROFILE_DIR}`
              fs.mkdirSync(path.join(path.resolve(), customerDirPath), { recursive: true });
              var newPath = path.join(path.resolve(), `${customerDirPath}${newFileName}`)
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
                lastAccess:Date.now(),
              }
            }
          }else{
            newCustomer = {
              ...updateData,
              lastAccess:Date.now(),              
            }
          }

          if (await CustomerModel.findOne({customerId: _args.customerId})) {
            let results;
            await CustomerModel.findOneAndUpdate({customerId:_args.customerId}, newCustomer, {new: true})
            .then((result:any) => {
                results = result;
            }).catch((error:any) => {
              results = null;
            });
            return results;
          }else{
            let results;
            await CustomerModel.create(newCustomer)
            .then((result:any) => {
              results = result
            })
            .catch((error:any) => {
              results = null;
            });
            return results;
          }
        },
        

        async updateCustomerById(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const updateData = {
            ..._args.input,
          }          
          let newCustomer
          if (updateData.profileImage){
            let _path = path.join(path.resolve(), updateData.profileImage)
            if (fs.existsSync(_path)) {
              var fileName = path.basename(_path)
              var fileType = path.extname(fileName)
              const newFileName = (await global.generateRandomString(8)) + fileType;
              const customerDirPath = `${process.env.UPLOAD_CLIENT_PROFILE_DIR}`
              fs.mkdirSync(path.join(path.resolve(), customerDirPath), { recursive: true });
              var newPath = path.join(path.resolve(), `${customerDirPath}${newFileName}`)
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
                lastAccess:Date.now(),
              }
            }
          }else{
            newCustomer = {
              ...updateData,
              lastAccess:Date.now(),              
            }
          }

          if (await CustomerModel.findOne({_id: _args._id})) {
            let results;
            await CustomerModel.findOneAndUpdate({_id:_args._id}, newCustomer, {new: true})
            .then((result:any) => {
                results = result;
            }).catch((error:any) => {
              results = null;
            });
            return results;
          }else{
            let results;
            await CustomerModel.create(newCustomer)
            .then((result:any) => {
              results = result
            })
            .catch((error:any) => {
              results = null;
            });
            return results;
          }
        },

        async deleteCustomer(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          let results;
          await CustomerModel.findOneAndDelete({_id:_args._id})
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

export default customerResolver;