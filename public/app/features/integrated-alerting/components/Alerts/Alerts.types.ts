import { AlertRulesListResponseRule, AlertRuleSeverity } from '../AlertRules/AlertRules.types';

export enum AlertStatus {
  STATUS_INVALID = 'Invalid',
  CLEAR = 'Clear',
  PENDING = 'Pending',
  TRIGGERING = 'Firing',
  SILENCED = 'Silenced',
}

export interface AlertsListResponseLabel {
  [K: string]: string;
}

export interface Alert {
  alertId: string;
  activeSince: string;
  labels: string[];
  lastNotified: string;
  severity: AlertRuleSeverity[keyof AlertRuleSeverity];
  status: AlertStatus[keyof AlertStatus];
  summary: string;
}

export interface AlertsListResponseAlert {
  created_at?: string;
  alert_id: string;
  labels: AlertsListResponseLabel;
  updated_at?: string;
  rule?: AlertRulesListResponseRule;
  severity: keyof typeof AlertRuleSeverity;
  status: keyof typeof AlertStatus;
  summary: string;
}

export interface AlertsTotals {
  total_items: number;
  total_pages: number;
}

export interface AlertsListResponse {
  alerts: AlertsListResponseAlert[];
  totals: AlertsTotals;
}

export interface AlertsGetPayload {
  page_params: {
    page_size: number;
    index: number;
  };
}

export interface AlertTogglePayload {
  alert_id: string;
  silenced: 'DO_NOT_CHANGE' | 'TRUE' | 'FALSE';
}
