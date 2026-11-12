import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EmployeeSummary } from './employees/employee.model';
import { EmployeesPieChart } from './employees/employees-pie-chart/employees-pie-chart';
import { EmployeesTable } from './employees/employees-table/employees-table';
import { TimeEntriesService } from './employees/time-entries.service';

@Component({
  selector: 'app-root',
  imports: [EmployeesTable, EmployeesPieChart],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly timeEntriesService = inject(TimeEntriesService);

  protected readonly employees = signal<EmployeeSummary[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.timeEntriesService
      .getEmployeeSummaries()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (employees) => {
          this.employees.set(employees);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Employee data is currently unavailable. Please try again later.');
          this.loading.set(false);
        },
      });
  }
}
