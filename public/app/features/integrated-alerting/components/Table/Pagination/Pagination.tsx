import React, { FC, useState, useMemo } from 'react';
import { useStyles, IconName, Button } from '@grafana/ui';
import { PaginationProps } from './Pagination.types';
import { getStyles } from './Pagination.styles';
import { Messages } from './Pagination.messages';

export const Pagination: FC<PaginationProps> = ({
  pageCount,
  initialPageIndex,
  pageSize,
  pagesPerView,
  nrRowsOnCurrentPage,
  totalItems,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}) => {
  // Zero pages probably won't make the pagination show up, but here we should be agnostic to that
  pageCount = Math.max(pageCount, 1);
  const [activePageIndex, setActivePageIndex] = useState(initialPageIndex);
  const pageArray = useMemo(() => [...Array(pageCount).keys()], [pageCount]);
  const maxVisiblePages = Math.min(pagesPerView, pageCount);
  // We want to center our selected page, thus we need to know how many should be on the left
  const pagesBehind = pagesPerView - (pagesPerView - Math.ceil(pagesPerView / 2)) - 1;
  let firstPageIndex = Math.max(activePageIndex - pagesBehind, 0);
  let lastPageIndex = firstPageIndex + maxVisiblePages;

  // If we can't keep the selected page in the center anymore, it should just move rightwards
  if (lastPageIndex >= pageCount + 1 && lastPageIndex - maxVisiblePages > 0) {
    lastPageIndex = pageCount;
    firstPageIndex = lastPageIndex - maxVisiblePages;
  }
  const shownPages = pageArray.slice(firstPageIndex, lastPageIndex);
  const leftItemNumber = activePageIndex * pageSize + 1;
  const rightItemNumber = activePageIndex * pageSize + nrRowsOnCurrentPage;
  const style = useStyles(getStyles);

  const gotoPage = (pageIndex: number) => {
    if (pageIndex < 0) {
      pageIndex = 0;
    } else if (pageIndex > pageCount - 1) {
      pageIndex = pageCount - 1;
    }
    setActivePageIndex(pageIndex);
    onPageChange(pageIndex);
  };

  return (
    <div className={style.pagination} data-qa="pagination">
      <span>
        {Messages.ROWS_PER_PAGE}
        <select value={pageSize} onChange={e => onPageSizeChange(+e.target.value)}>
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </span>
      <span>
        {`Showing ${leftItemNumber}-${rightItemNumber} of ${totalItems} items`}
        <span className={style.pageButtonsContainer}>
          <Button
            icon={'angle-double-left' as IconName}
            variant="secondary"
            disabled={activePageIndex === 0}
            onClick={() => gotoPage(0)}
          />
          <Button
            icon="angle-left"
            variant="secondary"
            disabled={activePageIndex === 0}
            onClick={() => gotoPage(activePageIndex - 1)}
          />
          {shownPages.map(page => (
            <Button
              variant={activePageIndex === page ? 'primary' : 'secondary'}
              onClick={() => gotoPage(page)}
              key={page}
            >
              {page + 1}
            </Button>
          ))}
          <Button
            icon="angle-right"
            variant="secondary"
            disabled={activePageIndex === pageCount - 1}
            onClick={() => gotoPage(activePageIndex + 1)}
            className="next-page"
          />
          <Button
            icon={'angle-double-right' as IconName}
            variant="secondary"
            disabled={activePageIndex === pageCount - 1}
            onClick={() => gotoPage(pageCount - 1)}
          />
        </span>
      </span>
    </div>
  );
};

Pagination.defaultProps = {
  pageCount: 1,
  initialPageIndex: 0,
  pagesPerView: 3,
  onPageChange: () => 0,
};
