import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
  CheckCircle2
} from 'lucide-react';

interface AudioRecorderProps {
  onRecorded: (file: File) => void;
  recordedFile: File | null;
  onClear: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecorded,
  recordedFile,
  onClear
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // =========================================================
  // CREATE AUDIO URL WHEN RECORDED FILE CHANGES
  // =========================================================

  useEffect(() => {
    // Revoke previous object URL
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    setIsPlaying(false);

    if (!recordedFile) {
      return;
    }

    // Create one stable URL for the recorded file
    const url = URL.createObjectURL(recordedFile);

    audioUrlRef.current = url;

    console.log('Playback URL created:', url);

    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.load();
    }

    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, [recordedFile]);

  // =========================================================
  // START RECORDING
  // =========================================================

  const startRecording = async () => {
    try {
      console.log(
        'Starting automatic multilingual recording...'
      );

      console.log(
        'Requesting microphone access...'
      );

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });

      // -------------------------------------------------------
      // MICROPHONE CHECK
      // -------------------------------------------------------

      const audioTracks =
        stream.getAudioTracks();

      console.log(
        'Microphone tracks:',
        audioTracks
      );

      console.log(
        'Microphone details:',
        audioTracks.map((track) => ({
          label: track.label,
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState
        }))
      );

      if (audioTracks.length === 0) {
        alert('No microphone was detected.');

        stream
          .getTracks()
          .forEach((track) => track.stop());

        return;
      }

      // -------------------------------------------------------
      // FIND SUPPORTED AUDIO FORMAT
      // -------------------------------------------------------

      let mimeType = '';

      if (
        MediaRecorder.isTypeSupported(
          'audio/webm;codecs=opus'
        )
      ) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (
        MediaRecorder.isTypeSupported(
          'audio/webm'
        )
      ) {
        mimeType = 'audio/webm';
      } else if (
        MediaRecorder.isTypeSupported(
          'audio/ogg;codecs=opus'
        )
      ) {
        mimeType = 'audio/ogg;codecs=opus';
      } else if (
        MediaRecorder.isTypeSupported(
          'audio/ogg'
        )
      ) {
        mimeType = 'audio/ogg';
      }

      console.log(
        'Selected recording format:',
        mimeType || 'browser default'
      );

      // -------------------------------------------------------
      // CREATE MEDIA RECORDER
      // -------------------------------------------------------

      mediaRecorderRef.current = mimeType
        ? new MediaRecorder(stream, {
            mimeType
          })
        : new MediaRecorder(stream);

      audioChunksRef.current = [];

      console.log(
        'MediaRecorder created:',
        mediaRecorderRef.current.mimeType
      );

      // -------------------------------------------------------
      // RECEIVE AUDIO DATA
      // -------------------------------------------------------

      mediaRecorderRef.current.ondataavailable =
        (event) => {
          console.log(
            'Audio chunk:',
            {
              size: event.data.size,
              type: event.data.type
            }
          );

          if (
            event.data &&
            event.data.size > 0
          ) {
            audioChunksRef.current.push(
              event.data
            );
          }
        };

      // -------------------------------------------------------
      // RECORDING ERROR
      // -------------------------------------------------------

      mediaRecorderRef.current.onerror =
        (event) => {
          console.error(
            'MediaRecorder error:',
            event
          );

          alert(
            'An error occurred while recording audio.'
          );

          stream
            .getTracks()
            .forEach((track) => track.stop());

          setIsRecording(false);

          if (timerRef.current) {
            clearInterval(
              timerRef.current
            );

            timerRef.current = null;
          }
        };

      // -------------------------------------------------------
      // RECORDING STOPPED
      // -------------------------------------------------------

