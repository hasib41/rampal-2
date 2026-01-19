import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Zap, Navigation, ExternalLink, Layers, Satellite, Map } from 'lucide-react';

// Rampal Power Station coordinates (Maitree Super Thermal Power Project)
// Located in Rampal Upazila, Bagerhat District, Bangladesh
const RAMPAL_COORDINATES: [number, number] = [22.5189, 89.5847];
const DEFAULT_ZOOM = 14;

// Map tile providers
const MAP_TILES = {
    satellite: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    },
    satelliteLabels: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        attribution: '',
    },
    dark: {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    terrain: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
    },
};

// Custom marker icon
const createCustomIcon = () => {
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div class="relative">
                <div class="absolute -top-12 -left-6 w-12 h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-primary/50 animate-bounce border-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                </div>
                <div class="absolute -top-2 left-0 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[14px] border-l-transparent border-r-transparent border-t-primary"></div>
                <div class="absolute -top-14 -left-8 w-16 h-16 bg-primary/20 rounded-full animate-ping"></div>
                <div class="absolute -top-14 -left-8 w-16 h-16 border-2 border-primary/40 rounded-full animate-pulse"></div>
            </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
    });
};

// Map controller component for animations
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();

    useEffect(() => {
        map.setView(center, zoom, { animate: true, duration: 1 });
    }, [map, center, zoom]);

    return null;
}

// Fly to location button
function FlyToButton({ position }: { position: [number, number] }) {
    const map = useMap();

    const handleClick = () => {
        map.flyTo(position, 15, { duration: 2 });
    };

    return (
        <button
            onClick={handleClick}
            className="absolute bottom-4 right-4 z-[1000] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-lg border border-white/20 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-all hover:shadow-xl hover:scale-105"
            title="Fly to location"
        >
            <Navigation size={16} className="text-primary" />
            <span className="hidden sm:inline">Zoom In</span>
        </button>
    );
}

// Layer toggle button
function LayerToggle({
    mapStyle,
    onToggle
}: {
    mapStyle: 'satellite' | 'terrain';
    onToggle: () => void;
}) {
    return (
        <button
            onClick={onToggle}
            className="absolute top-4 right-4 z-[1000] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-2.5 rounded-xl shadow-lg border border-white/20 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-all hover:shadow-xl hover:scale-105"
            title={mapStyle === 'satellite' ? 'Switch to Terrain' : 'Switch to Satellite'}
        >
            {mapStyle === 'satellite' ? (
                <Map size={18} className="text-primary" />
            ) : (
                <Satellite size={18} className="text-primary" />
            )}
        </button>
    );
}

interface ProjectLocationMapProps {
    className?: string;
    height?: string;
    showControls?: boolean;
    initialStyle?: 'satellite' | 'terrain';
}

