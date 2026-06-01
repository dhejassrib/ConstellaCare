import { useState, useEffect, FormEvent } from 'react';
import { CareCircleNode } from '../types';
import { INITIAL_CARE_CIRCLE } from '../data';
import { Users, Heart, MessageSquare, ChevronRight } from 'lucide-react';

interface CareCircleProps {
  nodes?: CareCircleNode[];
  onAddMessage?: (message: string) => void;
}

export default function CareCircle({ nodes: propNodes, onAddMessage }: CareCircleProps) {
  const [nodes, setNodes] = useState<CareCircleNode[]>(propNodes || INITIAL_CARE_CIRCLE);
  const [selectedNode, setSelectedNode] = useState<CareCircleNode | null>(INITIAL_CARE_CIRCLE[0]);
  const [inputNote, setInputNote] = useState('');
  const [invitedEmail, setInvitedEmail] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // Slow orbital rotation emulation
  const [rotationOffset, setRotationOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotationOffset(prev => (prev + 0.15) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleInvite = (e: FormEvent) => {
    e.preventDefault();
    if (!invitedEmail) return;
    
    // Simulate adding friend to constellation circles
    const names = ['Sister Amy', 'Aunt Susan', 'Support Coach Jack', 'Brother Liam'];
    const selectedName = names[Math.floor(Math.random() * names.length)];
    const relations = ['Sibling', 'Family', 'Clinical Coach', 'Family'];
    const relation = relations[Math.floor(Math.random() * relations.length)];

    const newNode: CareCircleNode = {
      id: Math.random().toString(),
      name: selectedName,
      relationship: relation,
      lastActive: 'Just invited',
      message: 'Awaiting alignment invitation approval. Will appear in your orbits soon! ✨',
      angle: Math.random() * 360,
      distance: 110 + Math.random() * 40,
      color: '#fbbf24'
    };

    setNodes(prev => [...prev, newNode]);
    setInviteSuccess(true);
    setInvitedEmail('');
    setTimeout(() => setInviteSuccess(false), 4000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2.5xl p-6 shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* 🪐 Interactive Galaxy Orbital SVG (Left Column) */}
        <div className="flex-1 flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[280px] bg-slate-950 dark:bg-black rounded-full overflow-hidden border border-slate-800 flex items-center justify-center p-4">
            
            {/* Spinning space nebulae */}
            <div className="absolute inset-0 opacity-20 bg-radial from-violet-600/30 to-slate-950/0 animate-pulse duration-[5s]" />
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-500/10 blur-2xl rounded-full" />
            
            {/* Constellation Lines connecting orbiting elements to the center */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-150 -150 300 300">
              
              {/* Star trails (concentric orbit layers) */}
              <circle cx="0" cy="0" r="70" stroke="rgba(147, 197, 253, 0.12)" fill="none" strokeWidth="1" strokeDasharray="3,3" />
              <circle cx="0" cy="0" r="110" stroke="rgba(192, 132, 252, 0.1)" fill="none" strokeWidth="1" />
              <circle cx="0" cy="0" r="140" stroke="rgba(244, 63, 94, 0.08)" fill="none" strokeWidth="1" strokeDasharray="5,5" />

              {/* Connecting star bridges */}
              {nodes.map(node => {
                const totalAngle = (node.angle + rotationOffset) * (Math.PI / 180);
                const xIn = node.distance * Math.cos(totalAngle);
                const yIn = node.distance * Math.sin(totalAngle);
                const isSelected = selectedNode?.id === node.id;
                
                return (
                  <line
                    key={`bridge-${node.id}`}
                    x1="0"
                    y1="0"
                    x2={xIn * 0.8}
                    y2={yIn * 0.8}
                    stroke={isSelected ? '#c084fc' : 'rgba(255, 255, 255, 0.12)'}
                    strokeWidth={isSelected ? 1.5 : 0.5}
                    className="transition-all duration-300"
                  />
                );
              })}
            </svg>

            {/* ME Node at Galaxy Center */}
            <div className="relative w-[50px] h-[50px] rounded-full bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs ring-4 ring-purple-500/20 shadow-2xl animate-pulse">
              Me
              <span className="absolute -inset-1 rounded-full border border-purple-400 animate-ping opacity-30" />
            </div>

            {/* Orbiting Connections */}
            {nodes.map(node => {
              const totalAngle = (node.angle + rotationOffset) * (Math.PI / 180);
              const xPos = node.distance * Math.cos(totalAngle);
              const yPos = node.distance * Math.sin(totalAngle);
              const isSelected = selectedNode?.id === node.id;

              // Derive single-character initial
              const initial = node.name.charAt(0);

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="absolute cursor-pointer transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `calc(50% + ${xPos * 0.8}px)`,
                    top: `calc(50% + ${yPos * 0.8}px)`,
                    zIndex: isSelected ? 40 : 20
                  }}
                >
                  <div 
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all ${
                      isSelected 
                        ? 'ring-4 ring-purple-400 border border-white scale-110' 
                        : 'hover:scale-105 opacity-85 border border-slate-700/60'
                    }`}
                    style={{ backgroundColor: node.color, color: '#111827' }}
                  >
                    {initial}
                  </div>
                  {/* Small floating relationship badge */}
                  {isSelected && (
                    <span className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-purple-500 text-[8px] text-white font-extrabold tracking-widest px-1 py-0.5 rounded capitalize whitespace-nowrap">
                      {node.relationship}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-[10px] uppercase font-mono text-slate-400 tracking-wider text-center mt-3 animate-pulse">
            ★ Orbit rotating. Click nodes to fetch encouragement lines.
          </p>
        </div>

        {/* ✉️ Message Log & Interaction Panel (Right Column) */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h4 className="text-sm theme-heading text-lg font-bold flex items-center gap-2">Care Connection Node</h4>
            </div>

            {selectedNode ? (
              <div className="bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100/50 dark:border-purple-900/20 rounded-2xl p-4 transition-all">
                <div className="flex items-center justify-between pb-3 border-b border-purple-100/40 dark:border-purple-900/30">
                  <div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{selectedNode.name}</span>
                    <span className="ml-2.5 text-[10px] bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                      {selectedNode.relationship}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{selectedNode.lastActive}</span>
                </div>
                
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  {selectedNode.message || "Awaiting supportive alignment messages."}
                </p>

                {/* <p className="mt-3 text-sm theme-heading text-lg font-bold flex items-center gap-2">
                  {selectedNode.message || "Awaiting supportive alignment messages."}
                </p> */}

                <div className="mt-4 flex items-center gap-1.5 text-xs text-rose-500 font-medium">
                  <Heart className="w-4 h-4 fill-rose-500" />
                  <span>Strengthening your Constellation center index.</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 h-28 flex items-center justify-center">
                Select a profile orbit to fetch check-ins.
              </p>
            )}
          </div>

          {/* Invitation setup form */}
          <form onSubmit={handleInvite} className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">Connect New Constellation Ally</span>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="ally@family.com"
                value={invitedEmail}
                onChange={e => setInvitedEmail(e.target.value)}
                required
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white select-none text-xs font-semibold px-4 py-2 rounded-xl transition"
              >
                Send Invitation
              </button>
            </div>
            {inviteSuccess && (
              <span className="text-[10px] font-medium text-emerald-500 dark:text-emerald-400 block mt-1.5">
                ✦ Alignment invitation dispatched successfully. Your circles are growing warmer.
              </span>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}
