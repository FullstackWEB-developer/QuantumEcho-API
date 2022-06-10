const {gql} = require('apollo-server')

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

module.exports = typeDefs