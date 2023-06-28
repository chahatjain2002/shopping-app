const { OAuth2Client } = require('google-auth-library');
const dotenv = require("dotenv")
dotenv.config()

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyTokenGoogle(token) {
    //Our logic to verify token  
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        return { payload: ticket.getPayload() };
    } catch (error) {
        return { error: "Invalid user detected. Please try again" };
    }
}

module.exports = verifyTokenGoogle;