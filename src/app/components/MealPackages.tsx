import type { Meal } from '../types';
import { X } from 'lucide-react';

interface MealPackagesProps {
  onClose: () => void;
  onAddPackage: (meals: Meal[]) => void;
}

const PACKAGES: { [key: string]: { name: string; description: string; meals: Omit<Meal, 'id'>[] } } = {
  fastFood: {
    name: 'Fast Food Favorites',
    description: 'Popular fast food chains',
    meals: [
      { name: "McDonald's", category: 'Fast Food', tags: ['Quick & Easy'], cuisine: 'American', prepTime: '10min', flavorTags: ['Salty', 'Savory'], timeOfDayTags: ['Lunch', 'Dinner'] },
      { name: 'Burger King', category: 'Fast Food', tags: ['Quick & Easy'], cuisine: 'American', prepTime: '10min', flavorTags: ['Salty', 'Savory'], timeOfDayTags: ['Lunch', 'Dinner'] },
      { name: 'Wendy\'s', category: 'Fast Food', tags: ['Quick & Easy'], cuisine: 'American', prepTime: '10min', flavorTags: ['Salty', 'Savory'], timeOfDayTags: ['Lunch', 'Dinner'] },
      { name: 'Taco Bell', category: 'Fast Food', tags: ['Quick & Easy'], cuisine: 'Mexican', prepTime: '10min', flavorTags: ['Spicy', 'Savory'], timeOfDayTags: ['Lunch', 'Dinner', 'Late Night'] },
      { name: 'Chipotle', category: 'Fast Food', tags: ['Quick & Easy', 'Healthy'], cuisine: 'Mexican', prepTime: '15min', flavorTags: ['Savory', 'Spicy'], timeOfDayTags: ['Lunch', 'Dinner'] },
      { name: 'Subway', category: 'Fast Food', tags: ['Quick & Easy', 'Healthy'], cuisine: 'American', prepTime: '10min', flavorTags: ['Savory', 'Light'], timeOfDayTags: ['Lunch', 'Dinner'] },
      { name: 'Pizza Hut', category: 'Fast Food', tags: ['Comfort Food'], cuisine: 'Italian', prepTime: '20min', flavorTags: ['Salty', 'Savory'], timeOfDayTags: ['Lunch', 'Dinner'] },
      { name: 'Domino\'s', category: 'Fast Food', tags: ['Comfort Food'], cuisine: 'Italian', prepTime: '20min', flavorTags: ['Salty', 'Savory'], timeOfDayTags: ['Lunch', 'Dinner'] },
      { name: 'KFC', category: 'Fast Food', tags: ['Quick & Easy'], cuisine: 'American', prepTime: '15min', flavorTags: ['Salty', 'Savory'], timeOfDayTags: ['Lunch', 'Dinner'] },
      { name: 'Chick-fil-A', category: 'Fast Food', tags: ['Quick & Easy'], cuisine: 'American', prepTime: '10min', flavorTags: ['Salty', 'Savory'], timeOfDayTags: ['Breakfast', 'Lunch', 'Dinner'] },
      { name: 'Panda Express', category: 'Fast Food', tags: ['Quick & Easy'], cuisine: 'Chinese', prepTime: '10min', flavorTags: ['Sweet', 'Savory'], timeOfDayTags: ['Lunch', 'Dinner'] },
      { name: 'Five Guys', category: 'Fast Food', tags: ['Comfort Food'], cuisine: 'American', prepTime: '15min', flavorTags: ['Salty', 'Savory'], timeOfDayTags: ['Lunch', 'Dinner'] }
    ]
  },
  homeCookedQuick: {
    name: 'Quick Home Meals',
    description: 'Easy meals under 30 minutes',
    meals: [
      { name: 'Spaghetti', category: 'Home Cooked', tags: ['Quick & Easy', 'Comfort Food'], cuisine: 'Italian', prepTime: '20min', flavorTags: ['Savory', 'Rich'], timeOfDayTags: ['Lunch', 'Dinner'] },
      { name: 'Grilled Cheese', category: 'Home Cooked', tags: ['Quick & Easy', 'Comfort Food', 'Kid-Friendly'], cuisine: 'American', prepTime: '10min', flavorTags: ['Salty', 'Rich'], timeOfDayTags: ['Lunch', 'Snack'] },
      { name: 'Scrambled Eggs', category: 'Home Cooked', tags: ['Quick & Easy', 'High-Protein'], cuisine: 'American', prepTime: '10min', flavorTags: ['Savory', 'Mild'], timeOfDayTags: ['Breakfast'] },
      { name: 'Quesadilla', category: 'Home Cooked', tags: ['Quick & Easy', 'Kid-Friendly'], cuisine: 'Mexican', prepTime: '15min', flavorTags: ['Salty', 'Savory'], timeOfDayTags: ['Lunch', 'Dinner', 'Snack'] },
      { name: 'Ramen (upgraded)', category: 'Home Cooked', tags: ['Quick & Easy'], cuisine: 'Japanese', prepTime: '15min', flavorTags: ['Savory', 'Umami'], timeOfDayTags: ['Lunch', 'Dinner', 'Late Night'] },
      { name: 'Stir Fry', category: 'Home Cooked', tags: ['Quick & Easy', 'Healthy'], cuisine: 'Chinese', prepTime: '25min', flavorTags: ['Savory', 'Umami'], timeOfDayTags: ['Lunch', 'Dinner'] },
      { name: 'Tacos', category: 'Home Cooked', tags: ['Quick & Easy', 'Kid-Friendly'], cuisine: 'Mexican', prepTime: '20min', flavorTags: ['Savory', 'Spicy'], timeOfDayTags: ['Lunch', 'Dinner'] },
      { name: 'BLT Sandwich', category: 'Home Cooked', tags: ['Quick & Easy'], cuisine: 'American', prepTime: '15min', flavorTags: ['Salty', 'Savory'], timeOfDayTags: ['Lunch'] }
    ]
  },
  familyDinners: {
    name: 'Family Dinner Classics',
    description: 'Traditional family meals',
    meals: [
      { name: 'Meatloaf', category: 'Home Cooked', tags: ['Comfort Food', 'Kid-Friendly'], cuisine: 'American', prepTime: '1hr', flavorTags: ['Savory', 'Rich'], timeOfDayTags: ['Dinner'] },
      { name: 'Roast Chicken', category: 'Home Cooked', tags: ['Comfort Food', 'High-Protein'], cuisine: 'American', prepTime: '1.5hr', flavorTags: ['Savory', 'Rich'], timeOfDayTags: ['Dinner'] },
      { name: 'Lasagna', category: 'Home Cooked', tags: ['Comfort Food', 'Kid-Friendly'], cuisine: 'Italian', prepTime: '1hr', flavorTags: ['Rich', 'Savory'], timeOfDayTags: ['Dinner'] },
      { name: 'Pot Roast', category: 'Home Cooked', tags: ['Comfort Food'], cuisine: 'American', prepTime: '3hr+', flavorTags: ['Rich', 'Savory'], timeOfDayTags: ['Dinner'] },
      { name: 'Spaghetti and Meatballs', category: 'Home Cooked', tags: ['Comfort Food', 'Kid-Friendly'], cuisine: 'Italian', prepTime: '45min', flavorTags: ['Savory', 'Rich'], timeOfDayTags: ['Dinner'] },
      { name: 'Baked Ziti', category: 'Home Cooked', tags: ['Comfort Food', 'Kid-Friendly'], cuisine: 'Italian', prepTime: '1hr', flavorTags: ['Rich', 'Savory'], timeOfDayTags: ['Dinner'] },
      { name: 'Chicken Alfredo', category: 'Home Cooked', tags: ['Comfort Food'], cuisine: 'Italian', prepTime: '30min', flavorTags: ['Rich', 'Savory'], timeOfDayTags: ['Dinner'] },
      { name: 'Beef Stew', category: 'Home Cooked', tags: ['Comfort Food'], cuisine: 'American', prepTime: '2hr', flavorTags: ['Rich', 'Savory'], timeOfDayTags: ['Dinner'] },
      { name: 'Shepherd\'s Pie', category: 'Home Cooked', tags: ['Comfort Food'], cuisine: 'British', prepTime: '1hr', flavorTags: ['Savory', 'Rich'], timeOfDayTags: ['Dinner'] },
      { name: 'Fried Chicken', category: 'Home Cooked', tags: ['Comfort Food', 'Kid-Friendly'], cuisine: 'American', prepTime: '45min', flavorTags: ['Salty', 'Savory'], timeOfDayTags: ['Dinner'] }
    ]
  },
  pizza: {
    name: 'Pizza Places',
    description: 'Local and chain pizza restaurants',
    meals: [
      { name: 'Pizza Hut', category: 'Fast Food', tags: ['Comfort Food'], cuisine: 'Italian', prepTime: '30min', flavorTags: ['Salty', 'Savory'], timeOfDayTags: ['Lunch', 'Dinner'] },
      { name: 'Domino\'s', category: 'Fast Food', tags: ['Comfort Food'], cuisine: 'Italian', prepTime: '30min', flavorTags: ['Salty', 'Savory'], timeOfDayTags: ['Lunch', 'Dinner'] },
      { name: 'Papa John\'s', category: 'Fast Food', tags: ['Comfort Food'], cuisine: 'Italian', prepTime: '30min', flavorTags: ['Salty', 'Savory'], timeOfDayTags: ['Lunch', 'Dinner'] },
      { name: 'Little Caesars', category: 'Fast Food', tags: ['Quick & Easy', 'Comfort Food'], cuisine: 'Italian', prepTime: '15min', flavorTags: ['Salty', 'Savory'], timeOfDayTags: ['Lunch', 'Dinner'] },
      { name: 'Local Pizza Shop', category: 'Restaurant', tags: ['Comfort Food'], cuisine: 'Italian', prepTime: '30min', flavorTags: ['Savory', 'Rich'], timeOfDayTags: ['Lunch', 'Dinner'] }
    ]
  },
  breakfast: {
    name: 'Breakfast Options',
    description: 'Start your day right',
    meals: [
      { name: 'Pancakes', category: 'Home Cooked', tags: ['Comfort Food', 'Kid-Friendly'], cuisine: 'American', prepTime: '20min', flavorTags: ['Sweet', 'Light'], timeOfDayTags: ['Breakfast', 'Brunch'] },
      { name: 'Waffles', category: 'Home Cooked', tags: ['Comfort Food', 'Kid-Friendly'], cuisine: 'American', prepTime: '20min', flavorTags: ['Sweet', 'Light'], timeOfDayTags: ['Breakfast', 'Brunch'] },
      { name: 'French Toast', category: 'Home Cooked', tags: ['Comfort Food', 'Kid-Friendly'], cuisine: 'French', prepTime: '15min', flavorTags: ['Sweet', 'Rich'], timeOfDayTags: ['Breakfast', 'Brunch'] },
      { name: 'Bacon and Eggs', category: 'Home Cooked', tags: ['High-Protein'], cuisine: 'American', prepTime: '15min', flavorTags: ['Salty', 'Savory'], timeOfDayTags: ['Breakfast'] },
      { name: 'Omelette', category: 'Home Cooked', tags: ['Healthy', 'High-Protein'], cuisine: 'French', prepTime: '15min', flavorTags: ['Savory', 'Rich'], timeOfDayTags: ['Breakfast', 'Brunch'] },
      { name: 'Cereal', category: 'Home Cooked', tags: ['Quick & Easy', 'Kid-Friendly'], cuisine: 'American', prepTime: '5min', flavorTags: ['Sweet', 'Light'], timeOfDayTags: ['Breakfast'] },
      { name: 'Bagel and Cream Cheese', category: 'Home Cooked', tags: ['Quick & Easy'], cuisine: 'American', prepTime: '5min', flavorTags: ['Savory', 'Mild'], timeOfDayTags: ['Breakfast', 'Snack'] }
    ]
  },
  asian: {
    name: 'Asian Cuisine',
    description: 'Popular Asian dishes and restaurants',
    meals: [
      { name: 'Panda Express', category: 'Fast Food', tags: ['Quick & Easy'], cuisine: 'Chinese', prepTime: '15min', flavorTags: ['Sweet', 'Savory'], timeOfDayTags: ['Lunch', 'Dinner'] },
      { name: 'Sushi Restaurant', category: 'Restaurant', tags: ['Healthy', 'Fancy'], cuisine: 'Japanese', prepTime: '30min', flavorTags: ['Umami', 'Light'], timeOfDayTags: ['Lunch', 'Dinner'] },
      { name: 'Thai Restaurant', category: 'Restaurant', tags: ['Fancy'], cuisine: 'Thai', prepTime: '30min', flavorTags: ['Spicy', 'Sweet', 'Sour'], timeOfDayTags: ['Lunch', 'Dinner'] },
      { name: 'Pho', category: 'Restaurant', tags: ['Comfort Food', 'Healthy'], cuisine: 'Vietnamese', prepTime: '30min', flavorTags: ['Savory', 'Umami'], timeOfDayTags: ['Lunch', 'Dinner'] },
      { name: 'Fried Rice', category: 'Home Cooked', tags: ['Quick & Easy'], cuisine: 'Chinese', prepTime: '20min', flavorTags: ['Savory', 'Umami'], timeOfDayTags: ['Lunch', 'Dinner'] },
      { name: 'Lo Mein', category: 'Home Cooked', tags: ['Quick & Easy'], cuisine: 'Chinese', prepTime: '25min', flavorTags: ['Savory', 'Umami'], timeOfDayTags: ['Lunch', 'Dinner'] },
      { name: 'Pad Thai', category: 'Home Cooked', tags: [], cuisine: 'Thai', prepTime: '30min', flavorTags: ['Sweet', 'Sour', 'Spicy'], timeOfDayTags: ['Lunch', 'Dinner'] }
    ]
  }
};

export function MealPackages({ onClose, onAddPackage }: MealPackagesProps) {
  const handleAddPackage = (packageKey: string) => {
    const pkg = PACKAGES[packageKey];
    const meals: Meal[] = pkg.meals.map(meal => ({
      ...meal,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));
    onAddPackage(meals);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-foreground">Meal Packages</h2>
            <p className="text-sm text-muted-foreground">Add multiple meals at once to quickly build your library</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-2"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(PACKAGES).map(([key, pkg]) => (
              <div key={key} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow bg-card">
                <h3 className="text-foreground mb-2">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{pkg.description}</p>
                <p className="text-xs text-muted-foreground mb-3">{pkg.meals.length} meals included</p>
                <button
                  onClick={() => handleAddPackage(key)}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Add Package
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