      mediaRecorderRef.current.onstop =
        () => {
          console.log(
            'MediaRecorder stopped.'
          );

          const totalBytes =
            audioChunksRef.current.reduce(
              (total, chunk) =>
                total + chunk.size,
              0
            );

          console.log(
            'Recording result:',
            {
              chunks:
                audioChunksRef.current.length,
              totalBytes,
              chunkSizes:
                audioChunksRef.current.map(
                  (chunk) => chunk.size
                )
            }
          );

          // ---------------------------------------------------
          // VALIDATE RECORDING
          // ---------------------------------------------------

          if (
            audioChunksRef.current.length === 0
          ) {
            alert(
              'No audio was recorded. Please check your microphone and try again.'
            );

            stream
              .getTracks()
              .forEach((track) => track.stop());

            return;
          }

          if (totalBytes === 0) {
            alert(
              'The recording contains no audio data. Please check your microphone.'
            );

            stream
              .getTracks()
              .forEach((track) => track.stop());

            return;
          }

          // ---------------------------------------------------
          // CREATE AUDIO BLOB
          // ---------------------------------------------------

          const actualMimeType =
            mediaRecorderRef.current?.mimeType ||
            mimeType ||
            'audio/webm';

          const audioBlob =
            new Blob(
              audioChunksRef.current,
              {
                type: actualMimeType
              }
            );

          console.log(
            'Audio Blob:',
            {
              size: audioBlob.size,
              type: audioBlob.type
            }
          );

          // ---------------------------------------------------
          // FILE EXTENSION
          // ---------------------------------------------------

          let extension = 'webm';

          if (
            actualMimeType.includes('ogg')
          ) {
            extension = 'ogg';
          } else if (
            actualMimeType.includes('mp4')
          ) {
            extension = 'mp4';
          }

          // ---------------------------------------------------
          // CREATE FILE
          // ---------------------------------------------------

          const file = new File(
            [audioBlob],
            `recorded-call-${Date.now()}.${extension}`,
            {
              type: actualMimeType
            }
          );

          console.log(
            'Audio file created:',
            {
              name: file.name,
              type: file.type,
              size: file.size
            }
          );

          // ---------------------------------------------------
          // SEND FILE TO PARENT
          // ---------------------------------------------------

          onRecorded(file);

          // ---------------------------------------------------
          // RELEASE MICROPHONE
          // ---------------------------------------------------

          stream
            .getTracks()
            .forEach((track) =>
              track.stop()
            );

          console.log(
            'Microphone released.'
          );
        };

      // -------------------------------------------------------
      // START RECORDING
      // -------------------------------------------------------

      // Request audio chunks every second
      mediaRecorderRef.current.start(1000);

      console.log(
        'Recording started.'
      );

      setIsRecording(true);
      setRecordingTime(0);

      // -------------------------------------------------------
      // TIMER
      // -------------------------------------------------------

