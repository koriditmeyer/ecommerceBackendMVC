import { ticketServices } from "../services/ticket.services.js";

export async function getUserTickets(req, res, next) {
  try {
    const id = req.params.id;
    const ticket = await ticketServices.getUserTickets(id);
    res["successfullGet"](ticket);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
}

export async function getTicket(req, res, next) {
  try {
    const tid = req.params.tid;
    const ticket = await ticketServices.getTicket(tid);
    res["successfullGet"](ticket);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
}
