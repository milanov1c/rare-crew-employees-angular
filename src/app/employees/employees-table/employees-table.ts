import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { EmployeeSummary, LOW_HOURS_THRESHOLD } from '../employee.model';

@Component({
  selector: 'app-employees-table',
  imports: [DecimalPipe],
  templateUrl: './employees-table.html',
  styleUrl: './employees-table.css',
})
export class EmployeesTable {
  readonly employees = input.required<EmployeeSummary[]>();

  protected readonly threshold = LOW_HOURS_THRESHOLD;
}
