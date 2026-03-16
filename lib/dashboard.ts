import { apiRequest } from "./api";
import { getToken } from "./auth";
import type { Franchise } from "./franchises";
import type { DocumentScope } from "./documents";
import type { TicketPriority, TicketStatus } from "./tickets";

export type AdminDashboardStats = {
  total_franchises: number;
  active_franchises: number;
  pending_franchises: number;
  inactive_franchises: number;
  total_franchisees: number;
  active_franchisees: number;
  total_documents: number;
  active_documents: number;
  total_tickets: number;
  open_tickets: number;
  in_progress_tickets: number;
  resolved_tickets: number;
  closed_tickets: number;
  unread_tickets: number;
};

export type DashboardRecentFranchiseItem = {
  id: number;
  trade_name: string;
  city: string;
  state: string;
  status: "active" | "pending" | "inactive";
  contact_name: string;
  created_at: string;
};

export type DashboardRecentTicketItem = {
  id: number;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  franchise_id: number;
  franchise_name: string;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
  updated_at: string;
};

export type DashboardRecentDocumentItem = {
  id: number;
  title: string;
  category: string | null;
  scope: DocumentScope;
  franchise_id: number | null;
  franchise_name: string | null;
  created_at: string;
};

export type AdminDashboardResponse = {
  stats: AdminDashboardStats;
  recent_franchises: DashboardRecentFranchiseItem[];
  recent_tickets: DashboardRecentTicketItem[];
  recent_documents: DashboardRecentDocumentItem[];
};

export type PortalDashboardStats = {
  available_documents: number;
  open_tickets: number;
  in_progress_tickets: number;
  resolved_tickets: number;
  closed_tickets: number;
  unread_tickets: number;
};

export type PortalDashboardResponse = {
  franchise: Franchise;
  stats: PortalDashboardStats;
  recent_tickets: DashboardRecentTicketItem[];
  recent_documents: DashboardRecentDocumentItem[];
};

export async function getAdminDashboard(): Promise<AdminDashboardResponse> {
  const token = getToken();

  return apiRequest<AdminDashboardResponse>("/api/v1/dashboard/admin", {
    method: "GET",
    token,
  });
}

export async function getPortalDashboard(): Promise<PortalDashboardResponse> {
  const token = getToken();

  return apiRequest<PortalDashboardResponse>("/api/v1/dashboard/portal", {
    method: "GET",
    token,
  });
}