import twilio from 'twilio'
import { TWILIO_SID, TWILIO_SMS_NUMBER, TWILIO_TOKEN } from '../../config/config.js'


class SmsServiceTwilio {

  constructor() {
    this.client = twilio(TWILIO_SID,TWILIO_TOKEN)
  }

  async send(destinatary, message) {
    const smsOptions = {
      from: TWILIO_SMS_NUMBER,
      to: destinatary,
      body: message
    }

    await this.client.messages.create(smsOptions)
  }
}

export const twilioSmsService = new SmsServiceTwilio()