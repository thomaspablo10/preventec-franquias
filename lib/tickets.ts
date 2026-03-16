import { apiRequest } from "./api";
import { getToken } from "./auth";

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high";

export type TicketMessage = {
  id: number;
  ticket_id: number;
  user_id: number;
  message: string;
  created_at: string;
};

export type TicketConversation = {
  id: number;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  franchise_id: number;
  created_by_user_id: number;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
  created_at: string;
  updated_at: string;
};

export type AppTicket = {
  id: number;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  franchise_id: number;
  created_by_user_id: number;
  franchisee_last_read_at: string | null;
  admin_last_read_at: string | null;
  created_at: string;
  updated_at: string;
  messages: TicketMessage[];
};

export async function listTickets(): Promise<TicketConversation[]> {
  const token = getToken();

  return apiRequest<TicketConversation[]>("/api/v1/tickets", {
    method: "GET",
    token,
  });
}

export async function getTicket(ticketId: number): Promise<AppTicket> {
  const token = getToken();

  return apiRequest<AppTicket>(`/api/v1/tickets/${ticketId}`, {
    method: "GET",
    token,
  });
}

export async function createTicket(payload: {
  subject: string;
  description: string;
  priority: TicketPriority;
}): Promise<AppTicket> {
  const token = getToken();

  return apiRequest<AppTicket>("/api/v1/tickets", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function replyTicket(
  ticketId: number,
  message: string
): Promise<AppTicket> {
  const token = getToken();

  return apiRequest<AppTicket>(`/api/v1/tickets/${ticketId}/messages`, {
    method: "POST",
    token,
    body: JSON.stringify({ message }),
  });
}

export async function updateTicketStatus(
  ticketId: number,
  status: TicketStatus
): Promise<AppTicket> {
  const token = getToken();

  return apiRequest<AppTicket>(`/api/v1/tickets/${ticketId}/status`, {
    method: "PUT",
    token,
    body: JSON.stringify({ status }),
  });
}