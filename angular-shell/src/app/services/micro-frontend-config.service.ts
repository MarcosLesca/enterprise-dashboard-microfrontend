import { Injectable } from "@angular/core";

export interface MicroFrontendConfig {
  name: string;
  port: number;
  path: string;
  protocol?: "http" | "https";
}

@Injectable({
  providedIn: "root",
})
export class MicroFrontendConfigService {
  private readonly defaultConfigs: Record<string, MicroFrontendConfig> = {
    analytics: {
      name: "analytics",
      port: 4201,
      path: "/analytics",
      protocol: "http",
    },
    profile: {
      name: "profile",
      port: 4202,
      path: "/profile",
      protocol: "http",
    },
  };

  getMicroFrontendUrl(
    name: string,
    overrides?: Partial<MicroFrontendConfig>,
  ): string {
    const config = this.defaultConfigs[name];
    if (!config) {
      throw new Error(`Microfrontend '${name}' not found in configuration`);
    }

    const finalConfig = { ...config, ...overrides };
    const hostname = window.location.hostname;

    return `${finalConfig.protocol}://${hostname}:${finalConfig.port}${finalConfig.path}`;
  }

  getAllConfigs(): Record<string, MicroFrontendConfig> {
    return { ...this.defaultConfigs };
  }

  // Fallback method to get URL from window globals for development
  getDynamicUrl(name: string): string {
    const globalKey = `__${name.toUpperCase()}_URL__`;
    const globalUrl = (window as any)[globalKey];

    if (globalUrl) {
      return globalUrl;
    }

    return this.getMicroFrontendUrl(name);
  }
}
