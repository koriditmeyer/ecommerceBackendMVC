import { TWILIO_SMS_NUMBER } from '../../config/config.js'


class SmsServiceTwilio {

  async send(destinatary, message) {
    const smsOptions = {
      from: TWILIO_SMS_NUMBER,
      to: destinatary,
      body: message
    }

    console.log(smsOptions)
  }
}

export const fakeSmsService = new SmsServiceTwilio()