import React from 'react';
import { css } from 'emotion';

const style = {
  verticalFieldLabelRow: css`
    padding-bottom: 5px;
  `,
  formElementWrapper: css`
    width: 600px;
    margin-bottom: 20px;
  `,
  fieldLabelColumn: css`
    display: flex;
    justify-content: flex-start;
    padding-right: 20px;
  `,
};

const getErrorsWrapperStyle = align => {
  let alignLabel: string;

  switch (align) {
    case 'top':
      alignLabel = 'flex-start';
      break;
    case 'middle':
      alignLabel = 'center';
      break;
    case 'bottom':
      alignLabel = 'flex-end';
      break;
    default:
      alignLabel = 'center';
  }

  return css`
    color: white;
    margin-bottom: 10px;
    display: flex;
    align-items: ${alignLabel};
  `;
};

const HorizontalFieldLayout = ({ label, tooltip, element }) => (
  <>
    <div>
      <div className={style.fieldLabelColumn}>
        <span>{label}</span>
        <span>{tooltip || ''}</span>
      </div>
      <div>{element}</div>
    </div>
  </>
);

const VerticalFieldLayout = ({ label, tooltip, alignLabel, element }) => (
  <>
    <div className={style.verticalFieldLabelRow}>
      <div className={style.fieldLabelColumn}>
        <span>{label}</span>
        <span>{tooltip || ''}</span>
      </div>
    </div>

    <div className={getErrorsWrapperStyle(alignLabel)}>
      <div>{element}</div>
    </div>
  </>
);

export const FormElement = (props: any) => {
  const { dataQa, type, errors, alignLabel } = props;

  return (
    <div className={style.formElementWrapper} data-qa={dataQa}>
      {type === 'horizontal' ? <HorizontalFieldLayout {...props} /> : <VerticalFieldLayout {...props} />}

      <div className={getErrorsWrapperStyle(alignLabel)}>
        <div>{errors}</div>
      </div>
    </div>
  );
};