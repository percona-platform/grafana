import { api } from 'app/percona/shared/helpers/api';
import { AlertsGetPayload, AlertsListResponse, AlertTogglePayload } from './Alerts.types';

const BASE_URL = `/v1/management/ia/Alerts`;

export const AlertsService = {
  async list(payload: AlertsGetPayload): Promise<AlertsListResponse> {
    return api.post(`${BASE_URL}/List`, payload);
  },
  async toggle(payload: AlertTogglePayload): Promise<void> {
    return api.post(`${BASE_URL}/Toggle`, payload);
  },
};
