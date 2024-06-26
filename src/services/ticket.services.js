import { UserResponseDTO } from "../daos/dtos/user.dto.js";
import { ticketRepository } from "../repository/ticket.repository.js";
import { usersRepository } from "../repository/user.repository.js";
import { logger } from "../utils/logger/index.js";
import { toPojo } from "../utils/toPojo.js";
import { emailService } from "./email/email.service.js";

export class TicketServices {
  constructor(ticketRepository, usersRepository) {
    this.ticketRepository = ticketRepository;
    this.usersRepository = usersRepository;
  }

  async getUserTickets(id) {
    logger.debug(`[services] getUserTickets method got: id:${id}`);
    const ticket = await this.ticketRepository.findManyPopulated({
      purchaser: id,
    });
    logger.info(`[services] getUserTickets method return ticket: ${ticket}`);
    return ticket;
  }

  async getTicket(id) {
    logger.debug(`[services] getTicket method got: id:${id}`);
    const ticket = await this.ticketRepository.findOnePopulated({ _id: id });
    logger.info(`[services] getTicket method return ticket: ${ticket}`);
    return ticket;
  }

  async sendTicketEmail(id) {
    logger.debug(`[services] sendTicketEmail method got: id:${id}`);
    const ticket = await this.getTicket(id);
    let user = await this.usersRepository.findOne({ _id: ticket.purchaser });
    user = toPojo({...new UserResponseDTO(user),email:user.email});
    const object = `Purchase Confirmation`;
    const destinatary = user.email;
    const templateName = "ticket";
    const message = { ...ticket, _id: id };
    await emailService.send(destinatary, object, templateName, message);
    logger.info(
      `[services] sendTicketEmail method return message sucessfully sent`
    );
  }
}

export const ticketServices = new TicketServices(
  ticketRepository,
  usersRepository
);
