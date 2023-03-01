import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { safeDecodeURI } from 'next-basics';
import usePageQuery from 'hooks/usePageQuery';
import External from 'assets/arrow-up-right-from-square.svg';
import Icon from './Icon';
import styles from './FilterLink.module.css';

export default function FilterLink({ id, value, label, externalUrl }) {
  const { resolve, query } = usePageQuery();
  const active = query[id] !== undefined;
  const selected = query[id] === value;
  const faviconUrl = externalUrl && new URL(externalUrl).origin + '/favicon.ico';

  return (
    <div className={styles.row}>
      <Link href={resolve({ [id]: value })} replace>
        <a
          className={classNames(styles.label, {
            [styles.inactive]: active && !selected,
            [styles.active]: active && selected,
          })}
        >
          {externalUrl && (
            <img
              className={styles.favicon}
              alt={label || value}
              loading="lazy"
              src={faviconUrl}
              onError={async ({ currentTarget }) => {
                currentTarget.style.background = 'linear-gradient(135deg,#73fac8,#00bee1)';
                currentTarget.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
              }}
            />
          )}
          {safeDecodeURI(label || value)}
        </a>
      </Link>
      {externalUrl && (
        <a className={styles.link} href={externalUrl} target="_blank" rel="noreferrer noopener">
          <Icon icon={<External />} className={styles.icon} />
        </a>
      )}
    </div>
  );
}
