import { useState, useEffect } from 'react';
import type { User, Meal } from '../types';
import { Plus, Trash2, Package, Edit2 } from 'lucide-react';
import { MealPackages } from './MealPackages';
import { MealFilter } from './MealFilter';
import { EditMealModal } from './EditMealModal';
import { CATEGORIES, CUISINES, PREP_TIMES, FLAVOR_TAGS, TIME_OF_DAY_TAGS, COMMON_TAGS } from '../constants';

interface MealLibraryProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

export function MealLibrary({ user, onUpdateUser }: MealLibraryProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPackages, setShowPackages] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>(user.meals);

  // Update filtered meals whenever user.meals changes
  useEffect(() => {
    setFilteredMeals(user.meals);
  }, [user.meals]);
  const [newMeal, setNewMeal] = useState({
    name: '',
    category: '',
    tags: [] as string[],
    prepTime: '',
    cuisine: '',
    flavorTags: [] as string[],
    timeOfDayTags: [] as string[],
    notes: ''
  });
  const [customTag, setCustomTag] = useState('');
  const [customFlavorTag, setCustomFlavorTag] = useState('');
  const [customTimeTag, setCustomTimeTag] = useState('');

  const handleAddMeal = () => {
    if (!newMeal.name || !newMeal.category) {
      alert('Please fill in at least name and category');
      return;
    }

    const meal: Meal = {
      id: Date.now().toString(),
      name: newMeal.name,
      category: newMeal.category,
      tags: newMeal.tags,
      prepTime: newMeal.prepTime || undefined,
      cuisine: newMeal.cuisine || undefined,
      flavorTags: newMeal.flavorTags,
      timeOfDayTags: newMeal.timeOfDayTags,
      notes: newMeal.notes || undefined
    };

    const updatedUser = {
      ...user,
      meals: [...user.meals, meal]
    };

    updateUserData(updatedUser);
    setNewMeal({
      name: '',
      category: '',
      tags: [],
      prepTime: '',
      cuisine: '',
      flavorTags: [],
      timeOfDayTags: [],
      notes: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteMeal = (mealId: string) => {
    const updatedUser = {
      ...user,
      meals: user.meals.filter(m => m.id !== mealId)
    };
    updateUserData(updatedUser);
  };

  const handleEditMeal = (editedMeal: Meal) => {
    const updatedUser = {
      ...user,
      meals: user.meals.map(m => m.id === editedMeal.id ? editedMeal : m)
    };
    updateUserData(updatedUser);
  };

  const updateUserData = (updatedUser: User) => {
    // Update users array in localStorage
    const usersData = localStorage.getItem('users');
    const users: User[] = usersData ? JSON.parse(usersData) : [];
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    onUpdateUser(updatedUser);
  };

  const handleAddPackage = (meals: Meal[]) => {
    const updatedUser = {
      ...user,
      meals: [...user.meals, ...meals]
    };
    updateUserData(updatedUser);
    setShowPackages(false);
  };

  const toggleTag = (tag: string, field: 'tags' | 'flavorTags' | 'timeOfDayTags') => {
    const current = newMeal[field];
    if (current.includes(tag)) {
      setNewMeal({ ...newMeal, [field]: current.filter(t => t !== tag) });
    } else {
      setNewMeal({ ...newMeal, [field]: [...current, tag] });
    }
  };

  const addCustomTag = (tag: string, field: 'tags' | 'flavorTags' | 'timeOfDayTags', setter: (val: string) => void) => {
    if (tag.trim() && !newMeal[field].includes(tag.trim())) {
      setNewMeal({ ...newMeal, [field]: [...newMeal[field], tag.trim()] });
      setter('');
    }
  };

  const categories = Array.from(new Set(filteredMeals.map(m => m.category)));

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg shadow p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-foreground">Your Meal Library</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPackages(true)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors"
            >
              <Package size={18} />
              Add Package
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={18} />
              Add Meal
            </button>
          </div>
        </div>

        <MealFilter meals={user.meals} onFilteredMeals={setFilteredMeals} />

        {showAddForm && (
          <div className="bg-muted p-4 rounded-lg mb-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-foreground mb-1">Meal Name *</label>
                <input
                  type="text"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  placeholder="Meal name"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-input-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm text-foreground mb-1">Category *</label>
                <select
                  value={newMeal.category}
                  onChange={(e) => setNewMeal({ ...newMeal, category: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-input-background text-foreground"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-foreground mb-1">Cuisine</label>
                <select
                  value={newMeal.cuisine}
                  onChange={(e) => setNewMeal({ ...newMeal, cuisine: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-input-background text-foreground"
                >
                  <option value="">Select cuisine</option>
                  {CUISINES.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-foreground mb-1">Prep Time</label>
                <select
                  value={newMeal.prepTime}
                  onChange={(e) => setNewMeal({ ...newMeal, prepTime: e.target.value })}
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
              <div className="flex flex-wrap gap-2">
                {TIME_OF_DAY_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag, 'timeOfDayTags')}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      newMeal.timeOfDayTags.includes(tag)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-accent'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={customTimeTag}
                  onChange={(e) => setCustomTimeTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomTag(customTimeTag, 'timeOfDayTags', setCustomTimeTag)}
                  placeholder="Add custom time tag"
                  className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-input-background text-foreground"
                />
                <button
                  onClick={() => addCustomTag(customTimeTag, 'timeOfDayTags', setCustomTimeTag)}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent text-sm"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-foreground mb-2">Flavors</label>
              <div className="flex flex-wrap gap-2">
                {FLAVOR_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag, 'flavorTags')}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      newMeal.flavorTags.includes(tag)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-accent'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={customFlavorTag}
                  onChange={(e) => setCustomFlavorTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomTag(customFlavorTag, 'flavorTags', setCustomFlavorTag)}
                  placeholder="Add custom flavor tag"
                  className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-input-background text-foreground"
                />
                <button
                  onClick={() => addCustomTag(customFlavorTag, 'flavorTags', setCustomFlavorTag)}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent text-sm"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-foreground mb-2">Dietary & Other Tags</label>
              <div className="flex flex-wrap gap-2">
                {COMMON_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag, 'tags')}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      newMeal.tags.includes(tag)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-accent'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomTag(customTag, 'tags', setCustomTag)}
                  placeholder="Add custom tag"
                  className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-input-background text-foreground"
                />
                <button
                  onClick={() => addCustomTag(customTag, 'tags', setCustomTag)}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent text-sm"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-foreground mb-2">Notes (optional)</label>
              <textarea
                value={newMeal.notes}
                onChange={(e) => setNewMeal({ ...newMeal, notes: e.target.value })}
                placeholder="Add notes, recipes, nutritional info, etc."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-input-background text-foreground"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddMeal}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Save Meal
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {filteredMeals.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No meals found.</p>
            <p className="text-sm mt-2">Try adjusting your filters or add some meals!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map(category => (
              <div key={category}>
                <h3 className="text-foreground mb-2">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredMeals
                    .filter(meal => meal.category === category)
                    .map(meal => (
                      <div
                        key={meal.id}
                        className="bg-card border border-border rounded-lg p-3 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="text-foreground">{meal.name}</h4>
                            {meal.cuisine && (
                              <p className="text-sm text-muted-foreground">{meal.cuisine}</p>
                            )}
                            {meal.prepTime && (
                              <p className="text-xs text-muted-foreground">⏱️ {meal.prepTime}</p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => setEditingMeal(meal)}
                              className="text-primary hover:opacity-70 p-1"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteMeal(meal.id)}
                              className="text-destructive hover:opacity-70 p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {meal.timeOfDayTags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-1">
                            {meal.timeOfDayTags.map(tag => (
                              <span
                                key={tag}
                                className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {meal.flavorTags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-1">
                            {meal.flavorTags.map(tag => (
                              <span
                                key={tag}
                                className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {meal.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {meal.tags.map(tag => (
                              <span
                                key={tag}
                                className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {meal.notes && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {meal.notes}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showPackages && (
        <MealPackages
          onClose={() => setShowPackages(false)}
          onAddPackage={handleAddPackage}
        />
      )}

      {editingMeal && (
        <EditMealModal
          meal={editingMeal}
          onClose={() => setEditingMeal(null)}
          onSave={handleEditMeal}
        />
      )}
    </div>
  );
}
