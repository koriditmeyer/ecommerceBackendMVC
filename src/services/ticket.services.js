import { ticketRepository } from "../repository/ticket.repository.js";

export class TicketServices {
  constructor(ticketRepository) {
    this.ticketRepository = ticketRepository;
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
}

export const ticketServices = new TicketServices(ticketRepository);
