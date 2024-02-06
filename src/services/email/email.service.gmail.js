import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_USER } from "../../config/config.js";
import { htmlToText } from "../../utils/htmlToText.js";
//Email Template
import fs from "fs";
import handlebars from "handlebars";

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
    
    const emailTemplateSource = fs.readFileSync(
      `./views/${templateName}.handlebars`,
      "utf8"
    );
    const template = handlebars.compile(emailTemplateSource);
    const htmlmessage = template({ message });
    const emailOptions = {
      from: `KORI DIMEYER <${EMAIL_USER}>`,
      to: destinatary,
      subject: object,
      text: htmlToText(htmlmessage),
      html: htmlmessage,
    };

    if (attachments.length > 0) {
      emailOptions.attachments = attachments;
    }

    await this.transport.sendMail(emailOptions);
  }
}

export const gmailEmailService = new GmailEmailService();
