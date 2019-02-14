import React from 'react';
import RecordItem from '@components/RecordItem';

import './styles.css';

export default (props) => {
  const {
    records,
    playingCurrent,
  } = props;

  const cls = ['container'];

  let content = (<span>No ha hecho ninguna grabación.</span>);

  if (records.length > 0) {
    cls.push('records-container');
    content = records.map((e, k) => (
      <RecordItem
        {...props}
        key={`record-item-${k}`}
        isCurrent={playingCurrent === k}
        current={k}
        data={e}
      />
    ));
  }

  return (
    <div className={cls.join(' ')}>
      {content}
    </div>
  );
}
