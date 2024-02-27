import { ticketServices } from "../services/ticket.services.js";

export async function getUserTickets(req, res, next) {
    const id = req.params.id;
    req.logger.debug("[Controller] got user id to search: " + id);
    const ticket = await ticketServices.getUserTickets(id);
    res["successfullGet"](ticket);
}

export async function getTicket(req, res, next) {
    const tid = req.params.tid;
    req.logger.debug("[Controller] got ticket id to search: " + tid);
    const ticket = await ticketServices.getTicket(tid);
    res["successfullGet"](ticket);
}
