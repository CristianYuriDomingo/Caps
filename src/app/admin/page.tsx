// app/admin/page.tsx
'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Module {
  id: string;
  title: string;
  image: string;
  lessonCount: number;
  status: 'active' | 'inactive';
}

interface Tip {
  id: string;
  title: string;
  description: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  bubbleSpeech: string;
  timer: number;
  tips: Tip[];
}

interface Stats {
  totalUsers: number;
  totalModules: number;
  totalLessons: number;
  totalTips: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (status === 'unauthenticated') router.push('/auth/signin');
  if (status === 'authenticated' && session?.user?.role !== 'admin') {
    router.push('/dashboard');
    return null;
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'content', label: 'Module Management', icon: '📚' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-600">Welcome, {session?.user?.name}</p>
        </div>
        <nav className="mt-4">
          {sidebarItems.map((item) => (
            <button key={item.id} onClick={() => setActiveSection(item.id)} className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-100 ${activeSection === item.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''}`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          <button onClick={() => signOut({ callbackUrl: '/auth/signin' })} className="w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-red-50 text-red-600 mt-4">
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </nav>
      </div>
      <div className="flex-1 p-6">
        {activeSection === 'dashboard' ? <DashboardContent /> : <ContentManagement />}
      </div>
    </div>
  );
}

function DashboardContent() {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalModules: 0, totalLessons: 0, totalTips: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statItems = [
    { title: 'Total Users', value: stats.totalUsers.toString(), color: 'blue' },
    { title: 'Total Modules', value: stats.totalModules.toString(), color: 'green' },
    { title: 'Total Lessons', value: stats.totalLessons.toString(), color: 'purple' },
    { title: 'Quiz Questions', value: stats.totalTips.toString(), color: 'orange' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statItems.map((stat) => (
          <div key={stat.title} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">{stat.title}</h3>
            <p className={`text-3xl font-bold text-${stat.color}-600`}>
              {loading ? '...' : stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModuleCard({ module, onViewLessons, onDelete }: { module: Module; onViewLessons: (module: Module) => void; onDelete: (moduleId: string) => void; }) {
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md max-h-[90vh] overflow-auto relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10">×</button>
          {children}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="group relative w-60 h-80 rounded-lg overflow-hidden text-black transform-gpu shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl bg-white">
        <div className="relative w-full h-full">
          {!imageError ? (
            <img src={module.image} alt={module.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 hover:-rotate-3" onError={() => setImageError(true)} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-500">Image not available</span>
            </div>
          )}
        </div>
        <span className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#e0f7ff] via-transparent to-transparent backdrop-blur-md h-[35%] grid grid-rows-2 gap-1 p-3 items-center">
          <span className="text-lg font-bold text-[#2d87ff] drop-shadow-md leading-tight line-clamp-2">{module.title}</span>
          <span className="text-sm text-[#2d87ff] drop-shadow-md flex items-center">{module.lessonCount || 0} lessons • {module.status}</span>
        </span>
        <span className="absolute bottom-[35%] right-2 w-20 h-10 bg-[#2d87ff] flex items-center justify-center rounded-full transition-transform duration-300 hover:translate-y-[-30%] hover:bg-[#1a5bbf]">
          <button onClick={() => setIsModalOpen(true)} className="text-sm font-semibold text-white">Manage</button>
        </span>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">{module.title}</h2>
          <div className="mb-6">
            <img src={module.image} alt={module.title} className="w-full h-40 object-cover rounded-lg mb-4" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <p className="text-gray-600 mb-2"><strong>Status:</strong> {module.status}</p>
            <p className="text-gray-600 mb-4"><strong>Lessons:</strong> {module.lessonCount || 0}</p>
          </div>
          <div className="space-y-3">
            <button onClick={() => { onViewLessons(module); setIsModalOpen(false); }} className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors">Manage Lessons</button>
            <button onClick={() => { if (confirm(`Are you sure you want to delete "${module.title}"?`)) { onDelete(module.id); setIsModalOpen(false); } }} className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors">Delete Module</button>
            <button onClick={() => setIsModalOpen(false)} className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors">Close</button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function ContentManagement() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showAddModule, setShowAddModule] = useState(false);
  const [showModuleLessons, setShowModuleLessons] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/admin/modules');
      if (response.ok) {
        const data = await response.json();
        setModules(data);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    try {
      const response = await fetch(`/api/admin/modules?id=${moduleId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setModules(modules.filter(module => module.id !== moduleId));
      }
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  if (showModuleLessons && selectedModule) {
    return <LessonManagement module={selectedModule} onBack={() => { setShowModuleLessons(false); setSelectedModule(null); }} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Module Management</h2>
        <button onClick={() => setShowAddModule(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Module</button>
      </div>
      {showAddModule && <AddModuleForm onClose={() => setShowAddModule(false)} onSave={(newModule) => { setModules([...modules, newModule]); setShowAddModule(false); }} />}
      <div className="flex flex-wrap gap-6 justify-start">
        {loading ? (
          <div className="w-full text-center">Loading modules...</div>
        ) : modules.length === 0 ? (
          <div className="w-full bg-white p-8 rounded-lg shadow border-2 border-dashed border-gray-300 text-center">
            <div className="text-gray-400 text-4xl mb-2">📚</div>
            <p className="text-gray-500">No modules created yet</p>
            <p className="text-sm text-gray-400 mt-1">Create your first learning module</p>
          </div>
        ) : (
          modules.map((module) => (
            <ModuleCard key={module.id} module={module} onViewLessons={(module) => { setSelectedModule(module); setShowModuleLessons(true); }} onDelete={handleDeleteModule} />
          ))
        )}
      </div>
    </div>
  );
}

function AddModuleForm({ onClose, onSave }: { onClose: () => void; onSave: (module: Module) => void }) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !imageFile) {
      alert('Please fill in all required fields and select an image');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          image: imagePreview,
          status
        }),
      });

      if (response.ok) {
        const newModule = await response.json();
        onSave(newModule);
      } else {
        alert('Error creating module');
      }
    } catch (error) {
      console.error('Error creating module:', error);
      alert('Error creating module');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Add New Module</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Module Title *</label>
          <input type="text" placeholder="e.g., Crime Prevention" className="w-full border p-2 rounded" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Module Image *</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border p-2 rounded" />
          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Preview:</p>
              <img src={imagePreview} alt="Preview" className="w-32 h-20 object-cover rounded border" />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select className="w-full border p-2 rounded" value={status} onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="mt-4 space-x-2">
        <button onClick={handleSave} disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Module'}
        </button>
        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
      </div>
    </div>
  );
}

