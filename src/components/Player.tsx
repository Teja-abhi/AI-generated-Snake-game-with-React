import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "SYS.OP.01_AI_GEN", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "NEURAL_NET.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "VOID_WALKER_V2", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export function Player() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  
  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <div className="border-2 border-neon-magenta p-4 bg-void/80 backdrop-blur-sm w-full max-w-md mt-8 relative overflow-hidden group">
      <div className="absolute inset-0 bg-neon-magenta/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      <audio 
        ref={audioRef} 
        src={TRACKS[currentTrack].url} 
        onEnded={nextTrack}
        loop={false}
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className="text-xs text-neon-cyan glitch w-full text-center truncate" data-text={`PLAYING: ${TRACKS[currentTrack].title}`}>
          PLAYING: {TRACKS[currentTrack].title}
        </div>
        
        <div className="flex items-center gap-6">
          <button onClick={prevTrack} className="text-neon-cyan hover:text-neon-magenta transition-colors">
            <SkipBack size={20} />
          </button>
          
          <button onClick={togglePlay} className="text-neon-green hover:text-neon-cyan transition-colors border border-neon-green p-2 rounded-none">
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          <button onClick={nextTrack} className="text-neon-cyan hover:text-neon-magenta transition-colors">
            <SkipForward size={20} />
          </button>

          <button onClick={toggleMute} className="text-neon-cyan hover:text-neon-magenta transition-colors ml-4">
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
