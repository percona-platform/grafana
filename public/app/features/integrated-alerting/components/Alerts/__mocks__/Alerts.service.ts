import { alertsStubs } from './alertsStubs';

import * as alertsService from '../Alerts.service';

export const AlertsService = jest.genMockFromModule<typeof alertsService>('../Alerts.service').AlertsService;

AlertsService.list = () =>
  Promise.resolve({ alerts: alertsStubs, totals: { total_pages: 1, total_items: alertsStubs.length } });
AlertsService.toggle = () => Promise.resolve();
