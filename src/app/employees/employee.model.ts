export interface TimeEntry {
  Id: string | null;
  EmployeeName: string | null;
  StarTimeUtc: string | null;
  EndTimeUtc: string | null;
  EntryNotes: string | null;
  DeletedOn: string | null;
}

export interface EmployeeSummary {
  name: string;
  totalHours: number;
  percentage: number;
}

export const LOW_HOURS_THRESHOLD = 100;
