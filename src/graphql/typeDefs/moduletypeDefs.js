const {gql} = require('apollo-server-express')

const typeDefs = gql`
type Module{
    moduleId:String!
    moduleName:String
}
input ModuleInput{
    moduleName:String
}
`

module.exports = typeDefs