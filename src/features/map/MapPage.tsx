import React, { useState } from 'react';
import { 
  Map as MapIcon, 
  Navigation, 
  MapPin, 
  Fuel, 
  Wrench, 
  ShieldAlert, 
  Home, 
  Briefcase, 
  ShoppingBag, 
  Car, 
  AlertTriangle, 
  Sun, 
  CloudRain, 
  CloudFog, 
  Clock, 
  Wind,
  Layers,
  ChevronRight,
  Compass
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Tabs } from '../../components/common/Tabs';
import { ProgressBar } from '../../components/common/ProgressBar';
import { INITIAL_POIS, INITIAL_TRAFFIC_ZONES, INITIAL_WEATHER_CONDITIONS } from '../../data/mockData';
import { POI, POICategory, CityZone, WeatherType } from '../../types';

interface MapPageProps {
  onNavigate: (path: string) => void;
}

export const MapPage: React.FC<MapPageProps> = ({ onNavigate }) => {
  const { 
    currentWeather, 
    setWeather, 
    timeOfDay, 
    gameTime, 
    advanceTime, 
    driver,
    updateDriverProfile 
  } = useGame();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(INITIAL_POIS[0]);
  const [selectedZone, setSelectedZone] = useState<CityZone | 'ALL'>('ALL');

  const poiCategories = [
    { id: 'ALL', label: 'All POIs', count: INITIAL_POIS.length },
    { id: 'GARAGE', label: 'Garages', count: INITIAL_POIS.filter(p => p.category === 'GARAGE').length },
    { id: 'FUEL', label: 'Fuel Pumps', count: INITIAL_POIS.filter(p => p.category === 'FUEL').length },
    { id: 'SERVICE', label: 'Service Hubs', count: INITIAL_POIS.filter(p => p.category === 'SERVICE').length },
    { id: 'JOB_HUB', label: 'Job Terminals', count: INITIAL_POIS.filter(p => p.category === 'JOB_HUB').length },
    { id: 'DEALERSHIP', label: 'Dealerships', count: INITIAL_POIS.filter(p => p.category === 'DEALERSHIP').length },
    { id: 'POLICE', label: 'Police Stations', count: INITIAL_POIS.filter(p => p.category === 'POLICE').length },
  ];

  const filteredPOIs = INITIAL_POIS.filter(poi => {
    const matchCat = selectedCategory === 'ALL' || poi.category === selectedCategory;
    const matchZone = selectedZone === 'ALL' || poi.zone === selectedZone;
    return matchCat && matchZone;
  });

  const getPoiIcon = (cat: POICategory) => {
    switch (cat) {
      case 'HOME': return <Home className="w-4 h-4 text-emerald-400" />;
      case 'GARAGE': return <Wrench className="w-4 h-4 text-amber-400" />;
      case 'FUEL': return <Fuel className="w-4 h-4 text-sky-400" />;
      case 'SERVICE': return <Wrench className="w-4 h-4 text-purple-400" />;
      case 'POLICE': return <ShieldAlert className="w-4 h-4 text-danger" />;
      case 'JOB_HUB': return <Briefcase className="w-4 h-4 text-blue-400" />;
      case 'DEALERSHIP': return <ShoppingBag className="w-4 h-4 text-emerald-400" />;
      case 'RACE': return <Car className="w-4 h-4 text-red-400" />;
      default: return <MapPin className="w-4 h-4 text-slate-300" />;
    }
  };

  const handleSetGPS = (poi: POI) => {
    updateDriverProfile({ currentLocation: `${poi.zone} - ${poi.name}` });
    setSelectedPOI(poi);
  };

  return (
    <PageContainer>
      <PageHeader
        title="World Map & Environmental Traffic Hub"
        subtitle="Explore the 7 metropolitan sectors, view real-time traffic congestion, and adjust simulation weather"
      />

      {/* Environmental Quick Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Dynamic Weather Selector */}
        <Card variant="default" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-text">Simulation Weather</span>
            <Badge variant="blue" size="sm">{currentWeather.name}</Badge>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pt-1">
            {(['SUNNY', 'CLOUDY', 'RAIN', 'HEAVY_RAIN', 'FOG'] as WeatherType[]).map(w => (
              <button
                key={w}
                onClick={() => setWeather(w)}
                className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-mono capitalize whitespace-nowrap transition-all ${
                  currentWeather.type === w ? 'bg-primary-blue text-white border-blue-400 font-bold' : 'bg-surface-elevated border-app-border text-secondary-text'
                }`}
              >
                {w.toLowerCase().replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-app-border flex justify-between text-xs font-mono text-muted-text">
            <span>Traction: <strong className="text-primary-text">{currentWeather.roadGripPct}%</strong></span>
            <span>Visibility: <strong className="text-primary-text">{currentWeather.visibilityPct}%</strong></span>
          </div>
        </Card>

        {/* Time of Day Clock Adjuster */}
        <Card variant="default" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-text">World Clock</span>
            <Badge variant="neutral" size="sm">{timeOfDay}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-400" />
              <span className="text-2xl font-bold font-mono text-primary-text">{gameTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="secondary" size="sm" onClick={() => advanceTime(30)}>+30m</Button>
              <Button variant="secondary" size="sm" onClick={() => advanceTime(120)}>+2h</Button>
            </div>
          </div>
          <p className="text-[11px] text-muted-text mt-2 font-mono">
            Time progresses automatically during active driving sessions.
          </p>
        </Card>

        {/* Current Driver Position */}
        <Card variant="default" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-text">GPS Driver Waypoint</span>
            <Badge variant="success" size="sm" dot>LOCKED</Badge>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-950 text-sky-400 border border-blue-800">
              <Compass className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-primary-text truncate">{driver?.currentLocation || 'City Center'}</p>
              <p className="text-[10px] font-mono text-muted-text">Sector: Metropolitan Urban Grid</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Map Canvas + POI Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Map Visual Canvas */}
        <div className="lg:col-span-2 space-y-4">
          {/* POI Filter Tabs */}
          <Tabs
            tabs={poiCategories}
            activeTab={selectedCategory}
            onChange={setSelectedCategory}
          />

          {/* Interactive World Map SVG Viewport */}
          <Card variant="elevated" padding="none" className="relative h-[480px] bg-[#0A0E17] border border-app-border overflow-hidden">
            {/* Map Grid Pattern & Zones */}
            <svg className="w-full h-full">
              <defs>
                <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mapGrid)" opacity="0.6" />

              {/* Expressways and Arterial Road Vectors */}
              <path d="M 50 100 Q 300 150 550 80 T 800 240" fill="none" stroke="#2563EB" strokeWidth="8" strokeOpacity="0.7" />
              <path d="M 120 400 Q 400 350 700 420" fill="none" stroke="#334155" strokeWidth="6" />
              <path d="M 400 40 L 400 450" fill="none" stroke="#38BDF8" strokeWidth="4" strokeDasharray="6 4" strokeOpacity="0.8" />
              <path d="M 180 80 Q 250 400 650 350" fill="none" stroke="#1E293B" strokeWidth="14" />

              {/* Zone Area Labels */}
              <text x="8%" y="15%" fill="#475569" fontSize="11" fontFamily="monospace" fontWeight="bold">MOUNTAIN PASS SECTOR</text>
              <text x="70%" y="12%" fill="#475569" fontSize="11" fontFamily="monospace" fontWeight="bold">HIGHWAY 101 CORRIDOR</text>
              <text x="42%" y="50%" fill="#38BDF8" fontSize="13" fontFamily="monospace" fontWeight="bold" opacity="0.6">CITY CENTER METROPOLIS</text>
              <text x="12%" y="85%" fill="#475569" fontSize="11" fontFamily="monospace" fontWeight="bold">RESIDENTIAL SUBURBS</text>
              <text x="72%" y="78%" fill="#475569" fontSize="11" fontFamily="monospace" fontWeight="bold">INDUSTRIAL HARBOR</text>
            </svg>

            {/* Render POI Marker Pins */}
            {filteredPOIs.map(poi => {
              const isSelected = selectedPOI?.id === poi.id;
              return (
                <div
                  key={poi.id}
                  onClick={() => setSelectedPOI(poi)}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group transition-all"
                  style={{ left: `${poi.x}%`, top: `${poi.y}%` }}
                >
                  <div className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-primary-blue text-white border-white scale-125 shadow-glow-blue z-20'
                      : 'bg-surface-card text-sky-400 border-app-border hover:scale-110 hover:border-sky-400 z-10'
                  }`}>
                    {getPoiIcon(poi.category)}
                  </div>
                  {/* Pin label tooltip */}
                  <span className="absolute left-1/2 -translate-x-1/2 -bottom-5 px-1.5 py-0.5 rounded bg-black/90 border border-app-border text-[9px] font-mono text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {poi.name}
                  </span>
                </div>
              );
            })}
          </Card>
        </div>

        {/* Right 1 Col: Selected POI Details & Live Traffic Overview */}
        <div className="space-y-6">
          {/* Selected POI Card */}
          {selectedPOI ? (
            <Card variant="glow-blue">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="blue" size="sm">{selectedPOI.category}</Badge>
                <span className="text-[10px] font-mono text-muted-text">{selectedPOI.zone}</span>
              </div>

              <div className="flex items-start gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-blue-950 text-sky-400 border border-blue-800">
                  {getPoiIcon(selectedPOI.category)}
                </div>
                <div>
                  <h4 className="font-bold text-base text-primary-text">{selectedPOI.name}</h4>
                  <p className="text-xs text-muted-text font-mono mt-0.5">{selectedPOI.address}</p>
                </div>
              </div>

              <p className="text-xs text-secondary-text leading-relaxed mb-4">
                {selectedPOI.description}
              </p>

              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="sm"
                  glow
                  leftIcon={<Navigation className="w-4 h-4" />}
                  className="w-full"
                  onClick={() => handleSetGPS(selectedPOI)}
                >
                  Set as GPS Destination
                </Button>

                {selectedPOI.category === 'GARAGE' && (
                  <Button variant="secondary" size="sm" className="w-full" onClick={() => onNavigate('/garage')}>
                    Open Garage Bay
                  </Button>
                )}
                {selectedPOI.category === 'FUEL' && (
                  <Button variant="secondary" size="sm" className="w-full" onClick={() => onNavigate('/fuel')}>
                    Go to Fuel Station
                  </Button>
                )}
                {selectedPOI.category === 'SERVICE' && (
                  <Button variant="secondary" size="sm" className="w-full" onClick={() => onNavigate('/maintenance')}>
                    Enter Service Workshop
                  </Button>
                )}
                {selectedPOI.category === 'JOB_HUB' && (
                  <Button variant="secondary" size="sm" className="w-full" onClick={() => onNavigate('/jobs')}>
                    View Dispatch Contracts
                  </Button>
                )}
              </div>
            </Card>
          ) : null}

          {/* Traffic Overview Module */}
          <Card variant="default">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-text mb-3 flex items-center justify-between">
              <span>Metropolitan Traffic Feeds</span>
              <Badge variant="warning" size="sm">LIVE CONGESTION</Badge>
            </h4>

            <div className="space-y-2.5">
              {INITIAL_TRAFFIC_ZONES.map(tz => {
                const isHeavy = tz.trafficLevel === 'HEAVY';
                const isMod = tz.trafficLevel === 'MODERATE';
                return (
                  <div key={tz.id} className="p-2.5 rounded-xl bg-surface-elevated/70 border border-app-border text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-primary-text">{tz.roadName}</span>
                      <Badge variant={isHeavy ? 'danger' : isMod ? 'warning' : 'success'} size="sm">
                        {tz.trafficLevel}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-muted-text">
                      <span>Avg: {tz.avgSpeedKmh} km/h</span>
                      <span>{tz.zone}</span>
                    </div>
                    {tz.incident && (
                      <p className="text-[10px] text-amber-400 mt-1 font-mono">
                        ⚠ {tz.incident}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
