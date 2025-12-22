import { Request } from "express";

// Custom Request interface with payload from JWT middleware
export interface RequestWithPayload extends Request {
  payload?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface RequestCreateProject extends Request {
  body: {
    name: string;
    description_short: string;
    server_github_url?: string;
    client_github_url: string;
    server_deploy_url?: string;
    client_deploy_url: string;
    image_url: string;
    technologyIds: string[];
  };
}

export interface RequestUpdateProject extends Request {
  body: {
    name: string;
    description_short: string;
    server_github_url?: string;
    client_github_url: string;
    server_deploy_url?: string;
    client_deploy_url: string;
    image_url: string;
    technologyIds: string[];
  };
}

export interface RequestCreateTechnology extends Request {
  body: {
    name: string;
    logo_url: string;
    official_site_url: string;
    categoryId: string;
  };
}

export interface RequestCreateManual extends Request {
  body: {
    projectId: string;
    title: string;
    description: string;
    version: string;
  };
}

export interface RequestUpdateManual extends Request {
  body: {
    title: string;
    description: string;
    version: string;
  };
}

export interface RequestCreateManualStep extends Request {
  body: {
    manualId: string;
    image_url: string;
    description: string;
  };
}

export interface RequestUpdateStep extends Request {
  body: {
    image_url: string;
    description: string;
  };
}
