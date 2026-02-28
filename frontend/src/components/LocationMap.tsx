import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon issue in bundled builds
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface LocationMapProps {
  lat: number
  lng: number
  locationName: string
}

function FlyToLocation({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([lat, lng], 15, { duration: 1.2 })
  }, [lat, lng, map])
  return null
}

export function LocationMap({ lat, lng, locationName }: LocationMapProps) {
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          scrollWheelZoom={false}
          className="w-full h-full z-0"
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[lat, lng]}>
            <Popup>{locationName}</Popup>
          </Marker>
          <FlyToLocation lat={lat} lng={lng} />
        </MapContainer>
      </div>
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors py-2 px-4 rounded-xl bg-primary/5 hover:bg-primary/10 self-center"
      >
        <span className="material-symbols-outlined text-lg">directions</span>
        Abrir en Google Maps
      </a>
    </div>
  )
}

// Interactive map for picking a location
interface LocationPickerProps {
  lat: number | null
  lng: number | null
  onLocationChange: (lat: number, lng: number) => void
}

function ClickHandler({
  onLocationChange,
}: {
  onLocationChange: (lat: number, lng: number) => void
}) {
  const map = useMap()
  useEffect(() => {
    const handler = (e: L.LeafletMouseEvent) => {
      onLocationChange(e.latlng.lat, e.latlng.lng)
    }
    map.on('click', handler)
    return () => {
      map.off('click', handler)
    }
  }, [map, onLocationChange])
  return null
}

export function LocationPicker({
  lat,
  lng,
  onLocationChange,
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const defaultLat = lat ?? -0.1807
  const defaultLng = lng ?? -78.4678

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
      )
      const data = await res.json()
      if (data.length > 0) {
        const result = data[0]
        onLocationChange(parseFloat(result.lat), parseFloat(result.lon))
      }
    } catch {
      // silently fail
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && (e.preventDefault(), handleSearch())
            }
            placeholder="Buscar ubicación en el mapa..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-primary focus:ring-primary"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="h-10 px-3 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {searching ? (
            <span className="material-symbols-outlined text-sm animate-spin">
              progress_activity
            </span>
          ) : (
            'Buscar'
          )}
        </button>
      </div>
      <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-slate-200">
        <MapContainer
          center={[defaultLat, defaultLng]}
          zoom={13}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickHandler onLocationChange={onLocationChange} />
          {lat != null && lng != null && (
            <>
              <Marker position={[lat, lng]} />
              <FlyToLocation lat={lat} lng={lng} />
            </>
          )}
        </MapContainer>
      </div>
      <p className="text-xs text-slate-400">
        Haz clic en el mapa o busca una dirección para fijar la ubicación
      </p>
    </div>
  )
}
