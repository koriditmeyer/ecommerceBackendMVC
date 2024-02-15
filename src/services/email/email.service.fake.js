import { EMAIL_USER } from '../../config/config.js'
import { htmlToText } from "../../utils/htmlToText.js";

//Email Template
import fs from "fs";
import handlebars from "handlebars";
import { logger } from '../../utils/logger/index.js';
class FakeEmailService {

  async send(destinatary, object,templateName, message, attachments = []) {
    logger.debug(`[services] send method got destinatary ${destinatary}` )
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
      emailOptions.attachments = attachments
    }
    console.log(JSON.stringify(emailOptions, null, 2))
    logger.info(`[services] send method return fake email sent` )
  }
}


export const fakeEmailService = new FakeEmailService()
