import UserModel from "./models/user";
import jwt_decode from "jwt-decode";
import dotenv from 'dotenv';

dotenv.config();

exports.isAuthorization = async function(headers:any, isNameCheck:boolean = true) {

    if (process.env.MODE_DEV === "true") {
        return true;
    }
    
    const bearerHeader = headers['authorization'];
    const jwt_access_token = bearerHeader ? bearerHeader.replace('Bearer ', '') : null;

    // token verification
    if (jwt_access_token) {

        const decoded = jwt_decode(jwt_access_token) as any;
        const nowTime = Date.now() / 1000;
        const exp = decoded.exp;
        const client_id = decoded.client_id;
        const issuer = decoded.iss;
        const username = decoded.username;        

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

        if (isNameCheck) {
            // user not found
            const result = await UserModel.findOne({username: username});
            if (!result) {
                console.log("🚀 ~ header authorization ~ user not found");
                throw new Error('🚀 ~ token verification ~ user not found');
            }
        }

    }else{

        throw new Error('🚀 ~ token verification ~ token empty');
        
    }
}
