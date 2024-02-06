import { ticketRepository } from "../repository/ticket.repository.js";
import { usersRepository } from "../repository/user.repository.js";
import { emailService } from "./email/email.service.js";

export class TicketServices {
  constructor(ticketRepository,usersRepository) {
    this.ticketRepository = ticketRepository;
    this.usersRepository = usersRepository
  }

  async getUserTickets(id) {
    // find User ticket
    const ticket = await this.ticketRepository.findManyPopulated({
      purchaser: id,
    });
    return ticket;
  }

  async getTicket(id) {
    // find User ticket
    const ticket = await this.ticketRepository.findOnePopulated({ _id: id });
    return ticket;
  }

  async sendTicketEmail(id){
    const ticket= await this.getTicket(id)
    const user= await this.usersRepository.findOne({_id:ticket.purchaser})

    const object=`Purchase Confirmation ${(id).substring(0,50)}...`
    const destinatary=user.email
    const templateName="ticket"
    const message=ticket 
    emailService.send(destinatary, object,templateName, message )
  }
}

export const ticketServices = new TicketServices(ticketRepository, usersRepository);
