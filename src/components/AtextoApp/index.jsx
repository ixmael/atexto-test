import React from 'react';
import axios from 'axios';

import Content from '@components/Content';
import RecorderControl from '@components/RecorderControl';

import './styles.css';

let player = null;

export default class AtextoApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isRecordingAllowed: false,
      isRecording: false,
      isPlaying: false,
      playingCurrent: -1,
      //
      recordedChunks: [],
      records: [],
    };
  }

  onRecordingStart = () => {
    this.setState({ isRecording: true }, () => {
      this.mediaRecorder.start();
    });
  }

  onRecordingEnd = () => {
    this.setState({ isRecording: false }, () => {
      this.mediaRecorder.stop();
    });
  }

  onPlayStart = (current) => {
    const {
      isPlaying,
    } = this.state;

    if (isPlaying) {
      this.onPlayEnd();
    }

    this.setState({
      isPlaying: true,
      playingCurrent: current,
    }, () => {
      const audioURL = URL.createObjectURL(this.state.records[current].audio);
      player = new Audio(audioURL);
      player.onended = () => {
        this.onPlayEnd();
      };
      player.play();
    });
  }

  onPlayEnd = () => {
    this.setState({
      isPlaying: false,
      playingCurrent: -1,
    }, () => {
      //player.stop();
      player.pause();
      player.currentTime = 0;
      player = null;
    });
  }

  updateChunks = (data) => {
    const { recordedChunks } = this.state;
    recordedChunks.push(data);
    this.setState({ recordedChunks });
  }

  updateRecords = (audio) => {
    const { records } = this.state;
    records.push({
      label: 'Sin nombre',
      isUploaded: false,
      audio,
    });
    this.setState({
      recordedChunks: [],
      records,
    });
  }

  onSavingRecord = (current) => {
    const data = new FormData();
    data.append('file', this.state.records[current].audio, 'audio');

    axios.post('/upload', data, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      },
    })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
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

        this.mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(this.state.recordedChunks);
          this.updateRecords(audioBlob);
        });

        this.setState({ isRecordingAllowed: true });
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  render() {
    const {
      isRecordingAllowed,
      isRecording,
      //
      records,
      playingCurrent,
    } = this.state;

    const cls = [
      'atexto',
      isRecordingAllowed ? 'recording-allowed' : 'recording-not-allowed',
      isRecording ? 'recording' : 'not-recording',
    ];

    return (
      <div className={cls.join(' ')}>
        <header>
          <h1>Prueba de Atexto</h1>
          <h2>Ismael Ramos</h2>
        </header>
        <Content
          records={records}
          playingCurrent={playingCurrent}
          onPlayStart={this.onPlayStart}
          onPlayEnd={this.onPlayEnd}
          onSavingRecord={this.onSavingRecord}
        />
        <footer>
          <RecorderControl
            isRecordingAllowed={isRecordingAllowed}
            isRecording={isRecording}
            onRecordingStart={this.onRecordingStart}
            onRecordingEnd={this.onRecordingEnd}
          />
        </footer>
      </div>
    );
  }
};
