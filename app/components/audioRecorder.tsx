
// components/AudioRecorder.tsx
import React, { useState } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { Mic, MicOff, X } from 'lucide-react';

interface AudioRecorderProps {
  onRecorded: (file: Blob, url: string) => void;
  onError: (error: string) => void;
  maxDuration?: number;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecorded,
  onError,
  maxDuration = 60
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const { isRecording, recordingTime, startRecording, stopRecording, cancelRecording, setOnRecordingComplete } = useAudioRecorder();

  React.useEffect(() => {
    setOnRecordingComplete(onRecorded);
  }, [onRecorded, setOnRecordingComplete]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(false);
    handleStartRecording();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isRecording) {
      const deltaX = startX - e.clientX;
      if (deltaX > 100) {
        setIsDragging(true);
      }
    }
  };

  const handleMouseUp = () => {
    if (isRecording) {
      if (isDragging) {
        cancelRecording();
        onError('Recording cancelled');
      } else {
        stopRecording();
      }
    }
    setIsDragging(false);
  };

  const handleStartRecording = async () => {
    try {
      await startRecording();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Recording failed');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2">
      {isRecording && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-red-500">{formatTime(recordingTime)}</span>
          {isDragging && (
            <span className="text-red-500 text-xs">Swipe left to cancel</span>
          )}
        </div>
      )}
      <button
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`p-2 rounded-full transition-colors ${
          isRecording 
            ? isDragging 
              ? 'bg-red-500 text-white' 
              : 'bg-blue-500 text-white'
            : 'hover:bg-gray-100'
        }`}
        disabled={recordingTime >= maxDuration}
      >
        {isRecording ? (
          isDragging ? <X size={20} /> : <MicOff size={20} />
        ) : (
          <Mic size={20} />
        )}
      </button>
    </div>
  );
};