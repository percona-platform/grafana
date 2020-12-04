import React from 'react';
import { mount } from 'enzyme';
import { dataQa } from '@percona/platform-core';
import { AlertRuleTemplateActions } from './AlertRuleTemplateActions';
import { formattedTemplateStubs } from '../__mocks__/alertRuleTemplateStubs';

describe('AlertRuleTemplateActions', () => {
  it('should render component correctly', () => {
    const wrapper = mount(
      <AlertRuleTemplateActions template={formattedTemplateStubs[0]} getAlertRuleTemplates={jest.fn()} />
    );

    expect(wrapper.contains(dataQa('alert-rule-template-edit-button'))).toBeFalsy();
    expect(wrapper.find(dataQa('edit-template-button'))).toBeTruthy();
  });

  it('should open edit modal when clicking edit button', () => {
    const wrapper = mount(
      <AlertRuleTemplateActions template={formattedTemplateStubs[0]} getAlertRuleTemplates={jest.fn()} />
    );

    wrapper
      .find(dataQa('edit-template-button'))
      .find('button')
      .simulate('click');

    expect(wrapper.find(dataQa('alert-rule-template-edit-button'))).toBeTruthy();
  });
});