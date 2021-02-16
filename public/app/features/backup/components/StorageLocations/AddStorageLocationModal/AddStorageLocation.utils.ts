import { StorageLocation, LocationType, S3Location } from '../StorageLocations.types';
import { AddStorageLocationFormProps, FormStorageType } from './AddStorageLocationModal.types';

export const toStorageLocation = (values: AddStorageLocationFormProps): StorageLocation => {
  const { name, description, type, endpoint, client, server, accessKey, secretKey } = values;
  const result: Partial<StorageLocation> = { name, description };

  switch (type) {
    case FormStorageType.S3:
      result.type = LocationType.s3;
      result.path = endpoint;
      (result as S3Location).accessKey = accessKey;
      (result as S3Location).secretKey = secretKey;
      break;
    case FormStorageType.CLIENT:
      result.path = client;
      result.type = LocationType.localClient;
      break;
    case FormStorageType.SERVER:
      result.path = server;
      result.type = LocationType.localServer;
      break;
  }

  return result as StorageLocation;
};

export const toFormStorageLocation = (values: StorageLocation | S3Location): AddStorageLocationFormProps => {
  if (!values) {
    return {
      name: '',
      description: '',
      type: FormStorageType.S3,
      endpoint: '',
      client: '',
      server: '',
      accessKey: '',
      secretKey: '',
    };
  }

  const { name, description, type, path } = values;
  const result: Partial<AddStorageLocationFormProps> = { name, description };

  switch (type) {
    case LocationType.s3:
      result.type = FormStorageType.S3;
      result.endpoint = path;
      result.accessKey = (values as S3Location).accessKey;
      result.secretKey = (values as S3Location).secretKey;
      break;
    case LocationType.localClient:
      result.client = path;
      result.type = FormStorageType.CLIENT;
      break;
    case LocationType.localServer:
      result.server = path;
      result.type = FormStorageType.SERVER;
      break;
  }

  return result as AddStorageLocationFormProps;
};