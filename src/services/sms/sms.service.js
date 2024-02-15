import { NODE_ENV } from '../../config/config.js'

let smsService

// @ts-ignore
if (NODE_ENV === 'production') {
  const { twilioSmsService } = await import('./sms.service.twilio.js')
  smsService = twilioSmsService
} else {
  const { fakeSmsService } = await import('./sms.service.fake.js')
  smsService = fakeSmsService
}

export { smsService }