      timerRef.current =
        setInterval(() => {
          setRecordingTime(
            (prev) => prev + 1
          );
        }, 1000);

    } catch (error) {
      console.error(
        'Microphone error:',
        error
      );

      alert(
        'Microphone access denied or unavailable. Please allow microphone access and try again.'
      );
    }
  };

  // =========================================================
  // STOP RECORDING
  // =========================================================

  const stopRecording = () => {
    console.log(
      'Stopping recording...'
    );

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !==
        'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(
        timerRef.current
      );

      timerRef.current = null;
    }
  };

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (
    seconds: number
  ) => {
    const mins =
      Math.floor(seconds / 60);

    const secs =
      seconds % 60;

    return `${mins
      .toString()
      .padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  // =========================================================
  // PURPLE PLAY / PAUSE BUTTON
  // =========================================================

  const togglePlay = async () => {
    const audio =
      audioRef.current;

    if (!audio) {
      console.error(
        'Audio element not available.'
      );

      return;
    }

    try {
      if (!audio.paused) {
        audio.pause();
        return;
      }

      if (audio.ended) {
        audio.currentTime = 0;
      }

      console.log(
        'Playing recorded audio...'
      );

      await audio.play();

    } catch (error) {
      console.error(
        'Audio playback error:',
        error
      );

      alert(
        'Unable to play the recording. Please try recording again.'
      );
    }
  };

  // =========================================================
  // AUDIO EVENTS
  // =========================================================

  const handleAudioPlay = () => {
    console.log(
      'Audio playback started.'
    );

    setIsPlaying(true);
  };

  const handleAudioPause = () => {
    console.log(
      'Audio playback paused.'
    );

    setIsPlaying(false);
  };

  const handleAudioEnded = () => {
    console.log(
      'Audio playback ended.'
    );

    setIsPlaying(false);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleAudioLoaded = () => {
    console.log(
      'Audio loaded successfully:',
      {
        duration:
          audioRef.current?.duration,
        readyState:
          audioRef.current?.readyState
      }
    );
  };

  const handleAudioError = () => {
    console.error(
      'Audio playback error:',
      audioRef.current?.error
    );
  };

  // =========================================================
  // CLEAR RECORDING
  // =========================================================

  const handleClear = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsPlaying(false);

    if (audioUrlRef.current) {
      URL.revokeObjectURL(
        audioUrlRef.current
      );

      audioUrlRef.current = null;
    }

    onClear();
  };

  // =========================================================
  // CLEANUP
  // =========================================================

  useEffect(() => {
    return () => {

      if (timerRef.current) {
        clearInterval(
          timerRef.current
        );
      }

      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !==
          'inactive'
      ) {
        mediaRecorderRef.current.stop();
      }

      if (audioUrlRef.current) {
        URL.revokeObjectURL(
          audioUrlRef.current
        );
      }
    };
  }, []);

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/15 text-center space-y-6">

      {!recordedFile ? (

        <div className="space-y-6">

          {/* =================================================
              MICROPHONE
              ================================================= */}

          <div className="relative inline-block">

            <button
              type="button"
              onClick={
                isRecording
                  ? stopRecording
                  : startRecording
              }
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-500 animate-pulse text-white scale-105'
                  : 'bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white'
              }`}
            >

              {isRecording ? (
                <Square className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}

            </button>

            {isRecording && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
            )}

          </div>

          {/* =================================================
              RECORDING TEXT
              ================================================= */}

          <div>

            <h4 className="text-lg font-bold text-white mb-1">

              {isRecording
                ? 'Recording Citizen Call...'
                : 'Click Microphone to Record'}

            </h4>

            <p className="text-xs text-slate-400">

              {isRecording
                ? `Recording duration: ${formatTime(recordingTime)}`
                : 'Speak naturally in your preferred language to describe your complaint, location, and urgency.'}

            </p>

          </div>

        </div>

      ) : (

        /* =====================================================
           RECORDED AUDIO
           ===================================================== */

        <div className="space-y-5">

          {/* Recording status */}

          <div className="flex items-center justify-between text-xs text-slate-300">

            <span className="flex items-center gap-2 font-semibold text-emerald-400">

              <CheckCircle2 className="w-4 h-4" />

              Live Voice Recording Saved

            </span>

            <button
              type="button"
              onClick={handleClear}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>

          </div>

          {/* =================================================
              HIDDEN AUDIO ELEMENT
              Controlled only by purple button
              ================================================= */}

          <audio
            ref={audioRef}
            preload="auto"
            onLoadedMetadata={
              handleAudioLoaded
            }
            onCanPlay={() =>
              console.log(
                'Audio can play.'
              )
            }
            onPlay={handleAudioPlay}
            onPause={handleAudioPause}
            onEnded={handleAudioEnded}
            onError={handleAudioError}
            className="hidden"
          />

          {/* =================================================
              PURPLE PLAY BUTTON + WAVEFORM
              ================================================= */}

          <div className="flex items-center gap-4 pt-2">

            <button
              type="button"
              onClick={togglePlay}
              className="w-12 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg transition-all"
              aria-label={
                isPlaying
                  ? 'Pause recording'
                  : 'Play recording'
              }
            >

              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}

            </button>

            <div className="flex-1 h-10 flex items-center gap-1 px-3 bg-slate-950 rounded-xl overflow-hidden">

              {[
                50,
                80,
                40,
                95,
                100,
                60,
                85,
                70,
                45,
                90,
                100,
                65,
                80,
                75
              ].map((h, i) => (

                <div
                  key={i}
                  className={`w-1 rounded-full transition-all ${
                    isPlaying
                      ? 'bg-indigo-400 animate-pulse'
                      : 'bg-slate-700'
                  }`}
                  style={{
                    height:
                      `${h * 0.7}%`
                  }}
                />

              ))}

            </div>

          </div>

        </div>
      )}
    </div>
  );
};