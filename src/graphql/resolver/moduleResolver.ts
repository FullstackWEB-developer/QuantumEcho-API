import { AdminModel, ModuleModel } from "../../models/dbmodel";
const global = require('../../global');
import fs from 'fs';
import path from 'path';

const moduleResolver = {
    Query: {
      async modules (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const lists = await ModuleModel.find();
        return lists;
      },
    },
    Mutation: {
        async postModule(_parent: any, _args: any, { headers }: any) {
          await global.isAuthorization(headers);
          const postData = {
            ..._args.input,
          }
          
          await ModuleModel.create(postData)
          .then((res) => {
            return res;
          })
          .catch((error:any) => {
            return null;
          });
          return null;
        },
    }
}

export default moduleResolver;