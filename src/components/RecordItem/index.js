import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faUpload, faCheck, } from '@fortawesome/free-solid-svg-icons';

import './styles.css';

export default class extends React.Component {
  onPlayStart = () => {
    const { onPlayStart } = this.props;
    onPlayStart(this.props.current);
  }

  onPlayEnd = () => {
    const { onPlayEnd } = this.props;
    onPlayEnd();
  }

  onSaving = () => {
    const { onSavingRecord } = this.props;
    onSavingRecord(this.props.current);
  }

  render() {
    const {
      data,
      isCurrent,
    } = this.props;

    //<button className="flat circle play" onClick={this.onPlayStart} disabled={this.props.currentIsPlaying}>
    let playControl = (
      <button className="flat circle play" onClick={this.onPlayStart}>
        <FontAwesomeIcon icon={faPlay} />
      </button>
    );

    let uploadControl = (
      <button className="flat circle upload" onClick={this.onSaving} disabled={this.props.currentIsPlaying}>
        <FontAwesomeIcon icon={faUpload} />
      </button>
    );

    if (isCurrent) {
      //<button className="flat circle play" onClick={this.onPlayEnd} disabled={this.props.currentIsPlaying}>
      playControl = (
        <button className="flat circle play" onClick={this.onPlayEnd}>
          <FontAwesomeIcon icon={faStop} />
        </button>
      );
    }

    if (data.isUploaded) {
      uploadControl = (
        <button className="flat circle uploaded" onClick={this.onSaving}>
          <FontAwesomeIcon icon={faCheck} />
        </button>
      );
    }

    return (
      <div className="record-item">
        <div className="label">
          <div className="label-title">{data.label}</div>
          <div className="label-desc">{data.isUploaded ? 'Subido al servidor' : 'No se ha guardado en el servidor'}</div>
        </div>
        <div className="record-item-controls">
          {playControl}
          {uploadControl}
        </div>
      </div>
    );
  }
}
