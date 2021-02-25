import React, { FC, useState } from 'react';
import { Form } from 'react-final-form';
import { Button, Spinner, useTheme } from '@grafana/ui';
import { getSettingsStyles } from 'app/percona/settings/Settings.styles';
import { Messages } from 'app/percona/settings/Settings.messages';
import { MetricsResolutions } from 'app/percona/settings/Settings.types';
import { LinkTooltip } from 'app/percona/shared/components/Elements/LinkTooltip/LinkTooltip';
import validators from 'app/percona/shared/helpers/validators';
import { defaultResolutions, resolutionsOptions } from './MetricsResolution.constants';
import { getStyles } from './MetricsResolution.styles';
import { addUnits, getResolutionValue, removeUnits } from './MetricsResolution.utils';
import {
  MetricsResolutionIntervals,
  MetricsResolutionPresets,
  MetricsResolutionProps,
} from './MetricsResolution.types';
import { NumberInputField, RadioButtonGroupField } from '@percona/platform-core';
import { MAX_DAYS, MIN_DAYS } from '../Advanced/Advanced.constants';
import { FormApi } from 'final-form';

export const MetricsResolution: FC<MetricsResolutionProps> = ({ metricsResolutions, updateSettings }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const settingsStyles = getSettingsStyles(theme);
  const [fieldsResolutions, updateFieldsResolutions] = useState(removeUnits(metricsResolutions));
  const [resolution, setResolution] = useState(getResolutionValue(metricsResolutions).value);
  const [customResolutions, updateCustomResolutions] = useState(fieldsResolutions);
  const [loading, setLoading] = useState(false);
  const {
    metrics: {
      action,
      label,
      link,
      tooltip,
      intervals: { low, medium, high },
    },
    tooltipLinkText,
  } = Messages;

  const resolutionValidators = [validators.required, validators.range(MIN_DAYS, MAX_DAYS)];
  const applyChanges = (values: MetricsResolutions) => {
    updateSettings({ metrics_resolutions: addUnits(values) }, setLoading);
  };

  const updateResolutions = (form: FormApi<any>) => {
    const { hr, mr, lr, resolutions: newResolution } = form.getState().values;

    if (resolution === newResolution) {
      return;
    }

    if (resolution === MetricsResolutionPresets.custom) {
      updateCustomResolutions({ hr, mr, lr } as MetricsResolutions);
    }

    if (newResolution !== MetricsResolutionPresets.custom) {
      const newResolutionKey = resolutionsOptions.findIndex(r => r.value === newResolution);
      const resolutions = removeUnits(defaultResolutions[newResolutionKey]);

      updateFieldsResolutions(resolutions);
    } else {
      updateFieldsResolutions(customResolutions);
    }

    setResolution(newResolution);
  };

  return (
    <div className={styles.resolutionsWrapper}>
      <Form
        onSubmit={applyChanges}
        initialValues={{ ...fieldsResolutions, resolutions: resolution }}
        render={({ form, handleSubmit, valid, pristine }) => (
          <form onSubmit={handleSubmit} onChange={() => updateResolutions(form)}>
            <div className={settingsStyles.labelWrapper} data-qa="metrics-resolution-label">
              <span>{label}</span>
              <LinkTooltip tooltipText={tooltip} link={link} linkText={tooltipLinkText} icon="info-circle" />
            </div>
            <RadioButtonGroupField
              name="resolutions"
              data-qa="metrics-resolution-radio-button-group"
              options={resolutionsOptions}
            />
            <div style={{ width: '100px' }}>
              <NumberInputField
                label={low}
                name={MetricsResolutionIntervals.lr}
                disabled={resolution !== MetricsResolutionPresets.custom}
                data-qa="metrics-resolution-lr-input"
                validators={resolutionValidators}
              />
            </div>
            <div style={{ width: '100px' }}>
              <NumberInputField
                label={medium}
                name={MetricsResolutionIntervals.mr}
                disabled={resolution !== MetricsResolutionPresets.custom}
                data-qa="metrics-resolution-mr-input"
                validators={resolutionValidators}
              />
            </div>
            <div style={{ width: '100px' }}>
              <NumberInputField
                label={high}
                name={MetricsResolutionIntervals.hr}
                disabled={resolution !== MetricsResolutionPresets.custom}
                data-qa="metrics-resolution-hr-input"
                validators={resolutionValidators}
              />
            </div>
            <Button
              className={settingsStyles.actionButton}
              type="submit"
              disabled={!valid || pristine || loading}
              data-qa="metrics-resolution-button"
            >
              {loading && <Spinner />}
              {action}
            </Button>
          </form>
        )}
      />
    </div>
  );
};