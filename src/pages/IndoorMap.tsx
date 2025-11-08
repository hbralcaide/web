// src/pages/IndoorMap.tsx
import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import MappedinMap from "../components/MappedinMap";
import { supabase } from "../lib/supabase";
import type { Database } from "../types/supabase";
import "../styles/mappedin.css"; // Ensure Mappedin controls CSS is loaded

type Stall = Database["public"]["Tables"]["stalls"]["Row"];
type StallStatus = 'vacant' | 'occupied' | 'maintenance';

interface MarketSection {
  id: string;
  name: string;
  code: string;
  capacity: number;
}

interface StallWithSection extends Stall {
  market_section?: MarketSection;
}

interface IndoorMarketMapProps {
  // optional callback when map is ready
  onMapReady?: (mapInstance: any) => void;
}

const IndoorMarketMap: React.FC<IndoorMarketMapProps> = ({ onMapReady }) => {
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [stalls, setStalls] = useState<StallWithSection[]>([]);
  const [marketSections, setMarketSections] = useState<MarketSection[]>([]);
  const [loadingStalls, setLoadingStalls] = useState(true);
  const mapInstanceRef = useRef<any>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<'all' | StallStatus>('all');
  const [sectionFilter, setSectionFilter] = useState<'all' | string>('all');

  // Stall details modal
  const [selectedStall, setSelectedStall] = useState<StallWithSection | null>(null);
  const [vendorDetails, setVendorDetails] = useState<any>(null);
  const [loadingVendor, setLoadingVendor] = useState(false);

  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StallWithSection[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [hoveredStall, setHoveredStall] = useState<string | null>(null);

  // prefer map id from env; leave undefined if not present
  const mapId = import.meta.env.VITE_MAPPEDIN_MAP_ID ?? undefined;

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingStalls(true);
        
        // Fetch market sections
        const { data: sectionsData, error: sectionsError } = await supabase
          .from("market_sections")
          .select("*")
          .order("name");
        
        if (sectionsError) throw sectionsError;
        if (active) setMarketSections(sectionsData || []);
        
        // Fetch stalls with market section data
        const { data: stallsData, error: stallsError } = await supabase
          .from("stalls")
          .select("*");
        
        if (stallsError) throw stallsError;
        
        // Fetch all vendor profiles
        const { data: vendorsData, error: vendorsError } = await supabase
          .from("vendor_profiles")
          .select("stall_number, first_name, last_name, business_name");
        
        if (vendorsError) console.warn('Error fetching vendors:', vendorsError);
        
        // Create a map of stall_number to vendor for quick lookup
        const vendorMap = new Map(
          (vendorsData || []).map((v: any) => [v.stall_number, v])
        );
        
        // Manually join market sections and vendors with stalls
        const stallsWithSections = stallsData?.map((stall: any) => ({
          ...stall,
          market_section: sectionsData?.find((section: any) => section.id === stall.section_id),
          vendor: vendorMap.get(stall.stall_number)
        })) || [];
        
        console.log('📊 Sample stalls data (first 3):', stallsWithSections.slice(0, 3));
        console.log('📊 Occupied stalls with vendor_profile:', 
          stallsWithSections.filter((s: any) => s.status === 'occupied' && s.vendor_profile)
        );
        
        if (active) setStalls(stallsWithSections);
      } catch (err: any) {
        setMapError(err.message ?? String(err));
      } finally {
        if (active) setLoadingStalls(false);
      }
    })();
    return () => { active = false; };
  }, []);

  // Filter stalls based on selected filters - memoized to prevent flickering
  const filteredStalls = useMemo(() => {
    return stalls.filter((stall) => {
      const matchesStatus = statusFilter === 'all' || stall.status === statusFilter;
      const matchesSection = sectionFilter === 'all' || stall.section_id === sectionFilter;
      return matchesStatus && matchesSection;
    });
  }, [stalls, statusFilter, sectionFilter]);

  // Get unique sections from stalls for filter dropdown
  const availableSections = useMemo(() => {
    return Array.from(
      new Set(stalls.map(stall => stall.section_id))
    ).map(sectionId => {
      const section = marketSections.find(s => s.id === sectionId);
      return section ? { id: section.id, name: section.name, code: section.code } : null;
    }).filter(Boolean) as { id: string; name: string; code: string }[];
  }, [stalls, marketSections]);

  // Calculate stats - memoized to prevent recalculations
  const stats = useMemo(() => ({
    total: filteredStalls.length,
    vacant: filteredStalls.filter(s => s.status === 'vacant').length,
    occupied: filteredStalls.filter(s => s.status === 'occupied').length,
    maintenance: filteredStalls.filter(s => s.status === 'maintenance').length
  }), [filteredStalls]);

  // Camera control functions using the working Camera API
  const rotateLeft = useCallback(() => {
    console.log('⬅️ Rotate Left clicked');
    if (!mapInstanceRef.current?.Camera) {
      console.warn('No Camera available');
      return;
    }
    const currentBearing = mapInstanceRef.current.Camera.bearing || 0;
    mapInstanceRef.current.Camera.set({ bearing: currentBearing - 5 });
    console.log('Rotated left to bearing:', currentBearing - 5);
  }, []);

  const rotateRight = useCallback(() => {
    console.log('➡️ Rotate Right clicked');
    if (!mapInstanceRef.current?.Camera) {
      console.warn('No Camera available');
      return;
    }
    const currentBearing = mapInstanceRef.current.Camera.bearing || 0;
    mapInstanceRef.current.Camera.set({ bearing: currentBearing + 5});
    console.log('Rotated right to bearing:', currentBearing + 5);
  }, []);

  const tiltUp = useCallback(() => {
    console.log('⬆️ Tilt Up clicked');
    if (!mapInstanceRef.current?.Camera) {
      console.warn('No Camera available');
      return;
    }
    const currentPitch = mapInstanceRef.current.Camera.pitch || 0;
    const newPitch = Math.max(0, currentPitch - 10);
    console.log('Current pitch:', currentPitch, '→ New pitch:', newPitch);
    
    try {
      mapInstanceRef.current.Camera.set({ pitch: newPitch });
      console.log('✅ Pitch set');
    } catch (err) {
      console.error('❌ Failed to set pitch:', err);
    }
  }, []);

  const tiltDown = useCallback(() => {
    console.log('⬇️ Tilt Down clicked');
    if (!mapInstanceRef.current?.Camera) {
      console.warn('No Camera available');
      return;
    }
    const currentPitch = mapInstanceRef.current.Camera.pitch || 0;
    const newPitch = Math.min(60, currentPitch + 10);
    console.log('Current pitch:', currentPitch, '→ New pitch:', newPitch);
    
    try {
      mapInstanceRef.current.Camera.set({ pitch: newPitch });
      console.log('✅ Pitch set to', newPitch);
    } catch (err) {
      console.error('❌ Failed to set pitch:', err);
    }
  }, []);

  const zoomIn = useCallback(() => {
    console.log('🔍 Zoom In clicked');
    if (!mapInstanceRef.current?.Camera) return;
    const currentZoom = mapInstanceRef.current.Camera.zoomLevel || 18;
    console.log('Current zoom:', currentZoom, '→ New zoom:', Math.min(22, currentZoom + 1));
    mapInstanceRef.current.Camera.set({ zoomLevel: Math.min(22, currentZoom + 1) });
  }, []);

  const zoomOut = useCallback(() => {
    console.log('🔍 Zoom Out clicked');
    if (!mapInstanceRef.current?.Camera) return;
    const currentZoom = mapInstanceRef.current.Camera.zoomLevel || 18;
    console.log('Current zoom:', currentZoom, '→ New zoom:', Math.max(14, currentZoom - 1));
    mapInstanceRef.current.Camera.set({ zoomLevel: Math.max(14, currentZoom - 1) });
  }, []);

  const resetView = useCallback(() => {
    console.log('🔄 Reset View clicked');
    if (!mapInstanceRef.current?.Camera) {
      console.warn('No Camera available');
      return;
    }
    console.log('Resetting bearing to 0 and pitch to 0');
    
    try {
      mapInstanceRef.current.Camera.set({ bearing: 0, pitch: 0 });
      console.log('✅ Reset complete');
    } catch (err) {
      console.error('❌ Failed to reset:', err);
    }
  }, []);

  const recenterMap = useCallback(() => {
    console.log('🎯 Recenter Map clicked');
    if (!mapInstanceRef.current?.Camera) {
      console.warn('No Camera available');
      return;
    }
    
    try {
      // Reset bearing and pitch to 0 (top-down, north-facing)
      // Set zoom to show the entire market layout clearly (like Mappedin preview)
      mapInstanceRef.current.Camera.set({ 
        bearing:74, 
        pitch: 0,
        zoomLevel: 20 // Balanced zoom to see full market with stall details visible
      });
      console.log('✅ Map recentered to preview view');
    } catch (err) {
      console.error('❌ Failed to recenter:', err);
    }
  }, []);

  // Handle stall click
  const handleStallClick = useCallback(async (stall: StallWithSection) => {
    console.log('🏪 Stall clicked:', stall.stall_number);
    setSelectedStall(stall);
    
    // Fetch vendor details if stall is occupied
    // Look up by stall_number since vendor_profiles.stall_number contains the stall assignment
    if (stall.status === 'occupied') {
      setLoadingVendor(true);
      console.log('🔍 Fetching vendor for stall_number:', stall.stall_number);
      try {
        const { data: vendorData, error } = await supabase
          .from('vendor_profiles')
          .select('*')
          .eq('stall_number', stall.stall_number)
          .single();
        
        console.log('✅ Vendor data fetched:', vendorData);
        if (error) {
          console.error('❌ Supabase error:', error);
          throw error;
        }
        setVendorDetails(vendorData);
      } catch (err) {
        console.error('Error fetching vendor details:', err);
        setVendorDetails(null);
      } finally {
        setLoadingVendor(false);
      }
    } else {
      setVendorDetails(null);
    }
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setSelectedStall(null);
    setVendorDetails(null);
  }, []);

  // Search handler
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = stalls.filter((stall) => {
      const stallNumber = stall.stall_number.toLowerCase();
      const sectionName = stall.market_section?.name?.toLowerCase() || '';
      const sectionCode = stall.market_section?.code?.toLowerCase() || '';
      const status = stall.status.toLowerCase();
      
      // Add vendor name search
      const vendorFirstName = (stall as any).vendor?.first_name?.toLowerCase() || '';
      const vendorLastName = (stall as any).vendor?.last_name?.toLowerCase() || '';
      const vendorFullName = `${vendorFirstName} ${vendorLastName}`.trim();
      const businessName = (stall as any).vendor?.business_name?.toLowerCase() || '';
      
      return stallNumber.includes(lowerQuery) ||
        sectionName.includes(lowerQuery) ||
        sectionCode.includes(lowerQuery) ||
        status.includes(lowerQuery) ||
        vendorFirstName.includes(lowerQuery) ||
        vendorLastName.includes(lowerQuery) ||
        vendorFullName.includes(lowerQuery) ||
        businessName.includes(lowerQuery);
    });

    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  }, [stalls]);

  // Handle search result hover - zoom to stall
  const handleSearchResultHover = useCallback((stallNumber: string | null) => {
    setHoveredStall(stallNumber);
    
    if (stallNumber && mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      // Find the stall space in Mappedin
      const mapData = (map as any).__mapData;
      if (mapData && typeof mapData.getByType === 'function') {
        const spaces = mapData.getByType('space');
        const space = spaces.find((s: any) => s.name === stallNumber);
        
        if (space && map.Camera) {
          // Zoom to the stall
          map.Camera.focusOn({ nodes: [space], minZoom: 22 });
        }
      }
    }
  }, []);

  // Memoize the onMapReady callback to prevent map re-initialization
  const handleMapReady = useCallback((instance: any) => {
    console.log("Mappedin map ready:", instance);
    
    // Debug: Check all Camera properties
    if (instance.Camera) {
      console.log("📸 Camera object keys:", Object.keys(instance.Camera));
      console.log("📸 Camera values:", {
        bearing: instance.Camera.bearing,
        tilt: instance.Camera.tilt,
        pitch: instance.Camera.pitch,
        rotation: instance.Camera.rotation,
        zoomLevel: instance.Camera.zoomLevel,
      });
    }
    
    // Set camera to top-down view (no tilt, straight overhead)
    if (instance.Camera) {
      try {
        instance.Camera.set({ 
          bearing: 74,  // Rotate 90° clockwise to show map horizontally
          pitch: 0      // Top-down view (0° = straight overhead, use pitch not tilt)
        });
        console.log("✅ Camera set to top-down view");
        
        // Check values after setting
        setTimeout(() => {
          console.log("📸 Camera values after initial set:", {
            bearing: instance.Camera.bearing,
            pitch: instance.Camera.pitch,
          });
        }, 100);
      } catch (err) {
        console.warn("Could not set initial camera view:", err);
      }
    }
    
    // Mappedin SDK v6 automatically includes navigation controls
    // They should be visible by default. If not, it might be a CSS issue.
    // Let's ensure the controls container is visible
    setTimeout(() => {
      const controlsSelector = '.maplibregl-ctrl-top-right, .mapboxgl-ctrl-top-right, .maplibregl-control-container';
      const controls = document.querySelectorAll(controlsSelector);
      console.log(`Found ${controls.length} control containers:`, controls);
      
      controls.forEach((ctrl: any) => {
        ctrl.style.display = 'block';
        ctrl.style.visibility = 'visible';
        ctrl.style.opacity = '1';
        ctrl.style.zIndex = '1000';
        console.log("✅ Made control visible:", ctrl.className);
      });
      
      // Also check for navigation controls specifically
      const navControls = document.querySelectorAll('.maplibregl-ctrl-group, .mapboxgl-ctrl-group');
      console.log(`Found ${navControls.length} navigation control groups:`, navControls);
      navControls.forEach((ctrl: any) => {
        ctrl.style.display = 'block !important';
        ctrl.style.visibility = 'visible !important';
        console.log("✅ Made nav control visible:", ctrl);
      });
    }, 1000);
    
    // expose for console inspection
    try { (window as any).mappedinMap = instance; } catch {}
    mapInstanceRef.current = instance;
    setMapReady(true);
    if (onMapReady) onMapReady(instance);
  }, [onMapReady]);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Toril Public Market — Indoor Map</h1>
        <div style={styles.liveIndicator}>
          <div style={styles.pulseCircle}></div>
          <span style={styles.liveText}>Live View</span>
        </div>
      </header>

      {/* Search Bar and Legend */}
      <div style={styles.searchAndLegendBar}>
        {/* Search */}
        <div style={styles.searchContainer}>
          <div style={styles.searchInputWrapper}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search by stall number, section, status, or vendor name..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery && setShowSearchResults(true)}
              style={styles.searchInput}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setShowSearchResults(false);
                }}
                style={styles.searchClearButton}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Legend */}
        <div style={styles.legend}>
          <span style={styles.legendTitle}>Sections:</span>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendColor, backgroundColor: '#FF6B6B' }}></div>
            <span style={styles.legendLabel}>Eatery</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendColor, backgroundColor: '#4CAF50' }}></div>
            <span style={styles.legendLabel}>Fruits & Vegetables</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendColor, backgroundColor: '#FF9800' }}></div>
            <span style={styles.legendLabel}>Dried Fish</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendColor, backgroundColor: '#2196F3' }}></div>
            <span style={styles.legendLabel}>Grocery</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendColor, backgroundColor: '#FFC107' }}></div>
            <span style={styles.legendLabel}>Rice & Grains</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendColor, backgroundColor: '#9C27B0' }}></div>
            <span style={styles.legendLabel}>Variety</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendColor, backgroundColor: '#00BCD4' }}></div>
            <span style={styles.legendLabel}>Fish</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendColor, backgroundColor: '#F44336' }}></div>
            <span style={styles.legendLabel}>Meat</span>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div style={styles.filterBar}>
        <div style={styles.filterContainer}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | StallStatus)}
              style={styles.filterSelect}
            >
              <option value="all">All Statuses</option>
              <option value="vacant">Vacant</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Section:</label>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="all">All Sections</option>
              {availableSections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name} ({section.code})
                </option>
              ))}
            </select>
          </div>

          {(statusFilter !== 'all' || sectionFilter !== 'all') && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setSectionFilter('all');
              }}
              style={styles.clearButton}
            >
              Clear Filters
            </button>
          )}
        </div>

        <div style={styles.statsContainer}>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Total:</span>
            <span style={styles.statValue}>{stats.total}</span>
          </div>
          <div style={styles.statItem}>
            <div style={{ ...styles.statDot, backgroundColor: '#10b981' }}></div>
            <span style={styles.statLabel}>Vacant:</span>
            <span style={styles.statValue}>{stats.vacant}</span>
          </div>
          <div style={styles.statItem}>
            <div style={{ ...styles.statDot, backgroundColor: '#3b82f6' }}></div>
            <span style={styles.statLabel}>Occupied:</span>
            <span style={styles.statValue}>{stats.occupied}</span>
          </div>
          <div style={styles.statItem}>
            <div style={{ ...styles.statDot, backgroundColor: '#f59e0b' }}></div>
            <span style={styles.statLabel}>Maintenance:</span>
            <span style={styles.statValue}>{stats.maintenance}</span>
          </div>
        </div>
      </div>

      <main style={styles.main}>
        {mapError ? (
          <div style={styles.centerBox}>
            <p style={{ color: "crimson" }}>Map error: {mapError}</p>
            <p>Check the browser console and the mappedin token endpoint logs.</p>
          </div>
        ) : (
          <div style={styles.mainContent}>
            {/* Left Panel - Search Results or Stall Details */}
            {(showSearchResults && searchResults.length > 0) || selectedStall ? (
              <div style={styles.searchResultsPanel}>
                <div style={styles.searchResultsHeader}>
                  <h3 style={styles.searchResultsTitle}>
                    {selectedStall ? `Stall ${selectedStall.stall_number}` : `Search Results (${searchResults.length})`}
                  </h3>
                  <button
                    onClick={() => {
                      if (selectedStall) {
                        closeModal();
                      } else {
                        setShowSearchResults(false);
                      }
                    }}
                    style={styles.searchResultsCloseButton}
                  >
                    ×
                  </button>
                </div>
                
                {/* Stall Details View */}
                {selectedStall ? (
                  <div style={styles.stallDetailsContent}>
                    {/* Stall Information */}
                    <div style={styles.detailSection}>
                      <h4 style={styles.detailSectionTitle}>
                        <span style={styles.sectionIcon}>🏪</span>
                        Stall Information
                      </h4>
                      <div style={styles.detailGrid}>
                        <div style={styles.detailItem}>
                          <span style={styles.detailLabel}>Stall Number</span>
                          <span style={styles.detailValue}>{selectedStall.stall_number}</span>
                        </div>
                        <div style={styles.detailItem}>
                          <span style={styles.detailLabel}>Status</span>
                          <span style={{
                            ...styles.statusBadgeDetail,
                            backgroundColor: 
                              selectedStall.status === 'vacant' ? '#10b981' :
                              selectedStall.status === 'occupied' ? '#3b82f6' : '#f59e0b'
                          }}>
                            {selectedStall.status?.toUpperCase()}
                          </span>
                        </div>
                        <div style={styles.detailItem}>
                          <span style={styles.detailLabel}>Section</span>
                          <span style={styles.detailValue}>
                            {selectedStall.market_section?.name || 'N/A'}
                            {selectedStall.market_section?.code && ` (${selectedStall.market_section.code})`}
                          </span>
                        </div>
                        <div style={styles.detailItem}>
                          <span style={styles.detailLabel}>Location</span>
                          <span style={styles.detailValue}>{selectedStall.location_desc || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Separator */}
                    {selectedStall.status === 'occupied' && <div style={styles.detailSeparator} />}

                    {/* Vendor Information */}
                    {selectedStall.status === 'occupied' && (
                      <div style={styles.detailSection}>
                        <h4 style={styles.detailSectionTitle}>
                          <span style={styles.sectionIcon}>👤</span>
                          Vendor Information
                        </h4>
                        {loadingVendor ? (
                          <div style={styles.loadingContainer}>
                            <div style={styles.spinner}></div>
                            <p style={styles.loadingText}>Loading vendor details...</p>
                          </div>
                        ) : vendorDetails ? (
                          <div style={styles.detailGrid}>
                            <div style={styles.detailItem}>
                              <span style={styles.detailLabel}>Business Name</span>
                              <span style={styles.detailValueHighlight}>{vendorDetails.business_name || 'N/A'}</span>
                            </div>
                            <div style={styles.detailItem}>
                              <span style={styles.detailLabel}>Owner</span>
                              <span style={styles.detailValue}>
                                {vendorDetails.first_name} {vendorDetails.last_name}
                              </span>
                            </div>
                            <div style={styles.detailItem}>
                              <span style={styles.detailLabel}>Contact</span>
                              <span style={styles.detailValue}>{vendorDetails.phone_number || 'N/A'}</span>
                            </div>
                            <div style={styles.detailItem}>
                              <span style={styles.detailLabel}>Email</span>
                              <span style={styles.detailValue}>{vendorDetails.email || 'N/A'}</span>
                            </div>
                          </div>
                        ) : (
                          <div style={styles.noDataNotice}>
                            <p>ℹ️ No vendor details available</p>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedStall.status === 'vacant' && (
                      <div style={styles.vacantNoticePanel}>
                        <div style={styles.noticeIcon}>✅</div>
                        <div>
                          <p style={styles.noticeTitlePanel}>Stall Available</p>
                          <p style={styles.noticeTextPanel}>This stall is currently vacant and available for rent.</p>
                        </div>
                      </div>
                    )}

                    {selectedStall.status === 'maintenance' && (
                      <div style={styles.maintenanceNoticePanel}>
                        <div style={styles.noticeIcon}>⚠️</div>
                        <div>
                          <p style={styles.noticeTitlePanel}>Under Maintenance</p>
                          <p style={styles.noticeTextPanel}>This stall is currently under maintenance.</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Search Results List */
                  <div style={styles.searchResultsList}>
                    {searchResults.map((stall) => (
                      <div
                        key={stall.id}
                        style={{
                          ...styles.searchResultItem,
                          ...(hoveredStall === stall.stall_number ? styles.searchResultItemHovered : {})
                        }}
                        onMouseEnter={() => handleSearchResultHover(stall.stall_number)}
                        onMouseLeave={() => handleSearchResultHover(null)}
                        onClick={() => {
                          handleStallClick(stall);
                        }}
                      >
                        <div style={styles.searchResultMain}>
                          <span style={styles.searchResultStallNumber}>{stall.stall_number}</span>
                          <span style={{
                            ...styles.searchResultBadge,
                            backgroundColor: 
                              stall.status === 'vacant' ? '#10b981' :
                              stall.status === 'occupied' ? '#3b82f6' : '#f59e0b'
                          }}>
                            {stall.status}
                          </span>
                        </div>
                        <div style={styles.searchResultSection}>
                          {stall.market_section?.name || 'N/A'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* Map Container */}
            <div style={styles.mapWrapper}>
              <MappedinMap
                // pass the mapId (your Mappedin map identifier) — MappedinMap handles token fetching
                mapId={mapId}
                stalls={filteredStalls}
                onMapReady={handleMapReady}
                onStallClick={handleStallClick}
                hoveredStallNumber={hoveredStall}
                selectedStallNumber={selectedStall?.stall_number || null}
                className="mappedin-full"
              />
              {(!mapReady || loadingStalls) && (
                <div style={styles.loadingOverlay}>
                  <div>{loadingStalls ? "Loading stalls…" : "Loading map…"}</div>
                </div>
              )}

              {/* Custom Navigation Controls */}
              {mapReady && (
                <div style={styles.navControls}>
                {/* Recenter Map Button */}
                <button onClick={recenterMap} style={styles.recenterButton} title="Recenter Map">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <circle cx="10" cy="10" r="2"/>
                    <circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <path d="M10 1 L10 4 M10 16 L10 19 M1 10 L4 10 M16 10 L19 10"/>
                  </svg>
                </button>

                {/* Rotation Controls */}
                <div style={styles.rotateButtons}>
                  <button onClick={rotateLeft} style={styles.rotateButton} title="Rotate Left">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 14l-4-4h8z" transform="rotate(-90 10 10)"/>
                    </svg>
                  </button>
                  <button onClick={rotateRight} style={styles.rotateButton} title="Rotate Right">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 14l-4-4h8z" transform="rotate(90 10 10)"/>
                    </svg>
                  </button>
                </div>

                {/* Compass/Reset */}
                <button onClick={resetView} style={styles.compassButton} title="Reset to North">
                  <svg width="29" height="29" viewBox="0 0 29 29" fill="currentColor">
                    <path d="M14.5,8.5l-3.5,6.5h7L14.5,8.5z M14.5,3.5c-6.1,0-11,4.9-11,11s4.9,11,11,11s11-4.9,11-11S20.6,3.5,14.5,3.5z M14.5,23.5 c-5,0-9-4-9-9s4-9,9-9s9,4,9,9S19.5,23.5,14.5,23.5z"/>
                  </svg>
                </button>
                
                {/* Zoom Controls */}
                <div style={styles.zoomButtons}>
                  <button onClick={zoomIn} style={styles.zoomButton} title="Zoom In">+</button>
                  <button onClick={zoomOut} style={styles.zoomButton} title="Zoom Out">−</button>
                </div>

                {/* Pitch/Tilt Controls */}
                <div style={styles.pitchButtons}>
                  <button onClick={tiltUp} style={styles.pitchButton} title="Tilt Up">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 6l-4 4h8z"/>
                    </svg>
                  </button>
                  <button onClick={tiltDown} style={styles.pitchButton} title="Tilt Down">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 14l4-4H6z"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}
            </div>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <small>Powered by Mappedin • Toril Public Market</small>
      </footer>
    </div>
  );
};

const styles: { [k: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100%",
    background: "#fafafa",
  },
  header: {
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
    background: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
  },
  liveIndicator: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  pulseCircle: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "#10b981",
    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  },
  liveText: {
    fontSize: 12,
    fontWeight: 600,
    color: "#10b981",
  },
  filterBar: {
    padding: "12px 16px",
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  searchAndLegendBar: {
    padding: "16px",
    background: "#fafafa",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
  },
  searchContainer: {
    flex: 1,
    minWidth: 300,
    maxWidth: 600,
    position: "relative",
  },
  searchInputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    background: "#ffffff",
    border: "2px solid #e5e7eb",
    borderRadius: 10,
    overflow: "hidden",
    transition: "border-color 0.2s",
  },
  searchIcon: {
    padding: "0 12px",
    fontSize: 16,
    color: "#9ca3af",
  },
  searchInput: {
    flex: 1,
    padding: "10px 12px 10px 0",
    fontSize: 14,
    border: "none",
    outline: "none",
    background: "transparent",
  },
  searchClearButton: {
    padding: "0 12px",
    fontSize: 24,
    color: "#9ca3af",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    lineHeight: 1,
  },
  searchResultItem: {
    padding: "14px 12px",
    marginBottom: 8,
    background: "#f9fafb",
    border: "2px solid #e5e7eb",
    borderRadius: 10,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  searchResultItemHovered: {
    background: "#fef3c7",
    borderColor: "#000000",
    borderLeftWidth: "4px",
    transform: "translateX(2px)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  searchResultMain: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  searchResultStallNumber: {
    fontSize: 15,
    fontWeight: 700,
    color: "#111827",
  },
  searchResultBadge: {
    padding: "4px 10px",
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 700,
    color: "#ffffff",
    textTransform: "uppercase",
  },
  searchResultSection: {
    fontSize: 13,
    color: "#6b7280",
  },
  legend: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    background: "#ffffff",
    padding: "10px 16px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
  },
  legendTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#374151",
    marginRight: 4,
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    border: "1px solid rgba(0,0,0,0.1)",
  },
  legendLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: 500,
  },
  filterContainer: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
  },
  filterSelect: {
    padding: "6px 10px",
    fontSize: 13,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    background: "#ffffff",
    cursor: "pointer",
    outline: "none",
  },
  clearButton: {
    padding: "6px 12px",
    fontSize: 13,
    fontWeight: 600,
    color: "#4f46e5",
    background: "#eef2ff",
    border: "1px solid #c7d2fe",
    borderRadius: 6,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  statsContainer: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  statItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
  },
  statLabel: {
    color: "#6b7280",
    fontWeight: 500,
  },
  statValue: {
    color: "#111827",
    fontWeight: 700,
  },
  main: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    padding: 12,
    boxSizing: "border-box",
  },
  mainContent: {
    display: "flex",
    gap: 12,
    width: "100%",
    maxWidth: 1600,
    margin: "0 auto",
  },
  searchResultsPanel: {
    width: 300,
    background: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    maxHeight: "calc(100vh - 240px)",
    overflow: "hidden",
  },
  searchResultsHeader: {
    padding: "16px 20px",
    borderBottom: "2px solid #f3f4f6",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "linear-gradient(to bottom, #ffffff, #fafafa)",
  },
  searchResultsTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
    color: "#111827",
  },
  searchResultsCloseButton: {
    background: "#f3f4f6",
    border: "none",
    fontSize: 24,
    color: "#6b7280",
    cursor: "pointer",
    lineHeight: 1,
    padding: 0,
    width: 28,
    height: 28,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  },
  searchResultsList: {
    flex: 1,
    overflowY: "auto",
    padding: "8px",
  },
  stallDetailsContent: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
  },
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    margin: "0 0 16px 0",
    fontSize: 14,
    fontWeight: 700,
    color: "#111827",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  detailSeparator: {
    height: 1,
    background: "linear-gradient(to right, transparent, #e5e7eb, transparent)",
    margin: "20px 0",
  },
  detailGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: "10px 12px",
    background: "#f9fafb",
    borderRadius: 8,
    border: "1px solid #f3f4f6",
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 600,
    color: "#111827",
    wordBreak: "break-word",
  },
  detailValueHighlight: {
    fontSize: 14,
    fontWeight: 700,
    color: "#4f46e5",
    wordBreak: "break-word",
  },
  statusBadgeDetail: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: 12,
    fontSize: 10,
    fontWeight: 800,
    color: "#fff",
    width: "fit-content",
    letterSpacing: "0.05em",
    textShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },
  vacantNoticePanel: {
    padding: "16px",
    background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    borderRadius: 10,
    border: "2px solid #6ee7b7",
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 20,
  },
  maintenanceNoticePanel: {
    padding: "16px",
    background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
    borderRadius: 10,
    border: "2px solid #fcd34d",
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 20,
  },
  noticeTitlePanel: {
    margin: "0 0 4px 0",
    fontSize: 14,
    fontWeight: 700,
    color: "#065f46",
  },
  noticeTextPanel: {
    margin: 0,
    fontSize: 12,
    color: "#047857",
    lineHeight: 1.5,
  },
  mapWrapper: {
    position: "relative",
    flex: 1,
    height: "calc(100vh - 240px)",
    background: "#000",
    borderRadius: 8,
    overflow: "visible", // Allow Mappedin controls to show
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    cursor: "default", // Override Mappedin's pointer cursor
  },
  cameraControls: {
    position: "absolute",
    top: 16,
    right: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    zIndex: 40,
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    padding: 16,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  controlGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  controlLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  controlButtons: {
    display: "flex",
    gap: 6,
  },
  controlButton: {
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ffffff",
    border: "2px solid #e5e7eb",
    borderRadius: 8,
    cursor: "pointer",
    transition: "all 0.2s",
    outline: "none",
  },
  resetButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 600,
    color: "#ffffff",
    background: "#4f46e5",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "all 0.2s",
    outline: "none",
    marginTop: 8,
  },
  icon: {
    width: 18,
    height: 18,
  },
  shortcutsHint: {
    marginTop: 12,
    paddingTop: 12,
    borderTop: "1px solid #e5e7eb",
  },
  shortcutsTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#6b7280",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  shortcutItem: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 4,
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  kbd: {
    display: "inline-block",
    padding: "2px 6px",
    fontSize: 10,
    fontWeight: 600,
    fontFamily: "monospace",
    color: "#374151",
    background: "#f3f4f6",
    border: "1px solid #d1d5db",
    borderRadius: 4,
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    zIndex: 30,
    pointerEvents: "none",
    fontWeight: 600,
  },
  navControls: {
    position: "absolute",
    top: 10,
    right: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    zIndex: 1000,
  },
  recenterButton: {
    width: 29,
    height: 29,
    padding: 0,
    border: "2px solid rgba(0,0,0,.1)",
    borderRadius: 4,
    background: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 0 2px rgba(255,255,255,.5)",
    outline: "none",
    color: "#4f46e5",
  },
  rotateButtons: {
    display: "flex",
    flexDirection: "row",
    background: "#fff",
    borderRadius: 4,
    overflow: "hidden",
    boxShadow: "0 0 0 2px rgba(0,0,0,.1)",
  },
  rotateButton: {
    width: 29,
    height: 29,
    padding: 0,
    border: "none",
    borderRight: "1px solid rgba(0,0,0,.1)",
    background: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#333",
    outline: "none",
  } as React.CSSProperties,
  compassButton: {
    width: 29,
    height: 29,
    padding: 0,
    border: "2px solid rgba(0,0,0,.1)",
    borderRadius: 4,
    background: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 0 2px rgba(255,255,255,.5)",
    outline: "none",
    color: "#333",
  },
  zoomButtons: {
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    borderRadius: 4,
    overflow: "hidden",
    boxShadow: "0 0 0 2px rgba(0,0,0,.1)",
  },
  zoomButton: {
    width: 29,
    height: 29,
    padding: 0,
    border: "none",
    borderBottom: "1px solid rgba(0,0,0,.1)",
    background: "#fff",
    cursor: "pointer",
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    lineHeight: 1,
    outline: "none",
  } as React.CSSProperties,
  pitchButtons: {
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    borderRadius: 4,
    overflow: "hidden",
    boxShadow: "0 0 0 2px rgba(0,0,0,.1)",
  },
  pitchButton: {
    width: 29,
    height: 29,
    padding: 0,
    border: "none",
    borderBottom: "1px solid rgba(0,0,0,.1)",
    background: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#333",
    outline: "none",
  },
  centerBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    padding: 20,
  },
  footer: {
    padding: "8px 16px",
    borderTop: "1px solid #e5e7eb",
    textAlign: "center",
    background: "#fff",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    animation: "fadeIn 0.2s ease-out",
  },
  modalContent: {
    background: "#fff",
    borderRadius: 16,
    maxWidth: 650,
    width: "90%",
    maxHeight: "85vh",
    overflow: "hidden",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    animation: "slideUp 0.3s ease-out",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 28px",
    borderBottom: "2px solid #f3f4f6",
    background: "linear-gradient(to bottom, #ffffff, #fafafa)",
  },
  modalTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: "#111827",
    letterSpacing: "-0.01em",
  },
  closeButton: {
    background: "#f3f4f6",
    border: "none",
    fontSize: 28,
    color: "#6b7280",
    cursor: "pointer",
    lineHeight: 1,
    padding: 0,
    width: 36,
    height: 36,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  modalBody: {
    padding: "28px",
    maxHeight: "calc(85vh - 90px)",
    overflowY: "auto",
  },
  infoSection: {
    marginBottom: 0,
  },
  sectionTitle: {
    margin: "0 0 16px 0",
    fontSize: 15,
    fontWeight: 700,
    color: "#111827",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  sectionIcon: {
    fontSize: 18,
  },
  separator: {
    height: 2,
    background: "linear-gradient(to right, transparent, #e5e7eb, transparent)",
    margin: "28px 0",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: "12px 16px",
    background: "#f9fafb",
    borderRadius: 10,
    border: "1px solid #f3f4f6",
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: 600,
    color: "#111827",
    wordBreak: "break-word",
  },
  infoValueHighlight: {
    fontSize: 15,
    fontWeight: 700,
    color: "#4f46e5",
    wordBreak: "break-word",
  },
  statusBadge: {
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: 16,
    fontSize: 11,
    fontWeight: 800,
    color: "#fff",
    width: "fit-content",
    letterSpacing: "0.05em",
    textShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    padding: "32px 16px",
  },
  loadingText: {
    color: "#6b7280",
    fontSize: 14,
    fontWeight: 500,
  },
  spinner: {
    width: 32,
    height: 32,
    border: "3px solid #f3f4f6",
    borderTop: "3px solid #4f46e5",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  noDataNotice: {
    padding: "20px",
    background: "#f9fafb",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    textAlign: "center",
    color: "#6b7280",
    fontSize: 14,
  },
  vacantNotice: {
    padding: "20px",
    background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    borderRadius: 12,
    border: "2px solid #6ee7b7",
    display: "flex",
    alignItems: "flex-start",
    gap: 16,
    marginTop: 24,
  },
  maintenanceNotice: {
    padding: "20px",
    background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
    borderRadius: 12,
    border: "2px solid #fcd34d",
    display: "flex",
    alignItems: "flex-start",
    gap: 16,
    marginTop: 24,
  },
  noticeIcon: {
    fontSize: 28,
    lineHeight: 1,
  },
  noticeTitle: {
    margin: "0 0 4px 0",
    fontSize: 16,
    fontWeight: 700,
    color: "#065f46",
  },
  noticeText: {
    margin: 0,
    fontSize: 14,
    color: "#047857",
    lineHeight: 1.5,
  },
};

// Add CSS animation for pulse effect
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  button[style*="controlButton"]:hover,
  button[title="Rotate Left"]:hover,
  button[title="Rotate Right"]:hover,
  button[title="Tilt Up (More Top-Down)"]:hover,
  button[title="Tilt Down (More Perspective)"]:hover,
  button[title="Zoom In"]:hover,
  button[title="Zoom Out"]:hover {
    background: #f3f4f6 !important;
    border-color: #4f46e5 !important;
    transform: scale(1.05);
  }
  
  button[title="Reset Camera View"]:hover {
    background: #4338ca !important;
    transform: scale(1.05);
  }
  
  button[style*="closeButton"]:hover {
    background: #e5e7eb !important;
    color: #374151 !important;
    transform: rotate(90deg);
  }
`;
if (!document.head.querySelector('style[data-indoor-map-styles]')) {
  styleSheet.setAttribute('data-indoor-map-styles', 'true');
  document.head.appendChild(styleSheet);
}

export default IndoorMarketMap;
