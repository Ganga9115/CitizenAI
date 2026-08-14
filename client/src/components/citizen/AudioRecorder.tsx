import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Pause, Trash2, CheckCircle2 } from 'lucide-react';

interface AudioRecorderProps {
  onRecorded: (file: File) => void;
  recordedFile: File | null;
  onClear: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecorded, recordedFile, onClear }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const file = new File([audioBlob], `recorded-call-${Date.now()}.wav`, { type: 'audio/wav' });
        onRecorded(file);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access permission denied or unavailable.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/15 text-center space-y-6">
      {!recordedFile ? (
        <div className="space-y-6">
          <div className="relative inline-block">
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-500 animate-pulse text-white scale-105'
                  : 'bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white'
              }`}
            >
              {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>

            {isRecording && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
            )}
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-1">
              {isRecording ? 'Recording Citizen Call...' : 'Click Microphone to Record'}
            </h4>
            <p className="text-xs text-slate-400">
              {isRecording
                ? `Recording duration: ${formatTime(recordingTime)}`
                : 'Speak clearly to describe your complaint, location, and urgency.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-2 font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Live Voice Recording Saved
            </span>
            <button
              onClick={onClear}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <audio
            ref={audioRef}
            src={URL.createObjectURL(recordedFile)}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />

          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={togglePlay}
              className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <div className="flex-1 h-10 flex items-center gap-1 px-3 bg-slate-950 rounded-xl">
              {[50, 80, 40, 95, 100, 60, 85, 70, 45, 90, 100, 65, 80, 75].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all ${
                    isPlaying ? 'bg-indigo-400 animate-pulse' : 'bg-slate-700'
                  }`}
                  style={{ height: `${h * 0.7}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
