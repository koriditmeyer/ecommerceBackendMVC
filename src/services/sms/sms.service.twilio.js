import twilio from 'twilio'
import { TWILIO_SID, TWILIO_SMS_NUMBER, TWILIO_TOKEN } from '../../config/config.js'
import { logger } from '../../utils/logger/index.js'


class SmsServiceTwilio {

  constructor() {
    this.client = twilio(TWILIO_SID,TWILIO_TOKEN)
  }

  async send(destinatary, message) {
    logger.debug(`[services] send method got destinatary ${destinatary}` )
    const smsOptions = {
      from: TWILIO_SMS_NUMBER,
      to: destinatary,
      body: message
    }

    await this.client.messages.create(smsOptions)
    logger.debug(`[services] send method return sms sent` )
  }
}

export const twilioSmsService = new SmsServiceTwilio()