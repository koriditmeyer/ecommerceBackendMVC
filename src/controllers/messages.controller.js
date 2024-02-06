import { emailService } from "../services/email/email.service.js";
import { smsService } from "../services/sms/sms.service.js";

export async function sendMail(req, res, next) {
  try {
    const mailData = req.body;
    const destinatary = mailData.destinatary;
    const object = mailData.object;
    const templateName = mailData.templateName;
    const message = mailData.message;
    const attachments = mailData.attachments;
    const email = await emailService.send(
      destinatary,
      object,
      templateName,
      message,
      attachments
    );
    res["successfullPost"](email);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
}

export async function sendSMS(req, res, next) {
  try {
    const smsData = req.body;
    const destinatary = smsData.destinatary;
    const message = smsData.message;
    const sms = await smsService.send(
      destinatary,
      message,
    );
    res["successfullPost"](sms);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
}