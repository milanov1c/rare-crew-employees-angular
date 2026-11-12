import { Component, ElementRef, OnDestroy, afterRenderEffect, input, viewChild } from '@angular/core';
import { ArcElement, Chart, Legend, PieController, Plugin, Tooltip } from 'chart.js';
import { EmployeeSummary } from '../employee.model';

Chart.register(PieController, ArcElement, Tooltip, Legend);

const MIN_PERCENTAGE_FOR_LABEL = 4;

const sliceLabelsPlugin: Plugin<'pie'> = {
  id: 'sliceLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const values = chart.data.datasets[0]?.data ?? [];
    const meta = chart.getDatasetMeta(0);

    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.font = '600 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    meta.data.forEach((arc, index) => {
      const value = values[index];
      if (typeof value !== 'number' || value < MIN_PERCENTAGE_FOR_LABEL || !chart.getDataVisibility(index)) {
        return;
      }
      const { x, y } = arc.tooltipPosition(true);
      if (x === null || y === null) {
        return;
      }
      ctx.fillText(`${value.toFixed(1)}%`, x, y);
    });

    ctx.restore();
  },
};

@Component({
  selector: 'app-employees-pie-chart',
  templateUrl: './employees-pie-chart.html',
  styleUrl: './employees-pie-chart.css',
})
export class EmployeesPieChart implements OnDestroy {
  readonly employees = input.required<EmployeeSummary[]>();

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private chart?: Chart<'pie', number[], string>;

  constructor() {
    afterRenderEffect(() => {
      this.render(this.canvas().nativeElement, this.employees());
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private render(canvas: HTMLCanvasElement, employees: EmployeeSummary[]): void {
    const labels = employees.map((e) => `${e.name} (${e.percentage.toFixed(1)}%)`);
    const data = employees.map((e) => e.percentage);
    const colors = generateColors(employees.length);

    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      this.chart.data.datasets[0].backgroundColor = colors;
      this.chart.update();
      return;
    }

    this.chart = new Chart<'pie', number[], string>(canvas, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderColor: '#fff',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const employee = this.employees()[context.dataIndex];
                return employee
                  ? ` ${employee.name}: ${employee.percentage.toFixed(1)}% (${employee.totalHours.toFixed(1)} h)`
                  : '';
              },
            },
          },
        },
      },
      plugins: [sliceLabelsPlugin],
    });
  }
}

function generateColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const hue = Math.round((360 * i) / Math.max(count, 1));
    const lightness = i % 2 === 0 ? 55 : 42;
    return `hsl(${hue}, 65%, ${lightness}%)`;
  });
}
