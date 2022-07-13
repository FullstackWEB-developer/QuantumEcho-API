import { AdminModel, ModuleModel, ModuleSelectionModel, ResonanceGroupModel, ResonanceSubGroupModel } from '../../models/dbmodel';
const global = require('../../global');

const moduleResolver = {
    Query: {
      async modules (_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        const lists = await ModuleModel.find();
        return lists;
      },
      async modulesOfSession(_parent: any, _args: any, { headers }: any) {
        await global.isAuthorization(headers);
        
        const operatorId = _args.operatorId;
        const sessionId = _args.sessionId;

        const lists = await ModuleSelectionModel.find()
        .populate(
          {
            path:'resonanceGroups',
            populate:{path:'resonanceSubGroups'}
          }
        );

        return lists;
      },

      async postEvalationFakeData(_parent: any, _args: any, { headers }: any) {

        const moduleSelections = await global.getModuleOfSession();
        const groups = await global.getResonanceData();
        await moduleSelections.map(async(module:any) => {

          await ModuleSelectionModel.create(module)
          .then(async(docModuleSelection:any) => {

            await groups.map(async(group:any, index: number) => {

              let item = {...group, moduleName:docModuleSelection.moduleName+'-'+index}
              await ResonanceGroupModel.create(item)
              .then(async(docResonanceGroup:any) => {

                await ModuleSelectionModel.findOneAndUpdate(
                  {_id:docModuleSelection._id},
                  {$push:{resonanceGroups:docResonanceGroup._id}},
                  { new: true, useFindAndModify: false }
                );
                
                await groups.map(async(subGrop:any, index: number) => {
                  let subItem = {...subGrop, moduleName:docResonanceGroup.moduleName+'-'+index}
                  await ResonanceSubGroupModel.create(subItem)
                  .then(async(docSubGroup:any) => {
                    await ResonanceGroupModel.findOneAndUpdate(
                      {_id:docResonanceGroup._id},
                      {$push:{resonanceSubGroups:docSubGroup._id}},
                      { new: true, useFindAndModify: false }
                    );
                  })
                })

              })

            })

          })

        });
        return {message:'success!!!'}
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