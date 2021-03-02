import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useStyles, useTheme } from '@grafana/ui';
import { logger } from '@percona/platform-core';
import { Column } from 'react-table';
import { cx } from 'emotion';
import { Table } from '../Table/Table';
import { Messages } from '../../IntegratedAlerting.messages';
import { useStoredTablePageSize } from '../Table/Pagination';
import { getStyles } from './Alerts.styles';
import { Alert, AlertStatus } from './Alerts.types';
import { formatAlerts, getSeverityColors } from './Alerts.utils';
import { AlertsService } from './Alerts.service';
import { ALERTS_TABLE_ID } from './Alerts.constants';
import { AlertRuleSeverity } from '../AlertRules/AlertRules.types';
import { AlertsActions } from './AlertsActions';

const { noData, columns } = Messages.alerts.table;
const {
  activeSince: activeSinceColumn,
  labels: labelsColumn,
  lastNotified: lastNotifiedColumn,
  severity: severityColumn,
  state: stateColumn,
  summary: summaryColumn,
  actions: actionsColumn,
} = columns;

export const Alerts: FC = () => {
  const style = useStyles(getStyles);
  const theme = useTheme();
  const [pendingRequest, setPendingRequest] = useState(true);
  const [data, setData] = useState<Alert[]>([]);
  const [pageSize, setPageSize] = useStoredTablePageSize(ALERTS_TABLE_ID);
  const [pageIndex, setPageindex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const severityColors = useMemo(() => getSeverityColors(theme), [theme]);
  const columns = React.useMemo(
    () => [
      {
        Header: summaryColumn,
        accessor: 'summary',
        width: '30%',
      } as Column,
      {
        Header: severityColumn,
        accessor: ({ severity, status }: Alert) => (
          <span
            className={cx({
              [style.getSeverityStyle(severityColors[severity as AlertRuleSeverity])]: status !== AlertStatus.SILENCED,
            })}
          >
            {severity}
          </span>
        ),
        width: '5%',
      } as Column,
      {
        Header: stateColumn,
        accessor: 'status',
        width: '5%',
      } as Column,
      {
        Header: labelsColumn,
        accessor: ({ labels }: Alert) => (
          <div className={style.labelsWrapper}>
            {labels.map(label => (
              <span key={label} className={style.label}>
                {label}
              </span>
            ))}
          </div>
        ),
        width: '40%',
      } as Column,
      {
        Header: activeSinceColumn,
        accessor: 'activeSince',
        width: '10%',
      } as Column,
      {
        Header: lastNotifiedColumn,
        accessor: 'lastNotified',
        width: '10%',
      } as Column,
      {
        Header: actionsColumn,
        accessor: (alert: Alert) => <AlertsActions alert={alert} getAlerts={getAlerts} />,
      } as Column,
    ],
    [theme]
  );

  const getAlerts = async () => {
    setPendingRequest(true);
    try {
      const { alerts, totals } = await AlertsService.list({
        page_params: {
          index: pageIndex,
          page_size: pageSize || 0,
        },
      });
      setData(formatAlerts(alerts));
      setTotalItems(totals.total_items || 0);
      setTotalPages(totals.total_pages || 0);
    } catch (e) {
      logger.error(e);
    } finally {
      setPendingRequest(false);
    }
  };

  const handlePaginationChanged = useCallback((pageSize: number, pageIndex: number) => {
    setPageSize(pageSize);
    setPageindex(pageIndex);
  }, []);

  useEffect(() => {
    getAlerts();
  }, [pageSize, pageIndex]);

  return (
    <Table
      totalItems={totalItems}
      totalPages={totalPages}
      pageSize={pageSize as number}
      pageIndex={pageIndex}
      onPaginationChanged={handlePaginationChanged}
      data={data}
      columns={columns}
      pendingRequest={pendingRequest}
      emptyMessage={noData}
    >
      {(rows, table) =>
        rows.map(row => {
          const { prepareRow } = table;
          prepareRow(row);
          const alert = row.original as Alert;
          return (
            <tr
              {...row.getRowProps()}
              key={alert.alertId}
              className={alert.status === AlertStatus.SILENCED ? style.disabledRow : ''}
            >
              {row.cells.map(cell => (
                <td {...cell.getCellProps()} key={cell.column.id}>
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })
      }
    </Table>
  );
};
