export type UserRole = "franqueado" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  unit?: string;
  avatar?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  authorAvatar?: string;
  category: string;
  publishedAt: string;
  internal?: boolean;
}

export interface Material {
  id: string;
  title: string;
  description: string;
  type: "logo" | "arte" | "campanha" | "redes-sociais";
  fileUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: "guia" | "tecnico" | "documento";
  fileUrl: string;
  createdAt: string;
}

export interface Training {
  id: string;
  title: string;
  description: string;
  type: "video" | "curso" | "apresentacao";
  duration?: string;
  videoUrl?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "normal" | "important" | "urgent";
  createdAt: string;
  author: string;
}

export interface FranchiseModel {
  id: string;
  name: string;
  description: string;
  services: string[];
  highlight: boolean;
}
