import React, { useState, useRef, useEffect } from 'react';
import {
  Server,
  Zap,
  BatteryCharging,
  Radio,
  DoorOpen,
  ShieldCheck,
  Cable,
  Wind,
  Plus,
  Trash2,
  Move,
  Upload,
  RotateCcw,
} from 'lucide-react';

export interface PlanElement {
  id: string;
  type: 'rack' | 'rectifier' | 'battery' | 'tower' | 'door' | 'ground' | 'tray' | 'ac';
  label: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number;
  height: number;
  rotation?: number;
  color: string;
}

interface SitePlanCanvasProps {
  initialPlanUrl?: string;
  notes?: string;
  onUpdateNotes?: (notes: string) => void;
  onUpdatePlanUrl?: (url: string) => void;
  readOnly?: boolean;
}

const DEFAULT_ELEMENTS: PlanElement[] = [
  { id: 'el-1', type: 'door', label: 'ACCESO PPAL', x: 8, y: 85, width: 70, height: 28, color: '#f59e0b' },
  { id: 'el-2', type: 'rack', label: 'RACK 01 NOKIA', x: 25, y: 35, width: 85, height: 110, color: '#0284c7' },
  { id: 'el-3', type: 'rack', label: 'RACK 02 TX/ODF', x: 42, y: 35, width: 85, height: 110, color: '#0369a1' },
  { id: 'el-4', type: 'rectifier', label: 'RECTIFICADOR DC', x: 70, y: 25, width: 100, height: 75, color: '#e11d48' },
  { id: 'el-5', type: 'battery', label: 'BANCO BATERIAS', x: 70, y: 55, width: 100, height: 65, color: '#84cc16' },
  { id: 'el-6', type: 'ground', label: 'BARRA TIERRA MGB', x: 12, y: 15, width: 80, height: 24, color: '#10b981' },
  { id: 'el-7', type: 'tray', label: 'ESCALERILLA AEREA 400mm', x: 20, y: 20, width: 260, height: 18, color: '#64748b' },
  { id: 'el-8', type: 'ac', label: 'A/C SPLIT 18k BTU', x: 88, y: 15, width: 60, height: 35, color: '#06b6d4' },
];

