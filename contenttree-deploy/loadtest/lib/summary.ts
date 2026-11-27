import { htmlReport } from '../vendor/html-report.js';

export const REPORT_PATH = 'reports/summary.html';

export const handleSummary = (data: Record<string, unknown>) => ({
  [REPORT_PATH]: htmlReport(data),
  stdout: '\nReport written to ' + REPORT_PATH + '\n',
});
