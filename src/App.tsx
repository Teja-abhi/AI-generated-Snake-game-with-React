/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Player } from './components/Player';
import { Snake } from './components/Snake';

export default function App() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative crt scanlines p-4">
      <div className="absolute top-8 left-8 text-xs text-neon-cyan opacity-50 hidden md:block">
        <p>MEM: 0x00FF2A</p>
        <p>CPU: 99%</p>
        <p>NET: OFFLINE</p>
      </div>
      
      <h1 className="text-2xl md:text-4xl mb-8 glitch font-bold tracking-widest text-center" data-text="CYBER_SNAKE">
        CYBER_SNAKE
      </h1>
      
      <Snake />
      <Player />
      
      <div className="absolute bottom-4 right-4 text-[10px] text-neon-magenta opacity-50">
        v1.0.4 // GLITCH_ART_EDITION
      </div>
    </div>
  );
}
