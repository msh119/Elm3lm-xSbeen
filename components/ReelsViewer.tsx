
import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronUp, ChevronDown, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Reel } from '../types';

interface ReelsViewerProps {
  reels: Reel[];
  initialIndex: number;
  onClose: () => void;
}

const ReelsViewer: React.FC<ReelsViewerProps> = ({ reels, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const nextReel = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevReel = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(reels.length - 1);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [currentIndex]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-in fade-in duration-300">
      <div className="relative w-full h-full max-w-md mx-auto overflow-hidden bg-black flex items-center justify-center">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-[110] bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 transition-all"
        >
          <X size={24} />
        </button>

        {/* Video Player */}
        <video
          ref={videoRef}
          src={reels[currentIndex].videoUrl}
          className="w-full h-full object-cover"
          loop
          playsInline
          muted={isMuted}
          autoPlay
          onClick={togglePlay}
        />

        {/* Video Controls Overlay */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 bg-gradient-to-b from-black/20 via-transparent to-black/60">
           <div className="flex justify-end pt-12">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                className="pointer-events-auto bg-black/40 p-3 rounded-full text-white"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
           </div>

           {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/20 p-6 rounded-full text-white">
                  <Play size={48} fill="currentColor" />
                </div>
              </div>
           )}

           <div className="space-y-4">
              <h3 className="text-white font-black text-xl">{reels[currentIndex].title}</h3>
              <p className="text-white/80 text-xs font-bold leading-relaxed">{reels[currentIndex].description || "شاهد أحدث عروض المعلم X"}</p>
              
              <div className="flex justify-center gap-8 pt-4 pointer-events-auto">
                 <button onClick={prevReel} className="bg-white/10 hover:bg-white/20 p-4 rounded-full text-white transition-all"><ChevronUp size={24} /></button>
                 <button onClick={nextReel} className="bg-white/10 hover:bg-white/20 p-4 rounded-full text-white transition-all"><ChevronDown size={24} /></button>
              </div>
           </div>
        </div>

        {/* Progress Dots */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-[110]">
          {reels.map((_, idx) => (
            <div 
              key={idx} 
              className={`w-1 transition-all rounded-full ${idx === currentIndex ? 'h-6 bg-orange-500' : 'h-2 bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReelsViewer;
