import { gql } from 'apollo-server-express'

const typeDefs = gql`
type Module{
    moduleId:String!
    moduleName:String
}
input ModuleInput{
    moduleName:String
}
`

export default typeDefs
// module.exports = typeDefs