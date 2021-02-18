import React from 'react';
import { shallow } from 'enzyme';
import { DBIcon } from '../../DBIcon';
import { StorageLocationsActions } from './StorageLocationsActions';
import { LocationType, StorageLocation } from '../StorageLocations.types';

describe('StorageLocationsActions', () => {
  it('should have DBIcon', () => {
    const wrapper = shallow(
      <StorageLocationsActions onUpdate={jest.fn()} location={(null as unknown) as StorageLocation} />
    );
    expect(wrapper.find(DBIcon).exists()).toBeTruthy();
  });

  it('should call onUpdate', () => {
    const location: StorageLocation = {
      locationID: 'Location1',
      name: 'location_1',
      description: 'first location',
      type: LocationType.S3,
      path: 's3://foo',
    };
    const onUpdate = jest.fn();
    const wrapper = shallow(<StorageLocationsActions onUpdate={onUpdate} location={location} />);
    wrapper
      .find(DBIcon)
      .first()
      .simulate('click');

    expect(onUpdate).toHaveBeenCalledWith(location);
  });
});
