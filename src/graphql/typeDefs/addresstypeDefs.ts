const typeDefs =`
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