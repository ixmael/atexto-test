import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons';

import './styles.css';

export default class extends React.Component {
  render() {
    const {
      isRecordingAllowed,
      isRecording,
      onRecordingStart,
      onRecordingEnd,
    } = this.props;

    const cls = ['recording'];

    let component = (<span>No se ha permitido el acceso al microfono</span>);

    if (isRecordingAllowed) {
      cls.push('recording-allowed');
      component = (
        <button className="start" onClick={onRecordingStart}>
          <FontAwesomeIcon icon={faMicrophone} />
        </button>
      );
    }
    else {
      cls.push('not-recording-allowed');
    }

    if (isRecording) {
      component = (
        <button className="end" onClick={onRecordingEnd}>
          <FontAwesomeIcon icon={faStop} />
        </button>
      );
    }

    return (
      <div className={cls.join(' ')}>
        {component}
      </div>
    );
  }
}