export const SitePlanCanvas: React.FC<SitePlanCanvasProps> = ({
  initialPlanUrl,
  notes = '',
  onUpdateNotes,
  onUpdatePlanUrl,
  readOnly = false,
}) => {
  const [elements, setElements] = useState<PlanElement[]>(DEFAULT_ELEMENTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploadedPlan, setUploadedPlan] = useState<string>(initialPlanUrl || '');
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialPlanUrl) {
      setUploadedPlan(initialPlanUrl);
    }
  }, [initialPlanUrl]);

  const handleDragStart = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    if (readOnly) return;
    e.stopPropagation();
    setDraggingId(id);
    setSelectedId(id);
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!draggingId || !containerRef.current || readOnly) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(2, Math.min(92, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(2, Math.min(90, ((clientY - rect.top) / rect.height) * 100));

    setElements((prev) =>
      prev.map((el) => (el.id === draggingId ? { ...el, x: Math.round(x), y: Math.round(y) } : el))
    );
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  const addElement = (type: PlanElement['type']) => {
    if (readOnly) return;
    const typesConfig: Record<PlanElement['type'], { label: string; width: number; height: number; color: string }> = {
      rack: { label: 'RACK ADICIONAL', width: 85, height: 110, color: '#0284c7' },
      rectifier: { label: 'RECTIFICADOR B', width: 95, height: 70, color: '#e11d48' },
      battery: { label: 'BANCO BATERIAS 2', width: 95, height: 60, color: '#84cc16' },
      tower: { label: 'TORRE / MONOPOLO', width: 80, height: 80, color: '#8b5cf6' },
      door: { label: 'PUERTA ACCESO', width: 65, height: 26, color: '#f59e0b' },
      ground: { label: 'BARRA TIERRA SEC.', width: 75, height: 24, color: '#10b981' },
      tray: { label: 'TRAY TRAYECTO', width: 180, height: 16, color: '#64748b' },
      ac: { label: 'A/C ADICIONAL', width: 55, height: 32, color: '#06b6d4' },
    };

    const cfg = typesConfig[type];
    const newEl: PlanElement = {
      id: `el-${Date.now()}`,
      type,
      label: cfg.label,
      x: 30 + Math.random() * 20,
      y: 30 + Math.random() * 20,
      width: cfg.width,
      height: cfg.height,
      color: cfg.color,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedId(newEl.id);
  };

  const removeElement = (id: string) => {
    if (readOnly) return;
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setUploadedPlan(result);
        if (onUpdatePlanUrl) onUpdatePlanUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetElements = () => {
    if (readOnly) return;
    setElements(DEFAULT_ELEMENTS);
    setUploadedPlan('');
    if (onUpdatePlanUrl) onUpdatePlanUrl('');
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Element tool ribbon if editable */}
      {!readOnly && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Agregar al Plano:
            </span>
            <button
              onClick={() => addElement('rack')}
              className="px-2 py-1 bg-sky-950 text-sky-200 border border-sky-800 rounded hover:bg-sky-900 transition flex items-center gap-1"
            >
              <Server className="w-3 h-3 text-sky-400" /> +Rack
            </button>
            <button
              onClick={() => addElement('rectifier')}
              className="px-2 py-1 bg-rose-950 text-rose-200 border border-rose-800 rounded hover:bg-rose-900 transition flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-rose-400" /> +Rectificador
            </button>
            <button
              onClick={() => addElement('battery')}
              className="px-2 py-1 bg-lime-950 text-lime-200 border border-lime-800 rounded hover:bg-lime-900 transition flex items-center gap-1"
            >
              <BatteryCharging className="w-3 h-3 text-lime-400" /> +Baterías
            </button>
            <button
              onClick={() => addElement('ground')}
              className="px-2 py-1 bg-emerald-950 text-emerald-200 border border-emerald-800 rounded hover:bg-emerald-900 transition flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> +Tierra MGB
            </button>
            <button
              onClick={() => addElement('tray')}
              className="px-2 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded hover:bg-slate-700 transition flex items-center gap-1"
            >
              <Cable className="w-3 h-3 text-slate-400" /> +Escalerilla
            </button>
            <button
              onClick={() => addElement('door')}
              className="px-2 py-1 bg-amber-950 text-amber-200 border border-amber-800 rounded hover:bg-amber-900 transition flex items-center gap-1"
            >
              <DoorOpen className="w-3 h-3 text-amber-400" /> +Puerta
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded hover:bg-slate-700 transition flex items-center gap-1"
              title="Cargar imagen técnica de plano AutoCAD o diagrama"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" /> Subir Plano / Croquis
            </button>
            <button
              onClick={resetElements}
              className="px-2 py-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition"
              title="Restablecer plano por defecto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Blueprint Canvas Viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        onTouchCancel={handleMouseUp}
        className="relative w-full h-[420px] md:h-[480px] bg-slate-950 border-2 border-slate-700 rounded-lg overflow-hidden select-none touch-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(14, 165, 233, 0.15) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px, 48px 48px, 48px 48px',
        }}
      >
        {/* Background uploaded plan if present */}
        {uploadedPlan && (
          <img
            src={uploadedPlan}
            alt="Plano del Sitio"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-40"
          />
        )}

        {/* Blueprint Room Perimeter Dimensions */}
        <div className="absolute top-2 left-3 text-[11px] font-mono text-cyan-500/80 pointer-events-none flex items-center gap-2">
          <span>DIMENSIONES SALA TX: 6.20m x 4.50m</span>
          <span>·</span>
          <span>ESCALA: 1:50</span>
          <span>·</span>
          <span>NORMA: TIA-942 / NOKIA SPEC</span>
        </div>

        {/* Compass Rose */}
        <div className="absolute top-3 right-4 flex flex-col items-center pointer-events-none">
          <div className="w-7 h-7 rounded-full border border-cyan-400/40 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-400">
            N
          </div>
          <span className="text-[9px] text-slate-400 font-mono">NORTE</span>
        </div>

        {/* Interactive Telecom Elements */}
        {elements.map((el) => {
          const isSelected = selectedId === el.id;
          return (
            <div
              key={el.id}
              onMouseDown={(e) => handleDragStart(el.id, e)}
              onTouchStart={(e) => handleDragStart(el.id, e)}
              style={{
                left: `${el.x}%`,
                top: `${el.y}%`,
                width: `${el.width}px`,
                height: `${el.height}px`,
                borderColor: el.color,
                backgroundColor: `${el.color}22`,
              }}
              className={`absolute cursor-move border-2 rounded p-1 flex flex-col justify-between transition-shadow shadow-md touch-none ${
                isSelected ? 'ring-2 ring-white shadow-cyan-500/30' : ''
              }`}
            >
              <div className="flex items-center justify-between pointer-events-none">
                <span
                  style={{ color: el.color }}
                  className="text-[9px] font-bold tracking-tight uppercase truncate"
                >
                  {el.label}
                </span>
                {!readOnly && isSelected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeElement(el.id);
                    }}
                    className="pointer-events-auto p-0.5 text-rose-400 hover:text-rose-200 hover:bg-rose-950/60 rounded"
                    title="Eliminar elemento"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Icon indicator */}
              <div className="flex items-center justify-center my-auto pointer-events-none opacity-80">
                {el.type === 'rack' && <Server className="w-4 h-4 text-sky-400" />}
                {el.type === 'rectifier' && <Zap className="w-4 h-4 text-rose-400" />}
                {el.type === 'battery' && <BatteryCharging className="w-4 h-4 text-lime-400" />}
                {el.type === 'tower' && <Radio className="w-4 h-4 text-purple-400" />}
                {el.type === 'door' && <DoorOpen className="w-4 h-4 text-amber-400" />}
                {el.type === 'ground' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                {el.type === 'tray' && <Cable className="w-3.5 h-3.5 text-slate-400" />}
                {el.type === 'ac' && <Wind className="w-3.5 h-3.5 text-cyan-400" />}
              </div>

              <div className="text-[8px] font-mono text-slate-400 text-right pointer-events-none">
                {el.width}x{el.height}
              </div>
            </div>
          );
        })}

        {/* Canvas Footer Legend */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-slate-400 font-mono pointer-events-none bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-sky-500 rounded-sm inline-block"></span> Racks
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-sm inline-block"></span> Rectificador
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-lime-500 rounded-sm inline-block"></span> Baterías
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm inline-block"></span> MGB
              Tierra
            </span>
          </div>
          <span>{!readOnly ? 'Arrastra los elementos para acomodarlos en la sala' : ''}</span>
        </div>
      </div>

      {/* Plano notes input */}
      {onUpdateNotes && !readOnly && (
        <div className="mt-1">
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Notas Técnicas del Plano y Distribución:
          </label>
          <textarea
            value={notes}
            onChange={(e) => onUpdateNotes(e.target.value)}
            rows={2}
            placeholder="Especificaciones de escalerillas, distancia a rectificador, vanos de paso y recomendaciones de seguridad..."
            className="w-full text-xs p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
      )}
    </div>
  );
};
