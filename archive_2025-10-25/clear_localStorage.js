// Clear localStorage and start fresh
// Run this in your browser console (F12 -> Console)

console.log('Clearing localStorage...');

// Clear all vendor application related data
localStorage.removeItem('vendorApplicationId');
localStorage.removeItem('vendorApplicationData');
localStorage.removeItem('selectedStall');

console.log('localStorage cleared!');
console.log('Remaining localStorage keys:', Object.keys(localStorage));

// Optional: Clear all localStorage (uncomment if needed)
// localStorage.clear();
// console.log('All localStorage cleared!');
