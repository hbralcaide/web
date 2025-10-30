// Debug script to check stall counting logic in the frontend
// Add this to your browser console while on the PublicHome page

// Check what data is being fetched
console.log('=== DEBUGGING STALL COUNTING ===');

// Check if we can access the Supabase client
if (typeof supabase !== 'undefined') {
    console.log('Supabase client available');

    // Fetch all stalls
    supabase
        .from('stalls')
        .select('*')
        .then(({ data: stallsData, error: stallsError }) => {
            if (stallsError) {
                console.error('Error fetching stalls:', stallsError);
                return;
            }

            console.log('Total stalls in database:', stallsData.length);

            // Group by section code
            const stallsBySection = {};
            stallsData.forEach(stall => {
                const sectionCode = stall.stall_number.substring(0, 2);
                if (!stallsBySection[sectionCode]) {
                    stallsBySection[sectionCode] = [];
                }
                stallsBySection[sectionCode].push(stall);
            });

            console.log('Stalls by section code:', stallsBySection);

            // Check Fish section specifically
            const fishStalls = stallsData.filter(stall => stall.stall_number.startsWith('FV'));
            console.log('Fish section stalls (FV):', fishStalls.length);
            console.log('Fish section stall numbers:', fishStalls.map(s => s.stall_number));

            // Check available stalls
            const availableStalls = stallsData.filter(stall =>
                stall.status === 'vacant' || stall.status === 'available'
            );
            console.log('Available stalls:', availableStalls.length);

            const availableFishStalls = fishStalls.filter(stall =>
                stall.status === 'vacant' || stall.status === 'available'
            );
            console.log('Available fish stalls:', availableFishStalls.length);

        });

    // Fetch market sections
    supabase
        .from('market_sections')
        .select('*')
        .then(({ data: sectionsData, error: sectionsError }) => {
            if (sectionsError) {
                console.error('Error fetching sections:', sectionsError);
                return;
            }

            console.log('Market sections:', sectionsData);
        });

} else {
    console.log('Supabase client not available in global scope');
}

// Check the current page data
if (typeof window !== 'undefined' && window.location.pathname === '/') {
    console.log('On PublicHome page - checking React state...');

    // Try to access React state (this might not work depending on React version)
    setTimeout(() => {
        const reactRoot = document.querySelector('#root');
        if (reactRoot && reactRoot._reactInternalFiber) {
            console.log('React root found, but state access is complex');
        }
    }, 2000);
}
