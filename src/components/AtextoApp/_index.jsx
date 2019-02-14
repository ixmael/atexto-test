import React from 'react';
import createHistory from 'history/createBrowserHistory';

import Record from '@components/Record';
import RecordItem from '@components/RecordItem';

import './styles.css';

export default class AtextoApp extends React.Component {
  constructor(props) {
    super(props);
    this.history = createHistory();

    this.state = {
      isRecordingAllowed: false,
      isRecording: false,
      isPlaying: false,
      isUploading: false,
      recordedChunks: [],
      currentRecorded: -1,
    };
  }

  componentDidMount() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new window.MediaRecorder(stream);

        this.mediaRecorder.addEventListener('dataavailable', e => {
          if (e.data.size > 0) {
            this.updateChunks(e.data);
          }
        });

        this.setState({ isRecordingAllowed: true });
      })
      .catch(err => {
        //alert(err.message);
        console.log(err.message);
      });
  }

  updateChunks = (data) => {
    const { recordedChunks } = this.state;
    recordedChunks.push(data);
    this.setState({ recordedChunks });
  }

  onRecordingStart = () => {
    this.setState({
      isRecording: true,
    }, () => {
      this.mediaRecorder.start();
    });
  }

  onRecordingEnd = () => {
    this.setState({
      isRecording: false,
    }, () => {
      this.mediaRecorder.stop();
    });
  }

  onPlayingStart = (current) => {
    console.log("PLAY CURRENT", current);
    this.setState({
      isPlaying: true,
      currentRecorded: current,
    });
  }

  onPlayingEnd = () => {
    this.setState({
      isPlaying: false,
      currentRecorded: -1,
    });
  }

  // Avoid to play asynchronously
  onPlay = () => {
    console.log("PLAY");
  }

  // Avoid to upload asynchronously
  onUpload = () => {
    console.log("UPLOAD");
  }

  render() {
    const {
      isRecordingAllowed,
      isRecording,
      isPlaying,
      isUploading,
      recordedChunks,
      currentRecorded,
    } = this.state;

    const cls = ['atexto'];

    let view = (
      <div>
        <h3>Inicio</h3>
        {
          recordedChunks.length > 0 ?
          recordedChunks.map((r, current) => <RecordItem current={current} currentIsPlaying={current === currentRecorded} key={`record-item-${current}`} isPlaying={isPlaying} onPlayingStart={this.onPlayingStart} onPlayingEnd={this.onPlayingEnd} />)
         : (
          <div>No ha hecho grabaciones</div>
        )}
      </div>
    );

    if (!isRecordingAllowed) {
      cls.push('recording-allowed');
    }
    else {
      cls.push('recording-not-allowed');
    }

    if (isRecording) {
      cls.push('is-recording');
      view = (
        <div>
          <h3>Grabando</h3>
        </div>
      );
    }
    else if (isUploading) {
      cls.push('is-uploading');
      view = (
        <div>
          <h3>Subiend</h3>
        </div>
      );
    }

    return (
      <div className={cls.join(' ')}>
        <header>
          <h1>Prueba para atexto</h1>
          <h2>Autor: Ismael Ramos Merlos</h2>
        </header>
        <div className="container">
          {/*<Routes />*/}
          {view}
        </div>
        <footer>
          <Record
            {...this.state}
            onRecordingStart={this.onRecordingStart}
            onRecordingEnd={this.onRecordingEnd}
          />
        </footer>
      </div>
    );
  }
};
