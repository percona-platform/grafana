import moment from 'moment/moment';
import {
  AlertRule,
  AlertRuleFilterType,
  AlertRuleParamType,
  AlertRuleSeverity,
  AlertRulesListPayloadFilter,
  AlertRulesListResponseRule,
  AlertRulesListPayloadTemplate,
  AlertRulesListPayloadTemplateParamUnits,
} from './AlertRules.types';

export const formatFilter = (filter: AlertRulesListPayloadFilter): string => {
  const { key, type, value } = filter;

  return `${key}${AlertRuleFilterType[type]}${value}`;
};

export const formatThreshold = (template: AlertRulesListPayloadTemplate): string => {
  const thresholdParam = template.params.find(param => param.name === 'threshold');

  const { unit: paramUnit, type: paramType } = thresholdParam;

  const type = AlertRuleParamType[paramType];

  if (type === AlertRuleParamType.PARAM_TYPE_INVALID) {
    return 'Invalid type';
  }

  const value = thresholdParam[type].default;

  const unit = AlertRulesListPayloadTemplateParamUnits[paramUnit];

  return `${value}${unit ? ` ${unit}` : ''}`;
};

export const formatDuration = (duration: string): string => {
  const seconds = parseInt(duration, 10);

  // NOTE: this is needed because the `humanize` function by moment.js returns 'a few seconds' for < ~50 secs
  if (seconds < 60) {
    return `${seconds} seconds`;
  }
  // TODO: when switching to moment.js v2.25, add thresholds to the `humanize` function,
  //       making it more precise. Right now it's just approximating:
  //       3000 (seconds, which is 50 minutes) will result in 'a minute';
  return moment.duration(seconds, 'seconds').humanize();
};

export const formatRule = (alert: AlertRulesListResponseRule): AlertRule => {
  const { created_at, disabled, filters, for: duration, last_notified, template, severity, summary } = alert;

  return {
    createdAt: moment(created_at).format('YYYY-MM-DD HH:mm:ss.SSS'),
    disabled,
    duration: formatDuration(duration),
    filters: filters.map(formatFilter),
    severity: AlertRuleSeverity[severity],
    summary,
    threshold: formatThreshold(template),
    lastNotified: last_notified ? moment(last_notified).format('YYYY-MM-DD HH:mm:ss.SSS') : '',
  };
};

export const formatRules = (rules: AlertRulesListResponseRule[]): AlertRule[] => (rules ? rules.map(formatRule) : []);