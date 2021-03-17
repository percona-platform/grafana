import { apiManagement } from 'app/percona/shared/helpers/api';
import { Databases } from 'app/percona/shared/core';
import { RemoteInstanceExternalservicePayload, TrackingOptions } from './AddRemoteInstance.types';

class AddRemoteInstanceService {
  static async addMysql(body: any) {
    return apiManagement.post<any, any>('/MySQL/Add', body);
  }

  static async addPostgresql(body: any) {
    return apiManagement.post<any, any>('/PostgreSQL/Add', body);
  }

  static async addProxysql(body: any) {
    return apiManagement.post<any, any>('/ProxySQL/Add', body);
  }

  static async addHaproxy(body: any) {
    return apiManagement.post<any, any>('/HAProxy/Add', body);
  }

  static async addMongodb(body: any) {
    return apiManagement.post<any, any>('/MongoDB/Add', body);
  }

  static async addRDS(body: any) {
    return apiManagement.post<any, any>('/RDS/Add', body);
  }

  static async addExternal(body: any) {
    return apiManagement.post<any, any>('/External/Add', body);
  }

  static addRemote(type: Databases, data: any) {
    switch (type) {
      case Databases.mongodb:
        return AddRemoteInstanceService.addMongodb(toPayload(data));
      case Databases.mysql:
        return AddRemoteInstanceService.addMysql(toPayload(data));
      case Databases.postgresql:
        return AddRemoteInstanceService.addPostgresql(toPayload(data));
      case Databases.proxysql:
        return AddRemoteInstanceService.addProxysql(toPayload(data));
      case Databases.haproxy:
        return AddRemoteInstanceService.addHaproxy(toExternalServicePayload(data));
      case Databases.external:
        return AddRemoteInstanceService.addExternal(toExternalServicePayload(data));
      default:
        throw new Error('Unknown instance type');
    }
  }
}

export default AddRemoteInstanceService;

export const toPayload = (values: any, discoverName?: string) => {
  const data = { ...values };

  if (values.custom_labels) {
    data.custom_labels = data.custom_labels
      .split(/[\n\s]/)
      .filter(Boolean)
      .reduce((acc: any, val: string) => {
        const [key, value] = val.split(':');

        acc[key] = value;

        return acc;
      }, {});
  }

  switch (data.tracking) {
    case TrackingOptions.pgStatements:
      data.qan_postgresql_pgstatements_agent = true;
      break;
    case TrackingOptions.pgMonitor:
      data.qan_postgresql_pgstatmonitor_agent = true;
      break;
    default:
      break;
  }

  delete data.tracking;

  data.service_name = data.serviceName;
  delete data.serviceName;

  if (!data.service_name) {
    data.service_name = data.address;
  }

  if (data.add_node === undefined) {
    data.add_node = {
      node_name: data.service_name,
      node_type: 'REMOTE_NODE',
    };
  }

  if (discoverName) {
    data.engine = discoverName;
  }

  if (!data.pmm_agent_id) {
    // set default value for pmm agent id
    data.pmm_agent_id = 'pmm-server';
  }

  if (values.isRDS) {
    data.rds_exporter = true;
  }

  data.metrics_mode = 1;

  return data;
};

export const toExternalServicePayload = (values: any): RemoteInstanceExternalservicePayload => {
  const data = { ...values };

  if (values.custom_labels) {
    data.custom_labels = data.custom_labels
      .split(/[\n\s]/)
      .filter(Boolean)
      .reduce((acc: any, val: string) => {
        const [key, value] = val.split(':');

        acc[key] = value;

        return acc;
      }, {});
  }

  delete data.tracking;
  data.service_name = data.serviceName;
  delete data.serviceName;

  if (!data.service_name) {
    data.service_name = data.address;
  }

  if (data.add_node === undefined) {
    data.add_node = {
      node_name: data.service_name,
      node_type: 'REMOTE_NODE',
    };
  }

  data.listen_port = data.port;
  delete data.port;

  data.metrics_mode = 1;

  return data;
};
