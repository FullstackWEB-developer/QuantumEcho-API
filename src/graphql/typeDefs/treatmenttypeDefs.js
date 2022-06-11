const { gql } = require('apollo-server-express')

const typeDefs = gql`
type Treatment {
    treatmentId:ID!
    treatmentName:String
    treatmentGroup:String
    treatmentSubGroup:String
    frequencies:Float
    fractals:[String]
}
input TreatmentInput {
    treatmentName:String
    treatmentGroup:String
    treatmentSubGroup:String
    frequencies:Float
    fractals:[String]
}

type Query {
    treatmentCount : Int!
    treatments:[Treatment]
    treatment(_id: ID!): Treatment
}

type Mutation {

    postTreatment(input: TreatmentInput): Message
    
    updateTreatment(
        _id:ID!
        input:TreatmentInput
    ):Treatment
  
    deleteTreatment(_id:ID!):Message!

}

`

module.exports = typeDefs