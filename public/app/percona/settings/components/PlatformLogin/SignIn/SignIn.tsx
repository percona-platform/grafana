import React, { FC } from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { useTheme } from '@grafana/ui';
import validators from 'app/percona/shared/helpers/validators';
import { showErrorNotification, showSuccessNotification } from 'app/percona/shared/helpers';
import { InputFieldAdapter } from 'app/percona/shared/components/Form/FieldAdapters/FieldAdapters';
import { Credentials, LoginFormProps } from '../types';
import { Messages } from '../PlatformLogin.messages';
import { getStyles } from '../PlatformLogin.styles';
import { PlatformLoginService } from '../PlatformLogin.service';
import { LoaderButton } from '@percona/platform-core';

export const SignIn: FC<LoginFormProps> = ({ changeMode, getSettings }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const handleSignInFormSubmit = async (credentials: Credentials) => {
    try {
      await PlatformLoginService.signIn(credentials);

      getSettings();
      showSuccessNotification({ message: `${Messages.signInSucceeded} ${credentials.email}` });
    } catch (e) {
      console.error(e);
      showErrorNotification({ message: Messages.errors.signInFailed });
    }
  };

  const SignInForm: FC<FormRenderProps<Credentials>> = ({ pristine, submitting, valid, handleSubmit }) => (
    <form data-qa="sign-in-form" className={styles.form} onSubmit={handleSubmit}>
      <legend className={styles.legend}>{Messages.signIn}</legend>
      <Field
        data-qa="sign-in-email-input"
        name="email"
        label={Messages.emailLabel}
        component={InputFieldAdapter}
        validate={validators.compose(validators.required, validators.validateEmail)}
      />
      <Field
        data-qa="sign-in-password-input"
        name="password"
        label={Messages.passwordLabel}
        type="password"
        component={InputFieldAdapter}
        validate={validators.required}
        autoComplete="on"
      />
      <LoaderButton
        data-qa="sign-in-submit-button"
        type="submit"
        size="md"
        variant="primary"
        disabled={!valid || submitting || pristine}
        loading={submitting}
        className={styles.submitButton}
      >
        {Messages.signIn}
      </LoaderButton>
      <LoaderButton
        data-qa="sign-in-to-sign-up-button"
        type="button"
        size="md"
        variant="link"
        disabled={submitting}
        onClick={changeMode}
        className={styles.submitButton}
      >
        {Messages.signUp}
      </LoaderButton>
    </form>
  );

  return <Form onSubmit={handleSignInFormSubmit} render={SignInForm} />;
};