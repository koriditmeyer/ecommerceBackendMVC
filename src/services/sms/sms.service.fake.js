import { TWILIO_SMS_NUMBER } from '../../config/config.js'
import { logger } from '../../utils/logger/index.js'


class SmsServiceTwilio {

  async send(destinatary, message) {
    logger.debug(`[services] send method got destinatary ${destinatary}` )
    const smsOptions = {
      from: TWILIO_SMS_NUMBER,
      to: destinatary,
      body: message
    }

    console.log(smsOptions)
    logger.debug(`[services] send method return fake sms sent` )
  }
}

export const fakeSmsService = new SmsServiceTwilio()