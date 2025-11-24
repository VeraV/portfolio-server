import { Request } from "express";

export interface RequestCreateProject extends Request {
  body: {
    name: string;
    description_short: string;
    server_github_url?: string;
    client_github_url: string;
    server_deploy_url?: string;
    client_deploy_url: string;
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
  };
}
