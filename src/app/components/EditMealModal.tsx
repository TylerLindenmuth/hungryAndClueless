import { useState } from 'react';
import { X } from 'lucide-react';
import type { Meal } from '../types';
import { CATEGORIES, CUISINES, PREP_TIMES, FLAVOR_TAGS, TIME_OF_DAY_TAGS, COMMON_TAGS } from '../constants';

interface EditMealModalProps {
  meal: Meal;
  onClose: () => void;
  onSave: (meal: Meal) => void;
}

export function EditMealModal({ meal, onClose, onSave }: EditMealModalProps) {
  const [editedMeal, setEditedMeal] = useState<Meal>({ ...meal });
  const [newTag, setNewTag] = useState('');
  const [newFlavorTag, setNewFlavorTag] = useState('');
  const [newTimeTag, setNewTimeTag] = useState('');

  const handleSave = () => {
    if (!editedMeal.name || !editedMeal.category) {
      alert('Please fill in at least name and category');
      return;
    }
    onSave(editedMeal);
    onClose();
  };

  const addTag = (tag: string, field: 'tags' | 'flavorTags' | 'timeOfDayTags') => {
    if (tag && !editedMeal[field].includes(tag)) {
      setEditedMeal({
        ...editedMeal,
        [field]: [...editedMeal[field], tag]
      });
    }
  };

  const removeTag = (tag: string, field: 'tags' | 'flavorTags' | 'timeOfDayTags') => {
    setEditedMeal({
      ...editedMeal,
      [field]: editedMeal[field].filter(t => t !== tag)
    });
  };

  const addCustomTag = (customTag: string, field: 'tags' | 'flavorTags' | 'timeOfDayTags', setter: (val: string) => void) => {
    if (customTag.trim()) {
      addTag(customTag.trim(), field);
      setter('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-foreground">Edit Meal</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-2">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground mb-2">Meal Name *</label>
              <input
                type="text"
                value={editedMeal.name}
                onChange={(e) => setEditedMeal({ ...editedMeal, name: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-input-background text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm text-foreground mb-2">Category *</label>
              <select
                value={editedMeal.category}
                onChange={(e) => setEditedMeal({ ...editedMeal, category: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-input-background text-foreground"
              >
                <option value="">Select category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground mb-2">Cuisine</label>
              <select
                value={editedMeal.cuisine || ''}
                onChange={(e) => setEditedMeal({ ...editedMeal, cuisine: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-input-background text-foreground"
              >
                <option value="">Select cuisine</option>
                {CUISINES.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-foreground mb-2">Prep Time</label>
              <select
                value={editedMeal.prepTime || ''}
                onChange={(e) => setEditedMeal({ ...editedMeal, prepTime: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-input-background text-foreground"
              >
                <option value="">Select time</option>
                {PREP_TIMES.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-foreground mb-2">Time of Day</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editedMeal.timeOfDayTags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm"
                >
                  {tag}
                  <button onClick={() => removeTag(tag, 'timeOfDayTags')} className="hover:opacity-70">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {TIME_OF_DAY_TAGS.filter(t => !editedMeal.timeOfDayTags.includes(t)).map(tag => (
                <button
                  key={tag}
                  onClick={() => addTag(tag, 'timeOfDayTags')}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-accent transition-colors"
                >
                  + {tag}
                </button>
              ))}
              <div className="flex gap-2 w-full mt-2">
                <input
                  type="text"
                  value={newTimeTag}
                  onChange={(e) => setNewTimeTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomTag(newTimeTag, 'timeOfDayTags', setNewTimeTag)}
                  placeholder="Custom time tag"
                  className="flex-1 px-3 py-1 border border-border rounded-lg text-sm bg-input-background text-foreground"
                />
                <button
                  onClick={() => addCustomTag(newTimeTag, 'timeOfDayTags', setNewTimeTag)}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-lg text-sm hover:bg-accent"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-foreground mb-2">Flavor Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editedMeal.flavorTags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm"
                >
                  {tag}
                  <button onClick={() => removeTag(tag, 'flavorTags')} className="hover:opacity-70">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {FLAVOR_TAGS.filter(t => !editedMeal.flavorTags.includes(t)).map(tag => (
                <button
                  key={tag}
                  onClick={() => addTag(tag, 'flavorTags')}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-accent transition-colors"
                >
                  + {tag}
                </button>
              ))}
              <div className="flex gap-2 w-full mt-2">
                <input
                  type="text"
                  value={newFlavorTag}
                  onChange={(e) => setNewFlavorTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomTag(newFlavorTag, 'flavorTags', setNewFlavorTag)}
                  placeholder="Custom flavor tag"
                  className="flex-1 px-3 py-1 border border-border rounded-lg text-sm bg-input-background text-foreground"
                />
                <button
                  onClick={() => addCustomTag(newFlavorTag, 'flavorTags', setNewFlavorTag)}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-lg text-sm hover:bg-accent"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-foreground mb-2">Dietary & Other Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editedMeal.tags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                >
                  {tag}
                  <button onClick={() => removeTag(tag, 'tags')} className="hover:opacity-70">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {COMMON_TAGS.filter(t => !editedMeal.tags.includes(t)).map(tag => (
                <button
                  key={tag}
                  onClick={() => addTag(tag, 'tags')}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-accent transition-colors"
                >
                  + {tag}
                </button>
              ))}
              <div className="flex gap-2 w-full mt-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomTag(newTag, 'tags', setNewTag)}
                  placeholder="Custom tag"
                  className="flex-1 px-3 py-1 border border-border rounded-lg text-sm bg-input-background text-foreground"
                />
                <button
                  onClick={() => addCustomTag(newTag, 'tags', setNewTag)}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-lg text-sm hover:bg-accent"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-foreground mb-2">Notes</label>
            <textarea
              value={editedMeal.notes || ''}
              onChange={(e) => setEditedMeal({ ...editedMeal, notes: e.target.value })}
              placeholder="Add notes, recipes, nutritional info, etc."
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-input-background text-foreground"
            />
          </div>
        </div>

        <div className="flex gap-2 p-6 border-t border-border">
          <button
            onClick={handleSave}
            className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
