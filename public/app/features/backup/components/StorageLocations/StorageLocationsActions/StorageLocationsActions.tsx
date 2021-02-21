import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import { DBIcon } from '../../DBIcon';
import { StorageLocatationsActionProps } from './StorageLocationsActions.types';
import { getStyles } from './StorageLocationsActions.styles';

export const StorageLocationsActions: FC<StorageLocatationsActionProps> = ({ location, onUpdate }) => {
  const styles = useStyles(getStyles);

  const onUpdateClick = () => onUpdate(location);

  return (
    <div className={styles.actionsWrapper}>
      <DBIcon type="edit" data-qa="save-storage-location-button" role="button" onClick={onUpdateClick} />
      <DBIcon type="delete" data-qa="delete-storage-location-button" role="button" />
    </div>
  );
};
