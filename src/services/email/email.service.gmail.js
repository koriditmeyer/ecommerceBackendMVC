import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_USER } from "../../config/config.js";
import { htmlToText } from "../../utils/htmlToText.js";
//Email Template
import fs from "fs";
import handlebars from "handlebars";
import { logger } from "../../utils/logger/index.js";

class GmailEmailService {
  constructor() {
    this.transport = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }

  async send(destinatary, object,templateName, message, attachments = []) {
    logger.debug(`[services] send method got destinatary ${destinatary}` )
    const emailTemplateSource = fs.readFileSync(
      `./views/${templateName}.handlebars`,
      "utf8"
    );
    const template = handlebars.compile(emailTemplateSource);
    const htmlmessage = template({ message });
    const emailOptions = {
      from: `Amazon <${EMAIL_USER}>`,
      to: destinatary,
      subject: object,
      text: htmlToText(htmlmessage),
      html: htmlmessage,
    };

    if (attachments.length > 0) {
      emailOptions.attachments = attachments;
    }

    try {
      await this.transport.sendMail(emailOptions);
    } catch (error) {
      logger.debug('SendMail Error:', error);
      throw new Error('Error sending email')
    }
    logger.info(`[services] send method return email sent` )
  }
}

export const gmailEmailService = new GmailEmailService();