export function ProjectLocationMap({
    className = '',
    height = 'h-[350px] sm:h-[400px] lg:h-[450px]',
    showControls = true,
    initialStyle = 'satellite',
}: ProjectLocationMapProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [mapStyle, setMapStyle] = useState<'satellite' | 'terrain'>(initialStyle);
    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const toggleMapStyle = () => {
        setMapStyle(prev => prev === 'satellite' ? 'terrain' : 'satellite');
    };

    return (
        <div className={`relative group rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10 ${className}`}>
            {/* Loading state */}
            {!isLoaded && (
                <div className={`absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center ${height}`}>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <span className="text-gray-400 text-sm font-medium">Loading satellite imagery...</span>
                    </div>
                </div>
            )}

            {/* Map container */}
            <div className={`${height} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                <MapContainer
                    center={RAMPAL_COORDINATES}
                    zoom={DEFAULT_ZOOM}
                    scrollWheelZoom={true}
                    className="w-full h-full z-0"
                    ref={mapRef}
                    zoomControl={false}
                >
                    {/* Base Layer - Satellite or Terrain */}
                    {mapStyle === 'satellite' ? (
                        <>
                            <TileLayer
                                attribution={MAP_TILES.satellite.attribution}
                                url={MAP_TILES.satellite.url}
                            />
                            {/* Labels overlay for satellite */}
                            <TileLayer
                                url={MAP_TILES.satelliteLabels.url}
                                attribution=""
                            />
                        </>
                    ) : (
                        <TileLayer
                            attribution={MAP_TILES.terrain.attribution}
                            url={MAP_TILES.terrain.url}
                        />
                    )}

                    {/* Custom Marker */}
                    <Marker position={RAMPAL_COORDINATES} icon={createCustomIcon()}>
                        <Popup className="custom-popup" maxWidth={320}>
                            <div className="p-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg">
                                        <Zap className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-base">Maitree Power Station</h3>
                                        <p className="text-gray-500 text-xs">Bangladesh-India Friendship Power</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <MapPin size={14} className="text-primary shrink-0" />
                                        <span>Rampal, Bagerhat District</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Zap size={14} className="text-amber-500 shrink-0" />
                                        <span className="font-semibold">1320 MW Capacity</span>
                                    </div>
                                    <div className="text-xs text-gray-500 pl-6">
                                        2 × 660 MW Ultra-Supercritical Units
                                    </div>
                                </div>

                                <a
                                    href="/projects"
                                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-colors shadow-md"
                                >
                                    View Project Details <ExternalLink size={14} />
                                </a>
                            </div>
                        </Popup>
                    </Marker>

                    <MapController center={RAMPAL_COORDINATES} zoom={DEFAULT_ZOOM} />

                    {showControls && <FlyToButton position={RAMPAL_COORDINATES} />}
                </MapContainer>
            </div>

            {/* Layer toggle button */}
            {showControls && (
                <LayerToggle mapStyle={mapStyle} onToggle={toggleMapStyle} />
            )}

            {/* Top gradient overlay */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-[500]" />

            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-[500]" />

            {/* Location badge */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-black/70 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                    <span className="text-sm font-semibold text-white">Rampal Power Station</span>
                </div>
                <p className="text-xs text-gray-300">Bagerhat, Bangladesh • 1320 MW</p>
            </div>

            {/* Coordinates badge */}
            <div className="absolute top-4 left-4 z-[1000] bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg text-xs font-mono text-green-400 border border-white/10 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                22.5189°N, 89.5847°E
            </div>

            {/* Scale indicator */}
            <div className="absolute bottom-4 right-24 sm:right-32 z-[1000] bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white/80 border border-white/10">
                <Layers size={12} className="inline mr-1" />
                {mapStyle === 'satellite' ? 'Satellite' : 'Terrain'}
            </div>
        </div>
    );
}

// Add custom styles for the map
const customStyles = `
    .custom-marker {
        background: transparent;
        border: none;
    }

    .leaflet-popup-content-wrapper {
        border-radius: 16px;
        padding: 0;
        overflow: hidden;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .leaflet-popup-content {
        margin: 14px;
        min-width: 260px;
    }

    .leaflet-popup-tip {
        background: white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .leaflet-container {
        font-family: inherit;
        background: #1a1a2e;
    }

    .leaflet-control-zoom {
        border: none !important;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3) !important;
        overflow: hidden;
        border-radius: 12px !important;
    }

    .leaflet-control-zoom a {
        background: rgba(255, 255, 255, 0.95) !important;
        color: #374151 !important;
        border: none !important;
        width: 36px !important;
        height: 36px !important;
        line-height: 36px !important;
        font-size: 18px !important;
        backdrop-filter: blur(8px);
    }

    .leaflet-control-zoom a:hover {
        background: white !important;
        color: #059669 !important;
    }

    .leaflet-control-zoom-in {
        border-radius: 12px 12px 0 0 !important;
        border-bottom: 1px solid #e5e7eb !important;
    }

    .leaflet-control-zoom-out {
        border-radius: 0 0 12px 12px !important;
    }

    .leaflet-control-attribution {
        background: rgba(0, 0, 0, 0.5) !important;
        color: rgba(255, 255, 255, 0.6) !important;
        font-size: 9px !important;
        padding: 2px 6px !important;
        backdrop-filter: blur(4px);
    }

    .leaflet-control-attribution a {
        color: rgba(255, 255, 255, 0.8) !important;
    }

    @keyframes bounce {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    .animate-bounce {
        animation: bounce 2s ease-in-out infinite;
    }
`;

// Inject custom styles
if (typeof document !== 'undefined') {
    const existingStyle = document.getElementById('leaflet-custom-styles');
    if (!existingStyle) {
        const styleElement = document.createElement('style');
        styleElement.id = 'leaflet-custom-styles';
        styleElement.textContent = customStyles;
        document.head.appendChild(styleElement);
    }
}
