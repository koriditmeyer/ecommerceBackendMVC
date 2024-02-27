import { emailService } from "../services/email/email.service.js";
import { smsService } from "../services/sms/sms.service.js";

export async function sendMail(req, res, next) {
    const mailData = req.body;
    const destinatary = mailData.destinatary;
    const object = mailData.object;
    const templateName = mailData.templateName;
    const message = mailData.message;
    const attachments = mailData.attachments;
    req.logger.debug("[Controller] Got mail data: " +  mailData);

    const email = await emailService.send(
      destinatary,
      object,
      templateName,
      message,
      attachments
    );
    res["successfullPost"](email);
}

export async function sendSMS(req, res, next) {
    const smsData = req.body;
    const destinatary = smsData.destinatary;
    const message = smsData.message;
    req.logger.debug("[Controller] Got SMS data: " +  smsData);
    const sms = await smsService.send(
      destinatary,
      message,
    );
    res["successfullPost"](sms);
}