import { useRef, type ChangeEvent } from 'react'
import dogImg from '@/assets/dog.png'
import monoImg from '@/assets/mono.png'
import rabbitImg from '@/assets/rabbit.png'

export interface MascotOption {
  id: string
  label: string
  image: string // imported image path
}

export const MASCOT_OPTIONS: MascotOption[] = [
  { id: 'dog', label: 'Perro', image: dogImg },
  { id: 'monkey', label: 'Mono', image: monoImg },
  { id: 'rabbit', label: 'Conejo', image: rabbitImg },
]

interface MascotPickerProps {
  selected: string | null
  customImage: string | null
  onSelect: (id: string | null) => void
  onCustomImage: (dataUrl: string | null) => void
}

export function MascotPicker({
  selected,
  customImage,
  onSelect,
  onCustomImage,
}: MascotPickerProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      onCustomImage(reader.result as string)
      onSelect('custom')
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-bold text-slate-700">Mascota Animada</span>
      <p className="text-xs text-slate-400">
        Elige una figurita animada que aparecerá en tu invitación
      </p>
      <div className="grid grid-cols-4 gap-3">
        {MASCOT_OPTIONS.map((m) => {
          const isSelected = selected === m.id
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect(isSelected ? null : m.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5 scale-105'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <img src={m.image} alt={m.label} className="w-8 h-8 object-contain" />
              <span className="text-[10px] font-semibold text-slate-600">
                {m.label}
              </span>
            </button>
          )
        })}

        {/* Custom upload */}
        <button
          type="button"
          onClick={() => {
            if (customImage) {
              onCustomImage(null)
              onSelect(null)
              if (fileRef.current) fileRef.current.value = ''
            } else {
              fileRef.current?.click()
            }
          }}
          className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
            selected === 'custom'
              ? 'border-primary bg-primary/5 scale-105'
              : 'border-dashed border-slate-300 hover:border-primary hover:bg-slate-50'
          }`}
        >
          {customImage ? (
            <img
              src={customImage}
              alt="Custom"
              className="w-7 h-7 object-contain"
            />
          ) : (
            <span className="material-symbols-outlined text-2xl text-slate-400">
              upload
            </span>
          )}
          <span className="text-[10px] font-semibold text-slate-600">
            {customImage ? 'Quitar' : 'Subir PNG'}
          </span>
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/png"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