function LessonManagement({ module, onBack }: { module: Module; onBack: () => void }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLessons();
  }, [module.id]);

  const fetchLessons = async () => {
    try {
      const response = await fetch(`/api/admin/lessons?moduleId=${module.id}`);
      if (response.ok) {
        const data = await response.json();
        setLessons(data);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      const response = await fetch(`/api/admin/lessons?id=${lessonId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setLessons(lessons.filter(lesson => lesson.id !== lessonId));
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-4">← Back to Modules</button>
        <div>
          <h2 className="text-2xl font-bold">Lesson Management</h2>
          <p className="text-gray-600">Managing lessons for: <strong>{module.title}</strong></p>
        </div>
        <button onClick={() => setShowAddLesson(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-auto">Add Lesson</button>
      </div>
      {showAddLesson && <AddLessonForm module={module} onClose={() => setShowAddLesson(false)} onSave={(newLesson) => { setLessons([...lessons, newLesson]); setShowAddLesson(false); }} />}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold">Lessons in "{module.title}"</h3>
        </div>
        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">Loading lessons...</div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-2">📝</div>
              <p className="text-gray-500">No lessons created for this module yet</p>
              <p className="text-sm text-gray-400 mt-1">Add your first lesson to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{lesson.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{lesson.description}</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>💬 "{lesson.bubbleSpeech}"</span>
                        <span>⏱️ {lesson.timer}s</span>
                        <span>💡 {lesson.tips.length} tip{lesson.tips.length !== 1 ? 's' : ''}</span>
                      </div>
                      {lesson.tips.length > 0 && (
                        <div className="mt-3 bg-gray-50 p-3 rounded">
                          <p className="text-sm font-medium text-gray-700 mb-2">Tips Preview:</p>
                          <div className="space-y-2">
                            {lesson.tips.map((tip, tipIndex) => (
                              <div key={tip.id} className="text-xs text-gray-600">
                                <span className="font-medium">Tip {tipIndex + 1}:</span> {tip.title}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-x-2">
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">Edit</button>
                      <button onClick={() => {
                        if (confirm(`Are you sure you want to delete "${lesson.title}"?`)) {
                          handleDeleteLesson(lesson.id);
                        }
                      }} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddLessonForm({ module, onClose, onSave }: { module: Module; onClose: () => void; onSave: (lesson: Lesson) => void; }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bubbleSpeech, setBubbleSpeech] = useState('');
  const [timer, setTimer] = useState(300);
  const [tips, setTips] = useState<Tip[]>([]);
  const [showAddTip, setShowAddTip] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || tips.length === 0) {
      alert('Please fill in all required fields and add at least one tip');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          bubbleSpeech: bubbleSpeech.trim(),
          timer,
          moduleId: module.id,
          tips: tips.map(tip => ({ title: tip.title, description: tip.description }))
        }),
      });

      if (response.ok) {
        const newLesson = await response.json();
        onSave(newLesson);
      } else {
        alert('Error creating lesson');
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      alert('Error creating lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Add New Lesson to "{module.title}"</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Lesson Title *</label>
          <input type="text" placeholder="e.g., Anti-Theft & Robbery Awareness" className="w-full border p-2 rounded" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lesson Description *</label>
          <textarea placeholder="Brief description of what this lesson covers" className="w-full border p-2 rounded h-20" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bubble Speech Text</label>
          <input type="text" placeholder="e.g., Enjoy Reading!" className="w-full border p-2 rounded" value={bubbleSpeech} onChange={(e) => setBubbleSpeech(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Timer (seconds)</label>
          <input type="number" placeholder="e.g., 300 (5 minutes)" className="w-full border p-2 rounded" value={timer} onChange={(e) => setTimer(Number(e.target.value))} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Tips for Carousel *</label>
            <button type="button" onClick={() => setShowAddTip(true)} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">+ Add Tip</button>
          </div>
          {tips.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 p-4 rounded text-center text-gray-500">No tips added yet. Add at least one tip for the carousel.</div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {tips.map((tip, index) => (
                <div key={tip.id} className="border p-3 rounded bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">Tip {index + 1}: {tip.title}</h5>
                      <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
                    </div>
                    <button onClick={() => setTips(tips.filter(t => t.id !== tip.id))} className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 ml-2">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showAddTip && <AddTipModal onClose={() => setShowAddTip(false)} onSave={(newTip) => { setTips([...tips, { id: Date.now().toString() + Math.random(), ...newTip }]); setShowAddTip(false); }} tipNumber={tips.length + 1} />}
      <div className="mt-4 space-x-2">
        <button onClick={handleSave} disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Lesson'}
        </button>
        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
      </div>
    </div>
  );
}

function AddTipModal({ onClose, onSave, tipNumber }: { onClose: () => void; onSave: (tip: { title: string; description: string }) => void; tipNumber: number; }) {
  const [tipTitle, setTipTitle] = useState('');
  const [tipDescription, setTipDescription] = useState('');

  const handleSave = () => {
    if (!tipTitle.trim() || !tipDescription.trim()) {
      alert('Please fill in both tip title and description');
      return;
    }
    onSave({ title: tipTitle.trim(), description: tipDescription.trim() });
    setTipTitle('');
    setTipDescription('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full mx-4">
        <h4 className="text-lg font-semibold mb-4">Add Tip #{tipNumber}</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tip Title *</label>
            <input type="text" placeholder="e.g., Be Mindful of Your Belongings" className="w-full border p-2 rounded" value={tipTitle} onChange={(e) => setTipTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tip Description *</label>
            <textarea placeholder="Detailed description for this tip" className="w-full border p-2 rounded h-24" value={tipDescription} onChange={(e) => setTipDescription(e.target.value)} />
          </div>
        </div>
        <div className="mt-4 space-x-2">
          <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add Tip</button>
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
        </div>
      </div>
    </div>
  );
}