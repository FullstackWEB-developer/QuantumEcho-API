import UserModel from "./models/user";
import jwt_decode from "jwt-decode";
import dotenv from 'dotenv';
import { CustomerModel, OperatorModel } from "./models/dbmodel";

dotenv.config();

exports.isAuthorization = async function(headers:any, isNameCheck:boolean = true) {

    if (process.env.MODE_DEV === "true") {
        return true;
    }
    const role = headers['role'];
    const bearerHeader = headers['authorization'];
    const jwt_access_token = bearerHeader ? bearerHeader.replace('Bearer ', '') : null;

    // token verification
    if (jwt_access_token) {

        const decoded = jwt_decode(jwt_access_token) as any;
        const nowTime = Date.now() / 1000;
        const exp = decoded.exp;
        const client_id = decoded.client_id;
        const issuer = decoded.iss;
        // const username = decoded.username;
        const cognitoId = decoded.sub;
        const roles = decoded['cognito:groups'];

        // token is expired
        if (exp < nowTime) {
            console.log("🚀 ~ token verification ~ token is expired");
            throw new Error('🚀 ~ token verification ~ token is expired');
        }
        // client_id not match
        if (client_id !== process.env.AWS_COGNITO_USERPOOL_WEBCLIENT_ID) {            
            console.log("🚀 ~ token verification ~ client_id not match");
            throw new Error('🚀 ~ token verification ~ client_id not match');
        }
        // issuer not match
        if (issuer !== `https://cognito-idp.${process.env.AWS_COGNITO_REGION}.amazonaws.com/${process.env.AWS_COGNITO_USERPOOL_ID}`) {
            console.log("🚀 ~ header authorization ~ issuer not match");
            throw new Error('🚀 ~ token verification ~ issuer not match');
        }

        // user not found
        const result = await UserModel.findOne({cognitoId: cognitoId});
        if (!result) {
            console.log("🚀 ~ header authorization ~ user not found");
            throw new Error('🚀 ~ token verification ~ user not found');
        }else{
            if (result.status !== 'active'){
                throw new Error('user not active');
            }else{
                await UserModel.findOneAndUpdate({cognitoId: cognitoId}, {lastAccess:new Date()});
                if (role === 'operator'){
                    await OperatorModel.findOneAndUpdate({operatorId: cognitoId}, {lastAccess:new Date()});
                }
                if (role === 'client') {
                    await CustomerModel.findOneAndUpdate({customerId: cognitoId}, {lastAccess:new Date()});
                }
            }
        }

    }else{

        throw new Error('🚀 ~ token verification ~ token empty');
        
    }
}

// Create a function for reusable perpose
exports.generateRandomString = async function (myLength:number) {
  const chars =
    "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
  const randomArray = Array.from(
    { length: myLength },
    (v, k) => chars[Math.floor(Math.random() * chars.length)]
  );

  const randomString = randomArray.join("");
  return randomString;
}

exports.getModuleOfSession = async function (){
    const mockData = [
        {
            moduleName: 'BICOM',
            moduleValue: 2,
            resonancevalue: 98,
            description: '1.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
            picture: 'assets/images/avatars/male-01.jpg',
        },
        {
            moduleName: 'Color Therapy',
            moduleValue: 5,
            resonancevalue: 67,
            description: '2.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
            picture: 'assets/images/avatars/male-02.jpg',
        },
        {
            moduleName: 'Acupunture',
            moduleValue: 1,
            resonancevalue: 54,
            description: '3.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
            picture: 'assets/images/avatars/male-03.jpg',
        },
        {
            moduleName: 'Affirmation',
            moduleValue: 2,
            resonancevalue: -15,
            description: '4.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
            picture: 'assets/images/avatars/male-04.jpg',
        },
    ];

    return mockData;
}

exports.getResonanceData = async function (){
    const mockData = [
        {
            moduleName: 'BICOM',
            moduleValue: 2,
            resonancevalue: 98,
            description: '1.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
            picture: 'assets/images/avatars/male-01.jpg',
        },
        {
            moduleName: 'Color',
            moduleValue: 5,
            resonancevalue: 67,
            description: '2.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
            picture: 'assets/images/avatars/male-02.jpg',
        },
    ];

    return mockData;
}

