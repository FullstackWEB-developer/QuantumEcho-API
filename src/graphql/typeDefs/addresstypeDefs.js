import { gql } from 'apollo-server-express'

const typeDefs = gql`
type Address{
    street:String
    city:String
    province:String
    country:String
    postCode:String
}

input AddressInput{
    street:String
    city:String
    province:String
    country:String
    postCode:String
}
`

export default typeDefs
// module.exports = typeDefs