import React, { useState } from 'react';
import useConfig from 'hooks/useConfig';
import { FormattedMessage } from 'react-intl';
import { Formik, Form, Field } from 'formik';
import { setItem } from 'next-basics';
import { useRouter } from 'next/router';
import Button from 'components/common/Button';
import FormLayout, {
  FormButtons,
  FormError,
  FormMessage,
  FormRow,
} from 'components/layout/FormLayout';
import Icon from 'components/common/Icon';
import useApi from 'hooks/useApi';
import { AUTH_TOKEN } from 'lib/constants';
import { setUser } from 'store/app';
import Logo from 'assets/logo.svg';
import styles from './LoginForm.module.css';
import cookie from 'js-cookie';

const validate = ({ username, password }) => {
  const errors = {};

  if (!username) {
    errors.username = <FormattedMessage id="label.required" defaultMessage="Required" />;
  }
  if (!password) {
    errors.password = <FormattedMessage id="label.required" defaultMessage="Required" />;
  }

  return errors;
};

export default function LoginForm() {
  const { ignoreCurrentUser } = useConfig();
  const { post } = useApi();
  const router = useRouter();
  const [message, setMessage] = useState();

  const handleSubmit = async ({ username, password }) => {
    const { ok, status, data } = await post('/auth/login', {
      username,
      password,
    });

    if (ok) {
      setItem(AUTH_TOKEN, data.token);

      /**
       * Disable umami on the same browser you logged in
       * to prevent tracking your own visits
       */
      if (ignoreCurrentUser) {
        const domainSplit = location.hostname.split('.');
        const domainLength = domainSplit.length;
        const topDomain =
          domainLength > 2
            ? `${domainSplit[domainLength - 2]}.${domainSplit[domainLength - 1]}`
            : domainSplit.join('.');
        const expires = new Date();
        expires.setMonth(expires.getMonth() + 6);

        cookie.set('umami_ignore', true, {
          domain: topDomain,
          expires: expires,
          secure: location.protocol === 'https:',
        });
      }

      setUser(data.user);

      await router.push('/');

      return null;
    } else {
      setMessage(
        status === 401 ? (
          <FormattedMessage
            id="message.incorrect-username-password"
            defaultMessage="Incorrect username/password."
          />
        ) : (
          data
        ),
      );
    }
  };

  return (
    <FormLayout className={styles.login}>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <div className={styles.header}>
              <Icon icon={<Logo />} size="xlarge" className={styles.icon} />
              <h1 className="center">umami</h1>
            </div>
            <FormRow>
              <label htmlFor="username">
                <FormattedMessage id="label.username" defaultMessage="Username" />
              </label>
              <div>
                <Field name="username" type="text" />
                <FormError name="username" />
              </div>
            </FormRow>
            <FormRow>
              <label htmlFor="password">
                <FormattedMessage id="label.password" defaultMessage="Password" />
              </label>
              <div>
                <Field name="password" type="password" />
                <FormError name="password" />
              </div>
            </FormRow>
            <FormButtons>
              <Button type="submit" variant="action">
                <FormattedMessage id="label.login" defaultMessage="Login" />
              </Button>
            </FormButtons>
            <FormMessage>{message}</FormMessage>
          </Form>
        )}
      </Formik>
    </FormLayout>
  );
}
