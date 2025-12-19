import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface Dashboard {
  id: number;
  name: string;
  description: string;
  owner: number;
  owner_name: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Widget {
  id: number;
  name: string;
  widget_type: "chart" | "metric" | "table" | "text";
  dashboard: number;
  config: any;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private baseUrl = "http://localhost:8000/api";
  private authUrl = "http://localhost:8000/api/auth";
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem("access_token");
    if (token) {
      this.tokenSubject.next(token);
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenSubject.value;
    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    });
  }

  // Authentication
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/token/`, credentials)
      .pipe(
        map((response) => {
          localStorage.setItem("access_token", response.access);
          localStorage.setItem("refresh_token", response.refresh);
          this.tokenSubject.next(response.access);
          return response;
        }),
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.authUrl}/register/`, userData);
  }

  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    this.tokenSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.tokenSubject.value;
  }

  // Profile
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.authUrl}/profile/`, {
      headers: this.getAuthHeaders(),
    });
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.authUrl}/profile/`, userData, {
      headers: this.getAuthHeaders(),
    });
  }

  // Dashboards
  getDashboards(): Observable<Dashboard[]> {
    return this.http.get<Dashboard[]>(`${this.baseUrl}/dashboards/`, {
      headers: this.getAuthHeaders(),
    });
  }

  getDashboard(id: number): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.baseUrl}/dashboards/${id}/`, {
      headers: this.getAuthHeaders(),
    });
  }

  createDashboard(dashboard: Partial<Dashboard>): Observable<Dashboard> {
    return this.http.post<Dashboard>(`${this.baseUrl}/dashboards/`, dashboard, {
      headers: this.getAuthHeaders(),
    });
  }

  updateDashboard(
    id: number,
    dashboard: Partial<Dashboard>,
  ): Observable<Dashboard> {
    return this.http.put<Dashboard>(
      `${this.baseUrl}/dashboards/${id}/`,
      dashboard,
      {
        headers: this.getAuthHeaders(),
      },
    );
  }

  deleteDashboard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/dashboards/${id}/`, {
      headers: this.getAuthHeaders(),
    });
  }

  getDashboardWidgets(dashboardId: number): Observable<Widget[]> {
    return this.http.get<Widget[]>(
      `${this.baseUrl}/dashboards/${dashboardId}/widgets/`,
      {
        headers: this.getAuthHeaders(),
      },
    );
  }

  // Widgets
  getWidgets(): Observable<Widget[]> {
    return this.http.get<Widget[]>(`${this.baseUrl}/widgets/`, {
      headers: this.getAuthHeaders(),
    });
  }

  getWidget(id: number): Observable<Widget> {
    return this.http.get<Widget>(`${this.baseUrl}/widgets/${id}/`, {
      headers: this.getAuthHeaders(),
    });
  }

  createWidget(widget: Partial<Widget>): Observable<Widget> {
    return this.http.post<Widget>(`${this.baseUrl}/widgets/`, widget, {
      headers: this.getAuthHeaders(),
    });
  }

  updateWidget(id: number, widget: Partial<Widget>): Observable<Widget> {
    return this.http.put<Widget>(`${this.baseUrl}/widgets/${id}/`, widget, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteWidget(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/widgets/${id}/`, {
      headers: this.getAuthHeaders(),
    });
  }
}
