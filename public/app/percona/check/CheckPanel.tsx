import React, { FC, useEffect, useMemo, useState } from 'react';
// @ts-ignore
import { createBrowserHistory } from 'history';
import { Spinner, Tab, TabContent, TabsBar, useStyles } from '@grafana/ui';
import { Link, Route, Router } from 'react-router-dom';
import { PMM_SETTINGS_URL } from 'app/percona/check/CheckPanel.constants';
import { Settings, TabEntry, TabKeys } from './types';
import { CheckService } from './Check.service';
import { getStyles } from './CheckPanel.styles';
import { Messages } from './CheckPanel.messages';
import { AllChecksTab, FailedChecksTab } from './components';
import { useSelector } from 'react-redux';
import { StoreState } from '../../types';
import { DEFAULT_TAB, PAGE_MODEL } from './CheckPanel.constants';
import { UrlQueryValue } from '@grafana/data';
import { getLocationSrv } from '@grafana/runtime';
import PageWrapper from '../shared/components/PageWrapper/PageWrapper';

const history = createBrowserHistory();

export const CheckPanel: FC = () => {
  const activeTab = useSelector((state: StoreState) => state.location.routeParams.tab);
  const { path: basePath } = PAGE_MODEL;
  const isValidTab = (tab: UrlQueryValue) => Object.values(TabKeys).includes(tab as TabKeys);
  const selectTab = (tabKey: string) => {
    getLocationSrv().update({
      path: tabKey ? `${basePath}/${tabKey}` : basePath,
    });
  };

  useEffect(() => {
    isValidTab(activeTab) || selectTab(DEFAULT_TAB);
  }, [activeTab]);

  const [hasNoAccess, setHasNoAccess] = useState(false);
  const [isSttEnabled, setIsSttEnabled] = useState(false);
  const [getSettingsPending, setGetSettingsPending] = useState(false);
  const styles = useStyles(getStyles);

  const getSettings = async () => {
    try {
      setGetSettingsPending(true);
      const resp = (await CheckService.getSettings()) as Settings;

      setIsSttEnabled(!!resp.settings?.stt_enabled);
      setIsSttEnabled(true);
      setHasNoAccess(false);
    } catch (err) {
      setHasNoAccess(err.response?.status === 401);

      console.error(err);
    } finally {
      setGetSettingsPending(false);
    }
  };

  useEffect(() => {
    getSettings();
  }, []);

  const tabs = useMemo<TabEntry[]>(
    () => [
      {
        label: Messages.failedChecksTitle,
        key: TabKeys.failedChecks,
        component: <FailedChecksTab key="failed-checks" hasNoAccess={hasNoAccess} />,
      },
      {
        label: Messages.allChecksTitle,
        key: TabKeys.allChecks,
        component: <AllChecksTab key="all-checks" />,
      },
    ],
    [hasNoAccess, isSttEnabled]
  );

  if (hasNoAccess) {
    return (
      <div className={styles.panel} data-qa="db-check-panel">
        <div className={styles.empty} data-qa="db-check-panel-unauthorized">
          {Messages.unauthorized}
        </div>
      </div>
    );
  }

  return (
    <PageWrapper pageModel={PAGE_MODEL}>
      <div className={styles.panel} data-qa="db-check-panel">
        {getSettingsPending && (
          <div className={styles.spinner} data-qa="db-check-spinner">
            <Spinner />
          </div>
        )}
        {!getSettingsPending &&
          (isSttEnabled ? (
            <>
              <TabsBar className={styles.tabBar} data-qa="db-check-tabs-bar">
                {tabs.map(tab => (
                  <Tab
                    key={tab.key}
                    label={tab.label}
                    active={tab.key === activeTab}
                    onChangeTab={() => selectTab(tab.key)}
                  />
                ))}
              </TabsBar>
              <TabContent className={styles.tabContent} data-qa="db-check-tab-content">
                {tabs.map(tab => tab.key === activeTab && tab.component)}
              </TabContent>
            </>
          ) : (
            <div className={styles.empty} data-qa="db-check-panel-settings-link">
              {Messages.sttDisabled}{' '}
              <Link className={styles.link} to={PMM_SETTINGS_URL}>
                {Messages.pmmSettings}
              </Link>
            </div>
          ))}
      </div>
    </PageWrapper>
  );
};

export const CheckPanelRouter: FC = () => (
  <Router history={history}>
    <Route>
      <CheckPanel />
    </Route>
  </Router>
);

export default CheckPanelRouter;
