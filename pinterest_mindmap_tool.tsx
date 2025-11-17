import React, { useState } from 'react';
import { Heart, MessageCircle, Download, MoreVertical, Save, Plus, Trash2 } from 'lucide-react';

export default function PinterestMindMapTool() {
  const [currentView, setCurrentView] = useState('pins'); // pins or mindmap
  const [pins, setPins] = useState([
    {
      id: 1,
      image: '📌',
      title: 'Time Management',
      likes: 234,
      comments: 45,
      liked: false,
      saved: false
    }
  ]);
  
  const [mindmapData, setMindmapData] = useState({
    title: 'Daily Schedule',
    nodes: [
      { id: 1, name: 'Work', duration: '8 hours', color: '#FF6B6B' },
      { id: 2, name: 'Exercise', duration: '1 hour', color: '#4ECDC4' },
      { id: 3, name: 'Study', duration: '2 hours', color: '#45B7D1' },
      { id: 4, name: 'Break', duration: '30 min', color: '#FFA07A' }
    ]
  });

  const [showMenu, setShowMenu] = useState(null);
  const [showSaveMenu, setShowSaveMenu] = useState(null);

  const toggleLike = (id) => {
    setPins(pins.map(pin => pin.id === id ? { ...pin, liked: !pin.liked, likes: pin.liked ? pin.likes - 1 : pin.likes + 1 } : pin));
  };

  const toggleSave = (id) => {
    setPins(pins.map(pin => pin.id === id ? { ...pin, saved: !pin.saved } : pin));
  };

  const downloadMindmap = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = 'mindmap.png';
      link.click();
    }
  };

  const addNode = () => {
    const newNode = {
      id: Math.max(...mindmapData.nodes.map(n => n.id), 0) + 1,
      name: 'New Task',
      duration: '1 hour',
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };
    setMindmapData({ ...mindmapData, nodes: [...mindmapData.nodes, newNode] });
  };

  const updateNode = (id, field, value) => {
    setMindmapData({
      ...mindmapData,
      nodes: mindmapData.nodes.map(n => n.id === id ? { ...n, [field]: value } : n)
    });
  };

  const deleteNode = (id) => {
    setMindmapData({
      ...mindmapData,
      nodes: mindmapData.nodes.filter(n => n.id !== id)
    });
  };

  // Canvas Drawing for Mind Map
  const MindMapCanvas = () => {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Center point
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 120;

      // Draw center circle
      ctx.fillStyle = '#2196F3';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(mindmapData.title, centerX, centerY);

      // Draw nodes
      mindmapData.nodes.forEach((node, index) => {
        const angle = (index / mindmapData.nodes.length) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Draw line
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Draw circle
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();

        // Draw text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.name, x, y - 8);
        ctx.fillText(node.duration, x, y + 8);
      });
    }, [mindmapData]);

    return <canvas ref={canvasRef} width={600} height={500} className="border-2 border-gray-300 rounded-lg bg-white" />;
  };

  if (currentView === 'mindmap') {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setCurrentView('pins')}
            className="mb-6 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            ← Back to Pins
          </button>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6">Time Management Mind Map</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MindMapCanvas />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Title</label>
                  <input
                    type="text"
                    value={mindmapData.title}
                    onChange={(e) => setMindmapData({ ...mindmapData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <button
                  onClick={addNode}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Plus size={20} /> Add Task
                </button>

                <div className="max-h-96 overflow-y-auto space-y-3">
                  {mindmapData.nodes.map(node => (
                    <div key={node.id} className="border p-3 rounded-lg bg-gray-50">
                      <div className="flex gap-2 mb-2">
                        <input
                          type="color"
                          value={node.color}
                          onChange={(e) => updateNode(node.id, 'color', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={node.name}
                          onChange={(e) => updateNode(node.id, 'name', e.target.value)}
                          placeholder="Task name"
                          className="flex-1 px-2 py-1 border rounded text-sm"
                        />
                        <button
                          onClick={() => deleteNode(node.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={node.duration}
                        onChange={(e) => updateNode(node.id, 'duration', e.target.value)}
                        placeholder="Duration"
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={downloadMindmap}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold"
                >
                  <Download size={20} /> Download Mind Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">📌 Pinterest</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentView('pins')}
              className="px-4 py-2 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg"
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('mindmap')}
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
            >
              Create Mind Map
            </button>
          </div>
        </div>
      </div>

      {/* Pin Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pins.map(pin => (
            <div key={pin.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Pin Image */}
              <div className="relative bg-gradient-to-br from-red-200 to-red-400 h-64 flex items-center justify-center text-6xl">
                {pin.image}
                
                {/* Top Menu */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(showMenu === pin.id ? null : pin.id)}
                      className="bg-white rounded-full p-2 shadow-md hover:shadow-lg"
                    >
                      <MoreVertical size={20} className="text-gray-700" />
                    </button>
                    
                    {showMenu === pin.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => {
                            toggleSave(pin.id);
                            setShowMenu(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Save size={16} /> Save to Collection
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm">
                          Share
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pin Title */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-3">{pin.title}</h3>

                {/* Engagement Stats */}
                <div className="flex gap-6 mb-4 text-gray-600 text-sm">
                  <span>{pin.likes} Likes</span>
                  <span>{pin.comments} Comments</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => toggleLike(pin.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition-colors ${
                      pin.liked
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Heart size={20} fill={pin.liked ? 'currentColor' : 'none'} /> Like
                  </button>

                  <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200">
                    <MessageCircle size={20} /> Comment
                  </button>

                  <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200">
                    <Download size={20} /> Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}