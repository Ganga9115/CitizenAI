import React, { useState, useRef } from 'react';
import { Upload, FileAudio, X, Play, Pause, CheckCircle2 } from 'lucide-react';

interface AudioUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileSelect, selectedFile, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/') || ['.wav', '.mp3', '.m4a', '.ogg'].some(ext => file.name.endsWith(ext))) {
        onFileSelect(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
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
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/wav,audio/mp3,audio/m4a,audio/ogg,audio/webm"
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-400 bg-indigo-600/10 scale-[1.01]'
              : 'border-white/15 bg-slate-900/60 hover:border-indigo-500/40 hover:bg-slate-900/90'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 text-indigo-400">
            <Upload className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-white mb-1">Drag & Drop Audio Complaint Call</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Supports WAV, MP3, M4A, OGG, or WEBM audio recordings (Max 25MB).
          </p>
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg"
          >
            Browse Audio Files
          </button>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <FileAudio className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm truncate max-w-xs">{selectedFile.name}</h5>
                <span className="text-xs text-slate-400 font-mono">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            </div>
            <button
              onClick={onClear}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <audio
            ref={audioRef}
            src={URL.createObjectURL(selectedFile)}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />

          <div className="flex items-center gap-4 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={togglePlay}
              className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <div className="flex-1 h-8 flex items-center gap-1 px-2 bg-slate-950 rounded-lg">
              {[40, 70, 30, 85, 100, 45, 90, 60, 35, 75, 95, 50, 80, 65, 40, 90, 100, 30, 70].map((h, i) => (
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
