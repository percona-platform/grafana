import React, { FC } from 'react';
import { IconButton, useStyles } from '@grafana/ui';
import { getStyles } from './ExpandableCell.styles';
import { ExpandableCellProps } from './ExpandableCell.types';

export const ExpandableCell: FC<ExpandableCellProps> = ({
  row,
  value,
  collapsedIconName = 'arrow-down',
  expandedIconName = 'arrow-up',
}) => {
  const styles = useStyles(getStyles);
  const restProps = row.getToggleRowExpandedProps ? row.getToggleRowExpandedProps() : {};

  return (
    <div className={styles.expandableCellWrapper} {...restProps}>
      {value}
      {row.isExpanded ? (
        <IconButton data-qa="hide-storage-location-details" name={expandedIconName} />
      ) : (
        <IconButton data-qa="show-storage-location-details" name={collapsedIconName} />
      )}
    </div>
  );
};
