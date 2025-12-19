// API related models
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: Widget[];
  created_at: string;
  updated_at: string;
}

export interface Widget {
  id: string;
  type: "chart" | "metric" | "table" | "text";
  title: string;
  content: any;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  config?: any;
}
