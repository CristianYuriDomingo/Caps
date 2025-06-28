// app/admin/page.tsx
'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
  tips: Tip[]; // Changed from single tip to array of tips
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('dashboard');

  // Auth redirects
  if (status === 'unauthenticated') router.push('/auth/signin');
  if (status === 'authenticated' && session?.user?.role !== 'admin') {
    router.push('/dashboard');
    return null;
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'content', label: 'Module Management', icon: '📚' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent />;
      case 'content':
        return <ContentManagement />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-600">Welcome, {session?.user?.name}</p>
        </div>
        
        <nav className="mt-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-100 ${
                activeSection === item.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          
          <button
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className="w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-red-50 text-red-600 mt-4"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {renderContent()}
      </div>
    </div>
  );
}

// Dashboard Overview Component
function DashboardContent() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Modules</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Lessons</h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Quiz Questions</h3>
          <p className="text-3xl font-bold text-orange-600">0</p>
        </div>
      </div>
    </div>
  );
}

// Content Management Component (Modules and Lessons)
function ContentManagement() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showAddModule, setShowAddModule] = useState(false);
  const [showModuleLessons, setShowModuleLessons] = useState(false);

  const handleViewLessons = (module: Module) => {
    setSelectedModule(module);
    setShowModuleLessons(true);
  };

  const handleBackToModules = () => {
    setShowModuleLessons(false);
    setSelectedModule(null);
  };

  if (showModuleLessons && selectedModule) {
    return <LessonManagement module={selectedModule} onBack={handleBackToModules} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Module Management</h2>
        <button 
          onClick={() => setShowAddModule(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Module
        </button>
      </div>

      {showAddModule && (
        <AddModuleForm 
          onClose={() => setShowAddModule(false)}
          onSave={(newModule) => {
            setModules([...modules, newModule]);
            setShowAddModule(false);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow border-2 border-dashed border-gray-300 text-center">
            <div className="text-gray-400 text-4xl mb-2">📚</div>
            <p className="text-gray-500">No modules created yet</p>
            <p className="text-sm text-gray-400 mt-1">Create your first learning module</p>
          </div>
        ) : (
          modules.map((module) => (
            <div key={module.id} className="bg-white p-4 rounded-lg shadow">
              <img src={module.image} alt={module.title} className="w-full h-32 object-cover rounded mb-3" />
              <h3 className="font-semibold text-lg mb-2">{module.title}</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{module.lessonCount || 0} lessons</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleViewLessons(module)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Manage Lessons
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Add Module Form Component with Image Upload
function AddModuleForm({ onClose, onSave }: { onClose: () => void; onSave: (module: Module) => void }) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!title.trim() || !imageFile) {
      alert('Please fill in all required fields and select an image');
      return;
    }

    // In a real app, you'd upload the image to your server/cloud storage
    // For now, we'll use the preview URL
    const newModule: Module = {
      id: Date.now().toString(), // In real app, this would come from your backend
      title: title.trim(),
      image: imagePreview, // In real app, this would be the uploaded image URL
      lessonCount: 0,
      status: status
    };

    onSave(newModule);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Add New Module</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Module Title *</label>
          <input 
            type="text" 
            placeholder="e.g., Crime Prevention" 
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Module Image *</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-2 rounded"
          />
          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Preview:</p>
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-32 h-20 object-cover rounded border"
              />
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select 
            className="w-full border p-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      
      <div className="mt-4 space-x-2">
        <button 
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Save Module
        </button>
        <button 
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// Lesson Management Component (for specific module)
function LessonManagement({ module, onBack }: { module: Module; onBack: () => void }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showAddLesson, setShowAddLesson] = useState(false);

  const handleSaveLesson = (newLesson: Lesson) => {
    setLessons([...lessons, newLesson]);
    setShowAddLesson(false);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-4"
        >
          ← Back to Modules
        </button>
        <div>
          <h2 className="text-2xl font-bold">Lesson Management</h2>
          <p className="text-gray-600">Managing lessons for: <strong>{module.title}</strong></p>
        </div>
        <button 
          onClick={() => setShowAddLesson(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-auto"
        >
          Add Lesson
        </button>
      </div>

      {showAddLesson && (
        <AddLessonForm 
          moduleName={module.title}
          onClose={() => setShowAddLesson(false)}
          onSave={handleSaveLesson}
        />
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold">Lessons in "{module.title}"</h3>
        </div>
        <div className="p-4">
          {lessons.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-2">📝</div>
              <p className="text-gray-500">No lessons created for this module yet</p>
              <p className="text-sm text-gray-400 mt-1">Add your first lesson to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
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
                      
                      {/* Display tips preview */}
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
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">
                        Edit
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                        Delete
                      </button>
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

// Add Lesson Form Component with Multiple Tips
function AddLessonForm({ moduleName, onClose, onSave }: { 
  moduleName: string; 
  onClose: () => void; 
  onSave: (lesson: Lesson) => void; 
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bubbleSpeech, setBubbleSpeech] = useState('');
  const [timer, setTimer] = useState(300);
  const [tips, setTips] = useState<Tip[]>([]);
  const [showAddTip, setShowAddTip] = useState(false);

  const handleAddTip = (newTip: { title: string; description: string }) => {
    const tip: Tip = {
      id: Date.now().toString() + Math.random(),
      title: newTip.title,
      description: newTip.description
    };
    setTips([...tips, tip]);
    setShowAddTip(false);
  };

  const handleRemoveTip = (tipId: string) => {
    setTips(tips.filter(tip => tip.id !== tipId));
  };

  const handleSave = () => {
    if (!title.trim() || !description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (tips.length === 0) {
      alert('Please add at least one tip for this lesson');
      return;
    }

    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      bubbleSpeech: bubbleSpeech.trim(),
      timer: timer,
      tips: tips
    };

    onSave(newLesson);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Add New Lesson to "{moduleName}"</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Lesson Title *</label>
          <input 
            type="text" 
            placeholder="e.g., Anti-Theft & Robbery Awareness" 
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lesson Description *</label>
          <textarea 
            placeholder="Brief description of what this lesson covers" 
            className="w-full border p-2 rounded h-20"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bubble Speech Text</label>
          <input 
            type="text" 
            placeholder="e.g., Enjoy Reading!" 
            className="w-full border p-2 rounded"
            value={bubbleSpeech}
            onChange={(e) => setBubbleSpeech(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Timer (seconds)</label>
          <input 
            type="number" 
            placeholder="e.g., 300 (5 minutes)" 
            className="w-full border p-2 rounded"
            value={timer}
            onChange={(e) => setTimer(Number(e.target.value))}
          />
        </div>

        {/* Tips Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Tips for Carousel *</label>
            <button
              type="button"
              onClick={() => setShowAddTip(true)}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
            >
              + Add Tip
            </button>
          </div>
          
          {tips.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 p-4 rounded text-center text-gray-500">
              No tips added yet. Add at least one tip for the carousel.
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {tips.map((tip, index) => (
                <div key={tip.id} className="border p-3 rounded bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">Tip {index + 1}: {tip.title}</h5>
                      <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveTip(tip.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Tip Modal */}
      {showAddTip && (
        <AddTipModal
          onClose={() => setShowAddTip(false)}
          onSave={handleAddTip}
          tipNumber={tips.length + 1}
        />
      )}
      
      <div className="mt-4 space-x-2">
        <button 
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Save Lesson
        </button>
        <button 
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// Add Tip Modal Component
function AddTipModal({ onClose, onSave, tipNumber }: {
  onClose: () => void;
  onSave: (tip: { title: string; description: string }) => void;
  tipNumber: number;
}) {
  const [tipTitle, setTipTitle] = useState('');
  const [tipDescription, setTipDescription] = useState('');

  const handleSave = () => {
    if (!tipTitle.trim() || !tipDescription.trim()) {
      alert('Please fill in both tip title and description');
      return;
    }

    onSave({
      title: tipTitle.trim(),
      description: tipDescription.trim()
    });

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
            <input
              type="text"
              placeholder="e.g., Be Mindful of Your Belongings"
              className="w-full border p-2 rounded"
              value={tipTitle}
              onChange={(e) => setTipTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tip Description *</label>
            <textarea
              placeholder="Detailed description for this tip"
              className="w-full border p-2 rounded h-24"
              value={tipDescription}
              onChange={(e) => setTipDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 space-x-2">
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Tip
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}