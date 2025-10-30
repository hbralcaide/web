// Fix localStorage ID mismatch
// Run this in your browser console (F12 -> Console)

// Step 1: Clear the wrong ID
localStorage.removeItem('vendorApplicationId');

// Step 2: Set the correct ID
localStorage.setItem('vendorApplicationId', '79282f61-8cf2-4d50-bc84-dc759acefb3b');

// Step 3: Update the application data status
const applicationData = JSON.parse(localStorage.getItem('vendorApplicationData') || '{}');
applicationData.status = 'pending_approval';
applicationData.submittedAt = new Date().toISOString();
localStorage.setItem('vendorApplicationData', JSON.stringify(applicationData));

// Step 4: Verify the changes
console.log('Updated vendorApplicationId:', localStorage.getItem('vendorApplicationId'));
console.log('Updated applicationData:', JSON.parse(localStorage.getItem('vendorApplicationData')));

console.log('localStorage fix completed!');
