import React, { FC } from 'react';
import { hot } from 'react-hot-loader';
import { connect, MapStateToProps } from 'react-redux';
import { NavModel } from '@grafana/data';
import { Button } from '@grafana/ui';
import { StoreState } from '../../types';
import Page from 'app/core/components/Page/Page';
import { getNavModel } from '../../core/selectors/navModel';

interface OwnProps {}

interface ConnectedProps {
  navModel: NavModel;
}

type Props = OwnProps & ConnectedProps;

const DbaasClusterPage: FC<Props> = props => {
  return (
    <Page navModel={props.navModel}>
      <Page.Contents>
        <>
          <div>
            <Button variant="primary">New cluster</Button>
          </div>
        </>
      </Page.Contents>
    </Page>
  );
};

const mapStateToProps: MapStateToProps<ConnectedProps, OwnProps, StoreState> = state => ({
  navModel: getNavModel(state.navIndex, 'dbaas-cluster'),
});

export default hot(module)(connect(mapStateToProps)(DbaasClusterPage));
