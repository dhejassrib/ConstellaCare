import { useState, useEffect, FormEvent } from 'react';
import { CareCircleNode } from '../types';
import { INITIAL_CARE_CIRCLE } from '../data';
import { Users, Heart, Check, Clock } from 'lucide-react';

interface CareCircleProps {
  nodes?: CareCircleNode[];
  onAddMessage?: (message: string) => void;
}

export default function CareCircle({ nodes: propNodes, onAddMessage }: CareCircleProps) {
  // Add a tracking status flag to initial items so they start approved
  const customInitialNodes = (propNodes || INITIAL_CARE_CIRCLE).map(n => ({
    ...n,
    approved: (n as any).approved !== undefined ? (n as any).approved : true
  }));

  const [nodes, setNodes] = useState<any[]>(customInitialNodes);
  const [selectedNode, setSelectedNode] = useState<any | null>(customInitialNodes[0]);
  const [invitedEmail, setInvitedEmail] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState(false);
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
    
    // Parse the name out of the email structure dynamically!
    const extractedName = invitedEmail.split('@')[0];
    const capitalizedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);

    const relations = ['Sibling', 'Family', 'Clinical Coach', 'Friend'];
    const relation = relations[Math.floor(Math.random() * relations.length)];

    const newNode: any = {
      id: Math.random().toString(),
      name: capitalizedName,
      relationship: relation,
      lastActive: 'Just invited',
      message: 'Awaiting alignment invitation approval from member side. Orbits will finalize once approved.',
      angle: Math.random() * 360,
      distance: 100 + Math.random() * 30,
      color: '#f472b6', // Give invited connections a distinctive pink node color
      approved: false   // Set approval to false initially to flag workflow logic
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    setSelectedNode(newNode); // Auto-focus the new pending invite card
    setInviteSuccess(true);
    setInvitedEmail('');
    setTimeout(() => setInviteSuccess(false), 4000);
  };

  // Helper function to approve the invitation for live hackathon demonstration purposes
  const approveNodeHandler = (id: string) => {
    setNodes(prev => prev.map(n => {
      if (n.id === id) {
        const approvedNode = { 
          ...n, 
          approved: true, 
          lastActive: 'Active now',
          message: 'Connected to your constellation network! "I am sending you absolute radiant strength today."',
          color: '#34d399' // Turn green when approved
        };
        setSelectedNode(approvedNode);
        return approvedNode;
      }
      return n;
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2.5xl p-6 shadow-xl transition-all duration-300 text-left">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* 🪐 Interactive Galaxy Orbital SVG (Left Column) */}
        <div className="flex-1 flex flex-col items-center">
          {/* Fixed background layout class configurations for Light Mode clarity */}
          <div className="relative w-full aspect-square max-w-[280px] bg-purple-50/30 dark:bg-black rounded-full overflow-hidden border border-purple-100/60 dark:border-slate-800 flex items-center justify-center p-4 shadow-inner transition-all duration-300">
            
            <div className="absolute inset-0 opacity-30 bg-radial from-purple-400/20 dark:from-purple-600/40 to-transparent animate-pulse duration-[5s]" />
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-400/10 dark:bg-pink-500/10 blur-2xl rounded-full" />
            
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-150 -150 300 300">
              <circle cx="0" cy="0" r="65" stroke="rgba(168, 85, 247, 0.15)" fill="none" strokeWidth="1" strokeDasharray="3,3" />
              <circle cx="0" cy="0" r="105" stroke="rgba(168, 85, 247, 0.12)" fill="none" strokeWidth="1" />
              <circle cx="0" cy="0" r="135" stroke="rgba(244, 63, 94, 0.1)" fill="none" strokeWidth="1" strokeDasharray="5,5" />

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
                    stroke={isSelected ? '#c084fc' : 'currentColor'}
                    className={`transition-all duration-300 ${isSelected ? 'opacity-100' : 'text-purple-300/40 dark:text-white/15'}`}
                    strokeWidth={isSelected ? 1.8 : 0.6}
                    strokeDasharray={!node.approved ? "4,4" : undefined} // Pending nodes get dashed bridge lines
                  />
                );
              })}
            </svg>

            {/* ME Node at Galaxy Center */}
            <div className="relative w-[50px] h-[50px] rounded-full bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs ring-4 ring-purple-500/20 shadow-2xl">
              Me
              <span className="absolute -inset-1 rounded-full border border-purple-400 animate-ping opacity-30" />
            </div>

            {/* Orbiting Connections */}
            {nodes.map(node => {
              const totalAngle = (node.angle + rotationOffset) * (Math.PI / 180);
              const xPos = node.distance * Math.cos(totalAngle);
              const yPos = node.distance * Math.sin(totalAngle);
              const isSelected = selectedNode?.id === node.id;
              const initial = node.name ? node.name.charAt(0).toUpperCase() : '✦';

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
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all relative ${
                      isSelected 
                        ? 'ring-4 ring-purple-400 border border-white scale-110' 
                        : 'hover:scale-105 opacity-90 border border-slate-200 dark:border-white/20'
                    }`}
                    style={{ backgroundColor: node.color, color: '#000000' }}
                  >
                    {initial}
                    
                    {/* Tiny visual lock/clock indicator indicator for unapproved nodes */}
                    {!node.approved && (
                      <span className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 shadow-sm">
                        <Clock className="w-2 h-2" />
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <span className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-purple-600 text-[8px] text-white font-extrabold tracking-widest px-1 py-0.5 rounded capitalize whitespace-nowrap shadow">
                      {node.relationship}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-[10px] uppercase font-mono text-slate-400 dark:text-slate-500 tracking-wider text-center mt-3">
            ★ Orbit rotating. Click nodes to view ally logs.
          </p>
        </div>

        {/* ✉️ Message Log & Interaction Panel (Right Column) */}
        <div className="flex-1 flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Care Connection Node</h4>
            </div>

            {selectedNode ? (
              <div className="bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100/60 dark:border-purple-900/30 rounded-2xl p-5 transition-all shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-purple-100/60 dark:border-purple-900/20">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{selectedNode.name}</span>
                    <span className="text-[9px] bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {selectedNode.relationship}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">{selectedNode.lastActive}</span>
                </div>
                
                <p className="mt-4 text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed font-medium">
                  "{selectedNode.message}"
                </p>

                {/* Simulated pending approval system trigger dashboard block */}
                {!selectedNode.approved && (
                  <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Awaiting alignment match approval...</span>
                    </div>
                    {/* <button
                      onClick={() => approveNodeHandler(selectedNode.id)}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" /> Approve (Demo)
                    </button> */}
                  </div>
                )}

                <div className="mt-4 flex items-center gap-1.5 text-[11px] text-rose-500 font-bold">
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  <span>Strengthening your Constellation center index.</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 h-28 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                Select a profile orbit to fetch check-ins.
              </p>
            )}
          </div>

          {/* Invitation setup form */}
          <form onSubmit={handleInvite} className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Connect New Constellation</span>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="ally@family.com"
                value={invitedEmail}
                onChange={e => setInvitedEmail(e.target.value)}
                required
                className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500 placeholder-slate-400"
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white select-none text-xs font-bold px-4 py-2.5 rounded-xl transition shadow cursor-pointer"
              >
                Send Invitation
              </button>
            </div>
            {inviteSuccess && (
              <span className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 block mt-2">
                ✦ Alignment invitation dispatched successfully. Your circles are growing warmer.
              </span>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}