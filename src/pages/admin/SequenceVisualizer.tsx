/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, ChevronRight, ChevronLeft, RotateCcw, 
  User, Monitor, Settings, Database, Info, HelpCircle, GitCommit,
  Code, Copy, Check, ExternalLink
} from 'lucide-react';
// ✅ Đã sửa chuẩn:
import type { SequenceDiagramData, Lifeline, SequenceStepMessage } from '../../types';
import { SEQUENCE_DIAGRAMS } from '../../data';

interface SequenceVisualizerProps {
  activeDiagramId?: string;
  onClose?: () => void;
  titleSuffix?: string;
  autoPlayOnMount?: boolean;
}

export default function SequenceVisualizer({ 
  activeDiagramId: initialDiagramId = 'SD9.1', 
  onClose,
  titleSuffix = '',
  autoPlayOnMount = false
}: SequenceVisualizerProps) {
  const [selectedDiagramId, setSelectedDiagramId] = useState<string>(initialDiagramId);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlayOnMount);
  const [activeTab, setActiveTab] = useState<'visual' | 'plantuml'>('visual');
  const [copied, setCopied] = useState<boolean>(false);

  const diagram = SEQUENCE_DIAGRAMS.find(d => d.id === selectedDiagramId) || SEQUENCE_DIAGRAMS[0];

  useEffect(() => {
    if (initialDiagramId) {
      setSelectedDiagramId(initialDiagramId);
      setCurrentStepIndex(0);
    }
  }, [initialDiagramId]);

  // Autoplay handler
  useEffect(() => {
    let timer: any;
    if (isPlaying && activeTab === 'visual') {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= diagram.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, diagram.steps.length, activeTab]);

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < diagram.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleTogglePlay = () => {
    if (currentStepIndex >= diagram.steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  // Helper to copy text with positive feedback
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dynamic PlantUML generator conforming strictly to UEH Analysis & Design conventions
  const generatePlantUmlSource = (diag: typeof diagram): string => {
    let output = `@startuml\n`;
    output += `' -----------------------------------------------------\n`;
    output += `' TRƯỜNG ĐẠI HỌC KINH TẾ TP. HỒ CHÍ MINH (UEH)\n`;
    output += `' BẢN VẼ BIỂU ĐỒ TUẦN TỰ (SEQUENCE DIAGRAM)\n`;
    output += `' Đề tài: Hệ thống Quản lý Khách sạn\n`;
    output += `' Use Case: ${diag.title}\n`;
    output += `' -----------------------------------------------------\n\n`;
    
    output += `skinparam style strictuml\n`;
    output += `skinparam BoxPadding 10\n`;
    output += `skinparam ParticipantPadding 12\n`;
    output += `skinparam maxMessageSize 150\n\n`;

    // 1. Group Actors (Placed outside boxes)
    const actors = diag.lifelines.filter(l => l.type === 'actor');
    actors.forEach(actor => {
      output += `actor "${actor.name}" as ${actor.id}\n`;
    });
    if (actors.length > 0) output += `\n`;

    // 2. Group Boundaries
    const boundaries = diag.lifelines.filter(l => l.type === 'boundary');
    if (boundaries.length > 0) {
      output += `box "Boundary / Giao diện" #E2F0D9\n`;
      boundaries.forEach(b => {
        output += `  boundary "${b.name}" as ${b.id}\n`;
      });
      output += `end box\n\n`;
    }

    // 3. Group Controls
    const controls = diag.lifelines.filter(l => l.type === 'control');
    if (controls.length > 0) {
      output += `box "Control / Điều khiển" #FFF2CC\n`;
      controls.forEach(c => {
        output += `  control "${c.name}" as ${c.id}\n`;
      });
      output += `end box\n\n`;
    }

    // 4. Group Entities
    const entities = diag.lifelines.filter(l => l.type === 'entity');
    if (entities.length > 0) {
      output += `box "Entity / Thực thể" #FCE4D6\n`;
      entities.forEach(e => {
        output += `  entity "${e.name}" as ${e.id}\n`;
      });
      output += `end box\n\n`;
    }

    // 5. Render Steps & Activations
    const activeLifelines: Record<string, boolean> = {};

    diag.steps.forEach(step => {
      const from = step.from;
      const to = step.to;
      const isSelf = from === to;
      const arrow = step.isReturn ? `-->` : `->`;

      // Prepend Vietnamese system analysis notes as comments
      if (step.note) {
        output += `' Bước ${step.id}: ${step.note.replace(/\ng/, ' ')}\n`;
      }

      if (isSelf) {
        output += `${from} -> ${from} : ${step.label}\n`;
      } else {
        output += `${from} ${arrow} ${to} : ${step.label}\n`;

        // Smart activation/deactivation logic mimicking ideal course standards
        if (!step.isReturn && to !== 'nhan_vien') {
          output += `activate ${to}\n`;
          activeLifelines[to] = true;
        } else if (step.isReturn && from !== 'nhan_vien' && activeLifelines[from]) {
          output += `deactivate ${from}\n`;
          activeLifelines[from] = false;
        }
      }
      output += `\n`;
    });

    // Cleanup lingering activations
    Object.keys(activeLifelines).forEach(id => {
      if (activeLifelines[id]) {
        output += `deactivate ${id}\n`;
      }
    });

    output += `@enduml`;
    return output;
  };

  // Helper to get lifeline icon and color class
  const getLifelineStyles = (type: string) => {
    switch (type) {
      case 'actor':
        return {
          icon: <User className="w-5 h-5 text-indigo-600" />,
          bgColor: 'bg-indigo-50 border-indigo-200',
          textColor: 'text-indigo-800',
          label: 'Actor (Tác nhân)',
          borderColor: 'border-indigo-400'
        };
      case 'boundary':
        return {
          icon: <Monitor className="w-5 h-5 text-emerald-600" />,
          bgColor: 'bg-emerald-50 border-emerald-200',
          textColor: 'text-emerald-800',
          label: 'Boundary (Giao diện)',
          borderColor: 'border-emerald-400'
        };
      case 'control':
        return {
          icon: <Settings className="w-5 h-5 text-amber-600 animate-spin-slow" />,
          bgColor: 'bg-amber-50 border-amber-200',
          textColor: 'text-amber-800',
          label: 'Control (Điều khiển)',
          borderColor: 'border-amber-400'
        };
      case 'entity':
        return {
          icon: <Database className="w-5 h-5 text-rose-600" />,
          bgColor: 'bg-rose-50 border-rose-200',
          textColor: 'text-rose-800',
          label: 'Entity (Thực thể dữ liệu)',
          borderColor: 'border-rose-400'
        };
      default:
        return {
          icon: <HelpCircle className="w-5 h-5 text-slate-600" />,
          bgColor: 'bg-slate-50 border-slate-200',
          textColor: 'text-slate-800',
          label: 'Unknown',
          borderColor: 'border-slate-400'
        };
    }
  };

  // Calculate left position percent for each lifeline
  const lifelinesCount = diagram.lifelines.length;
  const getLifelineXPercent = (id: string) => {
    const idx = diagram.lifelines.findIndex(l => l.id === id);
    if (idx === -1) return 0;
    // Distribute logically
    return (idx / (lifelinesCount - 1)) * 100;
  };

  return (
    <div id="sequence_visualizer_container" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full min-h-[580px]">
      {/* Header Panel */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GitCommit className="w-5 h-5 text-indigo-600" />
          <h3 className="font-sans font-semibold text-slate-800 text-sm md:text-base">
            Sequence Visualizer: {diagram.title} {titleSuffix}
          </h3>
        </div>
        
        {/* Selector Dropdown & Tab Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 font-medium whitespace-nowrap">Chọn Use Case:</label>
            <select 
              value={selectedDiagramId}
              onChange={(e) => {
                setSelectedDiagramId(e.target.value);
                setCurrentStepIndex(0);
                setIsPlaying(false);
              }}
              className="text-xs bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-700 outline-none focus:border-indigo-500"
            >
              <optgroup label="Feature 9: Quản lý phòng">
                <option value="SD9.1">SD9.1 - Tìm phòng</option>
                <option value="SD9.2">SD9.2 - Thêm phòng</option>
                <option value="SD9.3">SD9.3 - Xem chi tiết</option>
                <option value="SD9.4">SD9.4 - Sửa phòng</option>
                <option value="SD9.5">SD9.5 - Xóa phòng</option>
              </optgroup>
              <optgroup label="Feature 10: Quản lý hóa đơn">
                <option value="SD10.1">SD10.1 - Tạo hóa đơn</option>
                <option value="SD10.2">SD10.2 - Xem chi tiết hóa đơn</option>
                <option value="SD10.3">SD10.3 - Sửa hóa đơn</option>
                <option value="SD10.4">SD10.4 - Hủy hóa đơn</option>
                <option value="SD10.5">SD10.5 - Xuất hóa đơn PDF/In</option>
              </optgroup>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 border border-slate-200/60 select-none">
            <button
              onClick={() => setActiveTab('visual')}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded transition-all cursor-pointer ${
                activeTab === 'visual' 
                  ? 'bg-white text-indigo-700 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Mô phỏng động
            </button>
            <button
              onClick={() => setActiveTab('plantuml')}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'plantuml' 
                  ? 'bg-white text-indigo-700 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              plantuml Source (UEH)
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-5 py-3.5 bg-indigo-50/30 border-b border-slate-100 text-xs text-slate-600 flex gap-2">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-slate-700">Mô tả quy trình nghiệp vụ:</p>
          <p className="text-slate-600 mt-0.5 leading-relaxed">{diagram.description}</p>
        </div>
      </div>

      {/* Main Content Area based on selected Tab */}
      {activeTab === 'visual' ? (
        <>
          {/* Visual Simulation Canvas */}
          <div className="flex-1 relative p-6 bg-slate-50 overflow-x-auto min-h-[380px] flex flex-col justify-between">
            <div className="relative min-w-[750px] w-full h-[320px] mx-auto">
              
              {/* Vertical Lifelines Dashed Lines */}
              <div className="absolute inset-x-0 top-16 bottom-0 pointer-events-none">
                {diagram.lifelines.map((lifeline) => {
                  const xPercent = getLifelineXPercent(lifeline.id);
                  
                  // Find if this lifeline is currently involved in the active message
                  const activeStep = diagram.steps[currentStepIndex];
                  const isParticipant = activeStep && (activeStep.from === lifeline.id || activeStep.to === lifeline.id);
                  
                  return (
                    <div 
                      key={lifeline.id}
                      className="absolute top-0 bottom-0 flex flex-col items-center"
                      style={{ left: `${xPercent}%`, transform: 'translateX(-50%)', width: '2px' }}
                    >
                      <div className={`w-0.5 h-full border-l-2 border-dashed transition-colors duration-300 ${
                        isParticipant ? 'border-indigo-400' : 'border-slate-300'
                      }`} />
                      
                      {/* Activation block depth based on active message steps */}
                      {diagram.steps.map((step, stepIdx) => {
                        if (stepIdx > currentStepIndex) return null;
                        const stepY = 24 + stepIdx * 25;
                        
                        const isSelfActive = step.to === lifeline.id;
                        const isFrom = step.from === lifeline.id;
                        if (!isSelfActive && !isFrom) return null;
                        if (lifeline.type === 'actor') return null;
                        
                        return (
                          <div 
                            key={stepIdx} 
                            className={`absolute w-3 rounded-sm border ${
                              stepIdx === currentStepIndex 
                                ? 'bg-amber-300 border-amber-500 shadow-sm scale-110 z-10' 
                                : 'bg-slate-200 border-slate-300'
                            }`} 
                            style={{ 
                              top: `${stepY}px`, 
                              height: '24px', 
                              transform: 'translateX(-50%)',
                              left: '50%'
                            }}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Lifeline Headers at the top */}
              <div className="absolute inset-x-0 top-0 flex justify-between select-none min-w-[750px]">
                {diagram.lifelines.map((lifeline) => {
                  const styles = getLifelineStyles(lifeline.type);
                  const activeStep = diagram.steps[currentStepIndex];
                  const isActive = activeStep && (activeStep.from === lifeline.id || activeStep.to === lifeline.id);

                  return (
                    <div 
                      key={lifeline.id} 
                      className={`flex flex-col items-center text-center transition-all duration-300 z-10`}
                      style={{ width: '130px', margin: '0 -65px' }}
                    >
                      <div className={`w-full max-w-[120px] rounded-lg border p-2 flex flex-col items-center gap-1.5 shadow-sm transition-all duration-300 ${
                        isActive 
                          ? 'bg-indigo-600 border-indigo-700 text-white translate-y-[-4px] shadow-md shadow-indigo-100' 
                          : `${styles.bgColor} ${styles.textColor}`
                      }`}>
                        <div className="p-1 bg-white rounded-md shadow-2xs">
                          {styles.icon}
                        </div>
                        <span className="text-xs font-mono font-semibold tracking-tight truncate w-full px-1">
                          {lifeline.name}
                        </span>
                      </div>
                      <span className={`text-[9px] font-medium tracking-wide mt-1 uppercase px-1.5 py-0.5 rounded ${
                        isActive ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-slate-400 bg-slate-100'
                      }`}>
                        {lifeline.type}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Message Flow Arrows */}
              <div className="absolute inset-x-0 top-16 bottom-0 pointer-events-none min-w-[750px]">
                {diagram.steps.map((step, stepIdx) => {
                  if (stepIdx > currentStepIndex) return null;
                  
                  const xFrom = getLifelineXPercent(step.from);
                  const xTo = getLifelineXPercent(step.to);
                  
                  const isCurrent = stepIdx === currentStepIndex;
                  const stepY = 24 + stepIdx * 25;

                  const isLeftToRight = xFrom < xTo;
                  const isSelf = xFrom === xTo;

                  const arrowColor = isCurrent 
                    ? 'stroke-indigo-600 text-indigo-600 font-bold drop-shadow-[0_1px_3px_rgba(79,70,229,0.2)]' 
                    : 'stroke-slate-400 text-slate-400 font-medium';
                  
                  if (isSelf) {
                    return (
                      <div 
                        key={step.id} 
                        className="absolute flex items-center transition-all duration-300"
                        style={{ 
                          left: `${xFrom}%`, 
                          top: `${stepY}px`,
                          marginLeft: '6px',
                          height: '24px'
                        }}
                      >
                        <svg className="w-16 h-8 overflow-visible" fill="none" viewBox="0 0 64 32">
                          <path 
                            d="M0,4 C16,4 28,10 28,16 C28,22 16,28 2,28" 
                            className={`fill-none stroke-2 ${isCurrent ? 'stroke-indigo-600' : 'stroke-slate-400'}`} 
                          />
                          <polygon 
                            points="0,28 -6,25 -6,31" 
                            className={`fill-current ${isCurrent ? 'text-indigo-600' : 'text-slate-400'}`} 
                          />
                        </svg>
                        <span className={`text-[10px] font-mono whitespace-nowrap ml-2 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded border border-slate-100 ${isCurrent ? 'text-indigo-700 font-bold border-indigo-200' : 'text-slate-500'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  }

                  const widthPerc = Math.abs(xTo - xFrom);
                  const leftPerc = Math.min(xFrom, xTo);

                  return (
                    <div 
                      key={step.id} 
                      className="absolute"
                      style={{ 
                        left: `${leftPerc}%`, 
                        width: `${widthPerc}%`, 
                        top: `${stepY}px`, 
                        height: '20px' 
                      }}
                    >
                      <div className="absolute w-full text-center -top-4.5 flex justify-center">
                        <span className={`text-[10px] md:text-xs font-mono select-none px-2 py-0.5 rounded bg-white/95 border transition-all duration-300 ${
                          isCurrent 
                            ? 'text-indigo-800 border-indigo-300 font-bold shadow-xs z-10 scale-102 bg-indigo-50/50' 
                            : 'text-slate-500 border-slate-100 z-0 text-[10px]'
                        }`}>
                          {step.label}
                        </span>
                      </div>

                      <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <line 
                          x1={isLeftToRight ? 0 : 100} 
                          y1={10} 
                          x2={isLeftToRight ? 100 : 0} 
                          y2={10} 
                          className={`${arrowColor}`} 
                          strokeWidth={isCurrent ? 2 : 1.5}
                          strokeDasharray={step.isReturn ? '5,5' : '0'}
                        />
                        <polygon 
                          points={isLeftToRight ? "100,10 93,6 93,14" : "0,10 7,6 7,14"} 
                          className={`fill-current ${isCurrent ? 'text-indigo-600' : 'text-slate-400'}`} 
                        />
                      </svg>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Steps & Controls Panel */}
          <div className="p-4 border-t border-slate-100 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentStepIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="bg-slate-50 border border-slate-200/50 rounded-xl p-3 flex gap-2.5 items-start font-sans"
                >
                  <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                        BƯỚC {currentStepIndex + 1}/{diagram.steps.length}:
                      </span>
                      <span className="font-sans font-semibold text-slate-800 text-xs text-left">
                        {diagram.steps[currentStepIndex]?.label.split('. ')[1] || diagram.steps[currentStepIndex]?.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed text-left">
                      {diagram.steps[currentStepIndex]?.note || 'Nhân viên kích hoạt tác vụ trên form giao diện.'}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400 font-mono">
                      <span>Nguồn: <strong>{diagram.steps[currentStepIndex]?.from}</strong></span>
                      <span>&rarr;</span>
                      <span>Đích: <strong>{diagram.steps[currentStepIndex]?.to}</strong></span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-2 shrink-0 select-none font-sans">
              <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={handleReset}
                  disabled={currentStepIndex === 0}
                  title="Quay lại từ đầu"
                  className="p-1.5 rounded-md hover:bg-white text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-200" />
                <button
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                  title="Bước trước"
                  className="p-1.5 rounded-md hover:bg-white text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleTogglePlay}
                  title={isPlaying ? 'Tạm dừng chạy tự động' : 'Tự động chạy từng bước'}
                  className="p-1.5 px-3 rounded-md bg-white hover:bg-indigo-50 text-indigo-600 border border-slate-200/40 shadow-xs hover:border-indigo-100 cursor-pointer flex items-center gap-1 text-xs font-semibold select-none transition-colors"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current shrink-0" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current shrink-0" /> Auto Play
                    </>
                  )}
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentStepIndex === diagram.steps.length - 1}
                  title="Bước tiếp theo"
                  className="p-1.5 rounded-md hover:bg-white text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <span className="text-[10px] text-slate-400 font-mono">
                Thứ tự: Actor &rarr; Boundary &rarr; Control &rarr; Entity &rarr; Actor
              </span>
            </div>
          </div>
        </>
      ) : (
        /* PlantUML Code view compliant with UEH standards */
        <div className="flex-1 p-5 bg-slate-950 text-slate-100 font-mono flex flex-col min-h-[440px] overflow-hidden text-left">
          <div className="mb-3.5 flex items-center justify-between flex-wrap gap-3 text-xs border-b border-slate-900 pb-3 font-sans">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shrink-0" />
              <span className="text-slate-300 font-semibold">Cấu trúc 3 lớp phân cấp (UEH System Standard)</span>
            </div>
            
            <div className="flex items-center gap-2">
              <a 
                href="https://www.planttext.com/" 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] bg-indigo-950/85 hover:bg-indigo-900 text-indigo-200 px-3 py-1.5 rounded-lg border border-indigo-800 transition-all flex items-center gap-1.5 font-medium cursor-pointer"
              >
                <span>Sơ đồ PlantText</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => handleCopyCode(generatePlantUmlSource(diagram))}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-indigo-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-all flex items-center gap-1.5 font-semibold cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Đã sao chép!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép mã</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* PlantUML Code Block */}
          <div className="flex-1 border border-slate-900 rounded-xl bg-slate-900/40 overflow-y-auto max-h-[350px] relative p-4 mb-3.5">
            <pre className="text-[11px] text-emerald-400/90 leading-relaxed font-mono whitespace-pre select-all">
              {generatePlantUmlSource(diagram)}
            </pre>
          </div>

          {/* Academic Instructions footer */}
          <div className="bg-slate-900/60 border border-slate-900 rounded-xl p-3 text-[11px] text-slate-400 leading-normal font-sans">
            <p className="font-semibold text-slate-300 mb-1">🎓 Ghi chú dành cho sinh viên UEH:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Mã nguồn trên đã được đặc tả chính xác theo mô hình <strong>Vận hành Robust (Robustness Diagram Standard)</strong> gồm: Actor (Nhân viên), Boundary (Giao diện biên), Control (Lớp xử lý nghiệp vụ), và Entity (Thực thể dữ liệu).</li>
              <li>Khi sao chép vào <a href="https://www.planttext.com/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline inline-flex items-center gap-0.5">PlantText <ExternalLink className="w-2.5 h-2.5 inline" /></a>, website sẽ tự động kết xuất hình ảnh UML hoàn hảo, sẵn sàng cho báo cáo đồ án của môn học.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
