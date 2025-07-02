// app/admin/content/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Module, Lesson, Tip } from '../types';

function ModuleCard({ module, onViewLessons, onDelete }: { 
  module: Module; 
  onViewLessons: (module: Module) => void; 
  onDelete: (moduleId: string) => void; 
}) {
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const Modal = ({ isOpen, onClose, children }: { 
    isOpen: boolean; 
    onClose: () => void; 
    children: React.ReactNode; 
  }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md max-h-[90vh] overflow-auto relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
          >
            ×
          </button>
          {children}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition-shadow w-72">
        <div className="relative">
          {!imageError ? (
            <img 
              src={module.image} 
              alt={module.title} 
              className="w-full h-48 object-cover rounded-t-2xl" 
              onError={() => setImageError(true)} 
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded-t-2xl">
              <span className="text-4xl">📚</span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="font-bold text-xl mb-3 text-gray-800">{module.title}</h3>
          <div className="flex items-center justify-between mb-4">
            <span className="text-blue-500 font-medium text-sm">
              {module.lessonCount || 0} Lessons {module.lessonCount > 0 ? `1/${module.lessonCount}` : ''}
            </span>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-full font-medium transition-colors"
          >
            Review
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">{module.title}</h2>
          <div className="mb-6">
            <img 
              src={module.image} 
              alt={module.title} 
              className="w-full h-32 object-cover rounded-lg mb-4" 
              onError={(e) => { e.currentTarget.style.display = 'none'; }} 
            />
            <p className="text-gray-600 mb-4"><strong>Lessons:</strong> {module.lessonCount || 0}</p>
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => { 
                onViewLessons(module); 
                setIsModalOpen(false); 
              }} 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors"
            >
              Manage Lessons
            </button>
            <button 
              onClick={() => { 
                if (confirm(`Are you sure you want to delete "${module.title}"?`)) { 
                  onDelete(module.id); 
                  setIsModalOpen(false); 
                } 
              }} 
              className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition-colors"
            >
              Delete Module
            </button>
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function AddModuleForm({ onClose, onSave }: { 
  onClose: () => void; 
  onSave: (module: Module) => void; 
}) {
  const [title, setTitle] = useState('');
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
          image: imagePreview
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
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <h3 className="text-lg font-semibold mb-4">Add New Module</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Module Title *</label>
          <input 
            type="text" 
            placeholder="e.g., Crime Prevention" 
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
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
            className="w-full border border-gray-300 p-3 rounded-lg" 
          />
          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Preview:</p>
              <img src={imagePreview} alt="Preview" className="w-32 h-20 object-cover rounded border" />
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 flex space-x-3">
        <button 
          onClick={handleSave} 
          disabled={loading} 
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Module'}
        </button>
        <button 
          onClick={onClose} 
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

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
            <input 
              type="text" 
              placeholder="e.g., Be Mindful of Your Belongings" 
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={tipTitle} 
              onChange={(e) => setTipTitle(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tip Description *</label>
            <textarea 
              placeholder="Detailed description for this tip" 
              className="w-full border border-gray-300 p-3 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={tipDescription} 
              onChange={(e) => setTipDescription(e.target.value)} 
            />
          </div>
        </div>
        <div className="mt-6 flex space-x-3">
          <button 
            onClick={handleSave} 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add Tip
          </button>
          <button 
            onClick={onClose} 
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function AddLessonForm({ module, onClose, onSave }: { 
  module: Module; 
  onClose: () => void; 
  onSave: (lesson: Lesson) => void; 
}) {
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
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <h3 className="text-lg font-semibold mb-4">Add New Lesson to "{module.title}"</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Lesson Title *</label>
          <input 
            type="text" 
            placeholder="e.g., Anti-Theft & Robbery Awareness" 
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lesson Description *</label>
          <textarea 
            placeholder="Brief description of what this lesson covers" 
            className="w-full border border-gray-300 p-3 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bubble Speech Text</label>
          <input 
            type="text" 
            placeholder="e.g., Enjoy Reading!" 
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            value={bubbleSpeech} 
            onChange={(e) => setBubbleSpeech(e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Timer (seconds)</label>
          <input 
            type="number" 
            placeholder="e.g., 300 (5 minutes)" 
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            value={timer} 
            onChange={(e) => setTimer(Number(e.target.value))} 
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Tips for Carousel *</label>
            <button 
              type="button" 
              onClick={() => setShowAddTip(true)} 
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              + Add Tip
            </button>
          </div>
          {tips.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center text-gray-500">
              No tips added yet. Add at least one tip for the carousel.
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-4">
              {tips.map((tip, index) => (
                <div key={tip.id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm mb-1">Tip {index + 1}: {tip.title}</h5>
                      <p className="text-xs text-gray-600">{tip.description}</p>
                    </div>
                    <button 
                      onClick={() => setTips(tips.filter(t => t.id !== tip.id))} 
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors ml-2"
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
      
      {showAddTip && (
        <AddTipModal 
          onClose={() => setShowAddTip(false)} 
          onSave={(newTip) => { 
            setTips([...tips, { id: Date.now().toString() + Math.random(), ...newTip }]); 
            setShowAddTip(false); 
          }} 
          tipNumber={tips.length + 1} 
        />
      )}
      
      <div className="mt-6 flex space-x-3">
        <button 
          onClick={handleSave} 
          disabled={loading} 
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Lesson'}
        </button>
        <button 
          onClick={onClose} 
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function LessonManagement({ module, onBack }: { 
  module: Module; 
  onBack: () => void; 
}) {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack} 
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ← Back to Modules
          </button>
          <div>
            <h1 className="text-2xl font-bold">Lesson Management</h1>
            <p className="text-gray-600">Managing lessons for: <strong>{module.title}</strong></p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddLesson(true)} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Add Lesson</span>
        </button>
      </div>

      {showAddLesson && (
        <AddLessonForm 
          module={module} 
          onClose={() => setShowAddLesson(false)} 
          onSave={(newLesson) => { 
            setLessons([...lessons, newLesson]); 
            setShowAddLesson(false); 
          }} 
        />
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Lessons in "{module.title}"</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Loading lessons...</span>
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons created for this module yet</h3>
              <p className="text-gray-600 mb-6">Add your first lesson to get started</p>
              <button
                onClick={() => setShowAddLesson(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Create First Lesson
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">{lesson.title}</h4>
                      <p className="text-gray-600 mb-3">{lesson.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          💬 <span className="ml-1">"{lesson.bubbleSpeech}"</span>
                        </span>
                        <span className="flex items-center">
                          ⏱️ <span className="ml-1">{lesson.timer}s</span>
                        </span>
                        <span className="flex items-center">
                          💡 <span className="ml-1">{lesson.tips.length} tip{lesson.tips.length !== 1 ? 's' : ''}</span>
                        </span>
                      </div>
                      {lesson.tips.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-2">Tips Preview:</p>
                          <div className="space-y-1">
                            {lesson.tips.slice(0, 3).map((tip, tipIndex) => (
                              <div key={tip.id} className="text-sm text-gray-600">
                                <span className="font-medium">Tip {tipIndex + 1}:</span> {tip.title}
                              </div>
                            ))}
                            {lesson.tips.length > 3 && (
                              <div className="text-sm text-gray-500 italic">
                                +{lesson.tips.length - 3} more tips...
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        Edit
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${lesson.title}"?`)) {
                            handleDeleteLesson(lesson.id);
                          }
                        }} 
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
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

export default function ContentManagement() {
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
            <ModuleCard 
              key={module.id} 
              module={module} 
              onViewLessons={(module) => { 
                setSelectedModule(module); 
                setShowModuleLessons(true); 
              }} 
              onDelete={handleDeleteModule} 
            />
          ))
        )}
      </div>
    </div>
  );
}