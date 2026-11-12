import { EmployeeSummary, TimeEntry } from './employee.model';

const MS_PER_HOUR = 60 * 60 * 1000;

export function buildEmployeeSummaries(entries: TimeEntry[]): EmployeeSummary[] {
  const hoursByName = new Map<string, number>();

  for (const entry of entries) {
    const name = entry.EmployeeName?.trim();
    if (!name || entry.DeletedOn) {
      continue;
    }

    const start = parseUtc(entry.StarTimeUtc);
    const end = parseUtc(entry.EndTimeUtc);
    if (start === null || end === null || end <= start) {
      continue;
    }

    hoursByName.set(name, (hoursByName.get(name) ?? 0) + (end - start) / MS_PER_HOUR);
  }

  const grandTotal = [...hoursByName.values()].reduce((sum, hours) => sum + hours, 0);

  return [...hoursByName.entries()]
    .map(([name, totalHours]) => ({
      name,
      totalHours,
      percentage: grandTotal > 0 ? (totalHours / grandTotal) * 100 : 0,
    }))
    .sort((a, b) => b.totalHours - a.totalHours || a.name.localeCompare(b.name));
}

function parseUtc(value: string | null): number | null {
  if (!value) {
    return null;
  }
  const hasTimezone = /([zZ]|[+-]\d{2}:\d{2})$/.test(value);
  const time = Date.parse(hasTimezone ? value : `${value}Z`);
  return Number.isNaN(time) ? null : time;
}
