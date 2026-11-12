import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_KEY, API_URL } from '../core/api.config';
import { buildEmployeeSummaries } from './employee-summary';
import { EmployeeSummary, TimeEntry } from './employee.model';

@Injectable({ providedIn: 'root' })
export class TimeEntriesService {
  private readonly http = inject(HttpClient);

  getEmployeeSummaries(): Observable<EmployeeSummary[]> {
    const params = new HttpParams().set('code', API_KEY);
    return this.http
      .get<TimeEntry[]>(API_URL, { params })
      .pipe(map((entries) => buildEmployeeSummaries(entries ?? [])));
  }
}
