import React, { useState } from 'react';
import { getIngredientIcon } from './icons/AnimatedIcons.jsx';

const LOCAL_PHOTO_MAP = {
  chicken: '/ingredient-images/chicken.png',
  beef: '/ingredient-images/chicken.png',
  meat: '/ingredient-images/chicken.png',
  turkey: '/ingredient-images/chicken.png',
  pork: '/ingredient-images/chicken.png',
  garlic: '/ingredient-images/garlic.png',
  onion: '/ingredient-images/garlic.png',
  shallot: '/ingredient-images/garlic.png',
  spinach: '/ingredient-images/spinach.png',
  kale: '/ingredient-images/spinach.png',
  greens: '/ingredient-images/spinach.png',
  herb: '/ingredient-images/spinach.png',
  lemon: '/ingredient-images/lemon.png',
  lime: '/ingredient-images/lemon.png',
  citrus: '/ingredient-images/lemon.png',
  oil: '/ingredient-images/oil.png',
  butter: '/ingredient-images/oil.png',
  fat: '/ingredient-images/oil.png',
  salt: '/ingredient-images/salt.png',
  pepper: '/ingredient-images/salt.png',
  spice: '/ingredient-images/salt.png',
  seasoning: '/ingredient-images/salt.png',
  vegetable: '/ingredient-images/vegetable.png',
  tomato: '/ingredient-images/vegetable.png',
  carrot: '/ingredient-images/vegetable.png'
};

export default function IngredientImage({ iconKeyword = '', name = '', className = 'w-12 h-12' }) {
  const [imageError, setImageError] = useState(false);

  const getKey = () => {
    const term = (iconKeyword || name).toLowerCase();
    for (const key of Object.keys(LOCAL_PHOTO_MAP)) {
      if (term.includes(key)) return key;
    }
    return null;
  };

  const matchedKey = getKey();
  const photoUrl = matchedKey ? LOCAL_PHOTO_MAP[matchedKey] : null;

  // If a photo exists and hasn't errored, render real photographic thumbnail
  if (photoUrl && !imageError) {
    return (
      <div className={`${className} rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-md shrink-0 relative group`}>
        <img
          src={photoUrl}
          alt={name || iconKeyword}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
    );
  }

  // Graceful Fallback: Render our animated SVG icon suite if no photo is available or if photo fails to load
  return (
    <div className={`${className} rounded-2xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-inner`}>
      {getIngredientIcon(iconKeyword, name)}
    </div>
  );
}
