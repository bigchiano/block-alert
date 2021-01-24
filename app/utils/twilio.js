const { accountSid, authToken } = require('../../config/config')
const client = require('twilio')(accountSid, authToken);

exports.sendWhatsappMessage = async (toNumber, msg) => {
    console.log('got here', msg);
    try {
        const res = await client.messages
          .create({
             from: 'whatsapp:+14155238886',
             body: msg,
             to: `whatsapp:${toNumber}`
           })
           
           return
    } catch (error) {
        console.log(error.message);   
    }
}
