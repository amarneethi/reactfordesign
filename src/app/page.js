'use client'
import { useState, useRef, useCallback, useEffect } from "react";

// ── Icon library (inline SVG icons) ──
const ICONS = {
  star: (s = 20, c = "currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke={c} strokeWidth="1"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
  heart: (s = 20, c = "currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke={c} strokeWidth="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  circle: (s = 20, c = "currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke={c} strokeWidth="1"><circle cx="12" cy="12" r="10"/></svg>,
  check: (s = 20, c = "currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  arrow: (s = 20, c = "currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  plus: (s = 20, c = "currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  home: (s = 20, c = "currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  user: (s = 20, c = "currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  mail: (s = 20, c = "currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  search: (s = 20, c = "currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  settings: (s = 20, c = "currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  zap: (s = 20, c = "currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke={c} strokeWidth="1"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  image: (s = 20, c = "currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
};

const ICON_NAMES = Object.keys(ICONS);

// ── Unique ID generator ──
let _id = 0;
const uid = () => `el_${++_id}_${Date.now()}`;

// ── Initial artboard (module-level so id is stable across renders) ──
const _initAb = (() => {
  const id = uid();
  return { id, name: "Artboard 1", width: 800, height: 600, x: 0, y: 0, children: [] };
})();

// ── Default element factories ──
const createRect = (parent = null, extras = {}) => ({
  id: uid(), type: "rect", parent,
  label: "Rectangle",
  x: 0, y: 0,
  width: 120, height: 80,
  bg: "#6366f1", borderRadius: 8, borderWidth: 0, borderColor: "#000",
  opacity: 1,
  position: "relative",
  display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start",
  gap: 0, padding: 12, flexWrap: "nowrap", overflow: "visible",
  flexGrow: 0, flexShrink: 1, alignSelf: "auto",
  children: [],
  ...extras,
});

const createText = (parent = null, extras = {}) => ({
  id: uid(), type: "text", parent,
  label: "Text",
  x: 0, y: 0,
  content: "Text", fontSize: 16, fontWeight: "400", color: "#ffffff",
  fontFamily: "'Inter', sans-serif", textAlign: "left", lineHeight: 1.4, letterSpacing: 0,
  position: "relative",
  flexGrow: 0, flexShrink: 1, alignSelf: "auto",
  width: "auto", height: "auto",
  opacity: 1,
  ...extras,
});

const createIcon = (parent = null, extras = {}) => ({
  id: uid(), type: "icon", parent,
  label: "Icon",
  x: 0, y: 0,
  iconName: "star", iconSize: 24, color: "#ffffff",
  position: "relative",
  flexGrow: 0, flexShrink: 1, alignSelf: "auto",
  opacity: 1,
  ...extras,
});

// ── Tiny color input ──
const ColorInput = ({ value, onChange, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <div style={{ position: "relative", width: 22, height: 22, borderRadius: 4, border: "1px solid #3a3a4a", overflow: "hidden", cursor: "pointer", background: value }}>
      <input type="color" value={value} onChange={e => onChange(e.target.value)}
        style={{ position: "absolute", inset: -4, width: 30, height: 30, opacity: 0, cursor: "pointer" }} />
    </div>
    {label && <span style={{ fontSize: 11, color: "#999" }}>{label}</span>}
  </div>
);

const NumInput = ({ value, onChange, label, min, max, step = 1, unit = "" }) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 2, fontSize: 11, color: "#999" }}>
    {label}
    <input type="number" value={value} min={min} max={max} step={step}
      onChange={e => onChange(parseFloat(e.target.value) || 0)}
      style={{ width: "100%", background: "#1e1e2e", border: "1px solid #3a3a4a", borderRadius: 4, color: "#e0e0e0", padding: "4px 6px", fontSize: 12, outline: "none" }} />
  </label>
);

const SelectInput = ({ value, onChange, label, options }) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 2, fontSize: 11, color: "#999" }}>
    {label}
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ width: "100%", background: "#1e1e2e", border: "1px solid #3a3a4a", borderRadius: 4, color: "#e0e0e0", padding: "4px 6px", fontSize: 12, outline: "none" }}>
      {options.map(o => <option key={typeof o === "string" ? o : o.value} value={typeof o === "string" ? o : o.value}>{typeof o === "string" ? o : o.label}</option>)}
    </select>
  </label>
);

// ── Toggle button group ──
const BtnGroup = ({ options, value, onChange, label }) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 11, color: "#999" }}>
    {label}
    <div style={{ display: "flex", gap: 1, background: "#1a1a2a", borderRadius: 5, padding: 2 }}>
      {options.map(o => {
        const val = typeof o === "string" ? o : o.value;
        const lbl = typeof o === "string" ? o : o.label;
        const active = value === val;
        return (
          <button key={val} onClick={() => onChange(val)}
            style={{ flex: 1, padding: "3px 4px", fontSize: 10, border: "none", borderRadius: 4, cursor: "pointer", fontWeight: active ? 600 : 400,
              background: active ? "#6366f1" : "transparent", color: active ? "#fff" : "#888", transition: "all 0.15s" }}>
            {lbl}
          </button>
        );
      })}
    </div>
  </label>
);

// ── Section header ──
const Section = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid #2a2a3a" }}>
      <div onClick={() => setOpen(!open)} style={{ padding: "8px 12px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, fontWeight: 600, color: "#ccc", textTransform: "uppercase", letterSpacing: 1 }}>
        {title}
        <span style={{ fontSize: 10, transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "0.15s" }}>▶</span>
      </div>
      {open && <div style={{ padding: "4px 12px 12px" }}>{children}</div>}
    </div>
  );
};

// ── MAIN APP ──
export default function DesignTool() {
  const [artboards, setArtboards] = useState([_initAb]);
  const [activeArtboardId, setActiveArtboardId] = useState(_initAb.id);
  const [elements, setElements] = useState({});
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [dragging, setDragging] = useState(null);
  const [draggingArtboard, setDraggingArtboard] = useState(null);
  const [resizing, setResizing] = useState(null);
  const [editingText, setEditingText] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const canvasRef = useRef(null);

  // ── Artboard CRUD ──
  const updateArtboard = useCallback((id, patch) => {
    setArtboards(prev => prev.map(ab => ab.id === id ? { ...ab, ...patch } : ab));
  }, []);

  const addArtboard = useCallback(() => {
    setArtboards(prev => {
      const lastAb = prev[prev.length - 1];
      const newAb = {
        id: uid(),
        name: `Artboard ${prev.length + 1}`,
        width: 800, height: 600,
        x: lastAb.x + lastAb.width + 80,
        y: 0,
        children: [],
      };
      setActiveArtboardId(newAb.id);
      return [...prev, newAb];
    });
    setSelectedIds(new Set());
  }, []);

  const deleteArtboard = useCallback((id) => {
    setArtboards(prev => {
      if (prev.length <= 1) return prev;
      const remaining = prev.filter(ab => ab.id !== id);
      setActiveArtboardId(remaining[0].id);
      // Remove all elements belonging to this artboard
      const ab = prev.find(a => a.id === id);
      if (ab) {
        const toRemove = [];
        const gather = (eid) => {
          toRemove.push(eid);
          setElements(els => {
            const e = els[eid];
            if (e && e.children) e.children.forEach(c => gather(c));
            return els;
          });
        };
        ab.children.forEach(c => gather(c));
        setElements(els => {
          const next = { ...els };
          toRemove.forEach(r => delete next[r]);
          return next;
        });
      }
      return remaining;
    });
    setSelectedIds(new Set());
  }, []);

  // ── Element CRUD ──
  const updateEl = useCallback((id, patch) => {
    setElements(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }, []);

  const addElement = useCallback((factory, parentId = null) => {
    const el = factory(parentId);
    setElements(prev => ({ ...prev, [el.id]: el }));
    if (parentId) {
      setElements(prev => ({
        ...prev,
        [parentId]: { ...prev[parentId], children: [...(prev[parentId].children || []), el.id] }
      }));
    } else {
      setArtboards(prev => prev.map(ab =>
        ab.id === activeArtboardId
          ? { ...ab, children: [...ab.children, el.id] }
          : ab
      ));
    }
    setSelectedIds(new Set([el.id]));
  }, [activeArtboardId]);

  const deleteElement = useCallback((id) => {
    if (!id) return;
    const el = elements[id];
    if (el.parent) {
      setElements(prev => ({
        ...prev,
        [el.parent]: { ...prev[el.parent], children: prev[el.parent].children.filter(c => c !== id) }
      }));
    } else {
      setArtboards(prev => prev.map(ab => ({
        ...ab,
        children: ab.children.filter(c => c !== id),
      })));
    }
    const toRemove = [id];
    const gather = (eid) => {
      const e = elements[eid];
      if (e && e.children) e.children.forEach(c => { toRemove.push(c); gather(c); });
    };
    gather(id);
    setElements(prev => {
      const next = { ...prev };
      toRemove.forEach(r => delete next[r]);
      return next;
    });
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  }, [elements]);

  const duplicateElement = useCallback((id) => {
    if (!id) return;
    const el = elements[id];
    const newId = uid();
    const cloned = { ...el, id: newId, label: el.label + " copy", children: [] };
    setElements(prev => ({ ...prev, [newId]: cloned }));
    if (el.parent) {
      setElements(prev => ({
        ...prev,
        [el.parent]: { ...prev[el.parent], children: [...prev[el.parent].children, newId] }
      }));
    } else {
      setArtboards(prev => prev.map(ab => ({
        ...ab,
        children: ab.children.includes(id) ? [...ab.children, newId] : ab.children,
      })));
    }
    setSelectedIds(new Set([newId]));
  }, [elements]);

  // ── Batch delete / duplicate for multi-select ──
  const deleteSelected = useCallback(() => {
    if (selectedIds.size === 0) return;
    const ids = [...selectedIds];
    const toRemove = new Set();
    const gather = (eid) => {
      if (toRemove.has(eid)) return;
      toRemove.add(eid);
      const e = elements[eid];
      if (e?.children) e.children.forEach(c => gather(c));
    };
    ids.forEach(id => gather(id));
    // Remove from parent elements (only if parent is not itself being removed)
    ids.forEach(id => {
      const el = elements[id];
      if (el?.parent && !toRemove.has(el.parent)) {
        setElements(prev => ({
          ...prev,
          [el.parent]: { ...prev[el.parent], children: (prev[el.parent]?.children || []).filter(c => !toRemove.has(c)) }
        }));
      }
    });
    setArtboards(prev => prev.map(ab => ({ ...ab, children: ab.children.filter(c => !toRemove.has(c)) })));
    setElements(prev => { const next = { ...prev }; toRemove.forEach(r => delete next[r]); return next; });
    setSelectedIds(new Set());
  }, [elements, selectedIds]);

  const duplicateSelected = useCallback(() => {
    if (selectedIds.size === 0) return;
    const newIds = [];
    [...selectedIds].forEach(id => {
      const el = elements[id];
      if (!el) return;
      const newId = uid();
      const cloned = { ...el, id: newId, label: el.label + " copy", children: [] };
      setElements(prev => ({ ...prev, [newId]: cloned }));
      if (el.parent) {
        setElements(prev => ({
          ...prev,
          [el.parent]: { ...prev[el.parent], children: [...prev[el.parent].children, newId] }
        }));
      } else {
        setArtboards(prev => prev.map(ab => ({
          ...ab,
          children: ab.children.includes(id) ? [...ab.children, newId] : ab.children,
        })));
      }
      newIds.push(newId);
    });
    setSelectedIds(new Set(newIds));
  }, [elements, selectedIds]);

  // ── Drag (absolute positioned elements) ──
  const onMouseDown = useCallback((e, id) => {
    e.stopPropagation();
    const el = elements[id];
    if (el.position === "absolute") {
      setDragging({ id, startX: e.clientX, startY: e.clientY, origX: el.x || 0, origY: el.y || 0 });
    }
    if (e.shiftKey || e.metaKey || e.ctrlKey) {
      setSelectedIds(prev => {
        if (prev.size === 0) return new Set([id]);
        // Find artboard of an element by walking up to root and checking artboards
        const getAb = (eid) => {
          let cur = elements[eid];
          while (cur?.parent) cur = elements[cur.parent];
          if (!cur) return null;
          return artboards.find(ab => ab.children.includes(cur.id))?.id ?? null;
        };
        if (getAb([...prev][0]) !== getAb(id)) return new Set([id]);
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next.size > 0 ? next : new Set([id]);
      });
    } else {
      setSelectedIds(new Set([id]));
    }
  }, [elements, artboards]);

  // ── Resize ──
  const onResizeStart = useCallback((e, id, handle) => {
    e.stopPropagation();
    e.preventDefault();
    const el = elements[id];
    setResizing({ id, handle, startX: e.clientX, startY: e.clientY, origW: typeof el.width === "number" ? el.width : 120, origH: typeof el.height === "number" ? el.height : 80, origX: el.x || 0, origY: el.y || 0 });
  }, [elements]);

  useEffect(() => {
    const onMove = (e) => {
      if (dragging) {
        const dx = (e.clientX - dragging.startX) / zoom;
        const dy = (e.clientY - dragging.startY) / zoom;
        updateEl(dragging.id, { x: Math.round(dragging.origX + dx), y: Math.round(dragging.origY + dy) });
      }
      if (resizing) {
        const dx = (e.clientX - resizing.startX) / zoom;
        const dy = (e.clientY - resizing.startY) / zoom;
        const h = resizing.handle;
        let w = resizing.origW, ht = resizing.origH, x = resizing.origX, y = resizing.origY;
        if (h.includes("e")) w = Math.max(20, resizing.origW + dx);
        if (h.includes("w")) { w = Math.max(20, resizing.origW - dx); x = resizing.origX + dx; }
        if (h.includes("s")) ht = Math.max(20, resizing.origH + dy);
        if (h.includes("n")) { ht = Math.max(20, resizing.origH - dy); y = resizing.origY + dy; }
        updateEl(resizing.id, { width: Math.round(w), height: Math.round(ht), x: Math.round(x), y: Math.round(y) });
      }
      if (draggingArtboard) {
        const dx = (e.clientX - draggingArtboard.startX) / zoom;
        const dy = (e.clientY - draggingArtboard.startY) / zoom;
        updateArtboard(draggingArtboard.id, { x: Math.round(draggingArtboard.origX + dx), y: Math.round(draggingArtboard.origY + dy) });
      }
      if (isPanning && panStart) {
        const dx = e.clientX - panStart.x;
        const dy = e.clientY - panStart.y;
        setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        setPanStart({ x: e.clientX, y: e.clientY });
      }
    };
    const onUp = () => { setDragging(null); setResizing(null); setDraggingArtboard(null); setIsPanning(false); setPanStart(null); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging, resizing, draggingArtboard, isPanning, panStart, zoom, updateEl, updateArtboard]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const onKey = (e) => {
      if (editingText) return;
      if ((e.key === "Delete" || e.key === "Backspace") && selectedIds.size > 0) { e.preventDefault(); deleteSelected(); }
      if (e.key === "d" && (e.metaKey || e.ctrlKey) && selectedIds.size > 0) { e.preventDefault(); duplicateSelected(); }
      if (e.key === "Escape") setSelectedIds(new Set());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIds, editingText, deleteSelected, duplicateSelected]);

  // Canvas pan with middle mouse / space
  const onCanvasMouseDown = (e) => {
    if (e.button === 1 || e.target === canvasRef.current) {
      if (e.target === canvasRef.current) setSelectedIds(new Set());
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const onWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setZoom(z => Math.max(0.1, Math.min(5, z - e.deltaY * 0.002)));
    }
  };

  // ── Render element ──
  const renderElement = (id, depth = 0) => {
    const el = elements[id];
    if (!el) return null;
    const isSelected = selectedIds.has(id);
    const isHovered = hoveredId === id && !isSelected;

    const baseStyle = {
      position: el.position || "relative",
      ...(el.position === "absolute" ? { left: el.x, top: el.y } : {}),
      opacity: el.opacity ?? 1,
      outline: isSelected ? "2px solid #6366f1" : isHovered ? "1px solid rgba(99,102,241,0.4)" : "none",
      outlineOffset: isSelected ? 1 : 0,
      cursor: el.position === "absolute" ? "move" : "pointer",
      transition: "outline 0.1s",
      boxSizing: "border-box",
      minWidth: 0,
      minHeight: 0,
    };

    if (el.type === "rect") {
      const style = {
        ...baseStyle,
        width: el.width, height: el.height,
        background: el.bg,
        borderRadius: el.borderRadius,
        border: el.borderWidth ? `${el.borderWidth}px solid ${el.borderColor}` : "none",
        display: el.display || "flex",
        flexDirection: el.flexDirection || "row",
        justifyContent: el.justifyContent || "flex-start",
        alignItems: el.alignItems || "flex-start",
        gap: el.gap || 0,
        padding: el.padding ?? 12,
        flexWrap: el.flexWrap || "nowrap",
        overflow: el.overflow || "visible",
        flexGrow: el.flexGrow ?? 0,
        flexShrink: el.flexShrink ?? 1,
        alignSelf: el.alignSelf !== "auto" ? el.alignSelf : undefined,
      };

      return (
        <div key={id} style={style}
          onMouseDown={(e) => onMouseDown(e, id)}
          onMouseEnter={() => setHoveredId(id)}
          onMouseLeave={() => setHoveredId(null)}
          onDrop={(e) => {
            e.stopPropagation();
            e.preventDefault();
            const dragId = e.dataTransfer.getData("element-id");
            if (dragId && dragId !== id) {
              const dragEl = elements[dragId];
              if (dragEl) {
                if (dragEl.parent) {
                  setElements(prev => ({
                    ...prev,
                    [dragEl.parent]: { ...prev[dragEl.parent], children: prev[dragEl.parent].children.filter(c => c !== dragId) }
                  }));
                } else {
                  setArtboards(prev => prev.map(ab => ({
                    ...ab,
                    children: ab.children.filter(c => c !== dragId),
                  })));
                }
                updateEl(dragId, { parent: id });
                setElements(prev => ({
                  ...prev,
                  [id]: { ...prev[id], children: [...(prev[id].children || []), dragId] }
                }));
              }
            }
          }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          {(el.children || []).map(cid => renderElement(cid, depth + 1))}
          {/* Resize handles */}
          {selectedIds.size === 1 && isSelected && typeof el.width === "number" && (
            <>
              {["nw","ne","sw","se","n","s","e","w"].map(h => {
                const pos = {};
                if (h.includes("n")) pos.top = -4;
                if (h.includes("s")) pos.bottom = -4;
                if (h.includes("e")) pos.right = -4;
                if (h.includes("w")) pos.left = -4;
                if (h === "n" || h === "s") { pos.left = "50%"; pos.transform = "translateX(-50%)"; }
                if (h === "e" || h === "w") { pos.top = "50%"; pos.transform = "translateY(-50%)"; }
                const cursors = { n: "ns-resize", s: "ns-resize", e: "ew-resize", w: "ew-resize", nw: "nwse-resize", ne: "nesw-resize", sw: "nesw-resize", se: "nwse-resize" };
                return <div key={h} onMouseDown={(e) => onResizeStart(e, id, h)} style={{
                  position: "absolute", ...pos, width: 8, height: 8, background: "#fff", border: "1.5px solid #6366f1",
                  borderRadius: 2, cursor: cursors[h], zIndex: 100
                }} />;
              })}
            </>
          )}
        </div>
      );
    }

    if (el.type === "text") {
      const style = {
        ...baseStyle,
        fontSize: el.fontSize, fontWeight: el.fontWeight, color: el.color,
        fontFamily: el.fontFamily, textAlign: el.textAlign, lineHeight: el.lineHeight,
        letterSpacing: el.letterSpacing,
        width: el.width === "auto" ? undefined : el.width,
        flexGrow: el.flexGrow ?? 0,
        flexShrink: el.flexShrink ?? 1,
        alignSelf: el.alignSelf !== "auto" ? el.alignSelf : undefined,
        whiteSpace: "pre-wrap", wordBreak: "break-word",
        padding: 2,
      };
      return (
        <div key={id} style={style}
          draggable
          onDragStart={(e) => { e.dataTransfer.setData("element-id", id); }}
          onMouseDown={(e) => onMouseDown(e, id)}
          onMouseEnter={() => setHoveredId(id)}
          onMouseLeave={() => setHoveredId(null)}
          onDoubleClick={(e) => { e.stopPropagation(); setEditingText(id); }}
        >
          {editingText === id ? (
            <textarea
              autoFocus
              value={el.content}
              onChange={(e) => updateEl(id, { content: e.target.value })}
              onBlur={() => setEditingText(null)}
              onKeyDown={(e) => { if (e.key === "Escape") setEditingText(null); }}
              style={{ all: "inherit", background: "rgba(0,0,0,0.15)", border: "none", outline: "1px dashed #6366f1", resize: "none", width: "100%", minHeight: 20, padding: 2, fontFamily: "inherit" }}
            />
          ) : el.content}
        </div>
      );
    }

    if (el.type === "icon") {
      const style = {
        ...baseStyle,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        flexGrow: el.flexGrow ?? 0,
        flexShrink: el.flexShrink ?? 1,
        alignSelf: el.alignSelf !== "auto" ? el.alignSelf : undefined,
        padding: 2,
      };
      return (
        <div key={id} style={style}
          draggable
          onDragStart={(e) => { e.dataTransfer.setData("element-id", id); }}
          onMouseDown={(e) => onMouseDown(e, id)}
          onMouseEnter={() => setHoveredId(id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {ICONS[el.iconName] ? ICONS[el.iconName](el.iconSize, el.color) : ICONS.star(el.iconSize, el.color)}
        </div>
      );
    }
    return null;
  };

  // ── Layer tree ──
  const renderTreeItems = (ids, depth = 0) => {
    return ids.map(id => {
      const el = elements[id];
      if (!el) return null;
      const isSelected = selectedIds.has(id);
      const icon = el.type === "rect" ? "□" : el.type === "text" ? "T" : "✦";
      return (
        <div key={id}>
          <div
            onClick={(e) => {
              if (e.shiftKey || e.metaKey || e.ctrlKey) {
                setSelectedIds(prev => {
                  const next = new Set(prev);
                  next.has(id) ? next.delete(id) : next.add(id);
                  return next.size > 0 ? next : new Set([id]);
                });
              } else {
                setSelectedIds(new Set([id]));
              }
            }}
            draggable
            onDragStart={(e) => { e.dataTransfer.setData("element-id", id); }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 8px", paddingLeft: 8 + depth * 14,
              background: isSelected ? "rgba(99,102,241,0.2)" : "transparent",
              borderLeft: isSelected ? "2px solid #6366f1" : "2px solid transparent",
              cursor: "pointer", fontSize: 12, color: isSelected ? "#c7c7ff" : "#aaa",
              transition: "all 0.1s",
            }}
            onMouseEnter={() => setHoveredId(id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <span style={{ fontSize: 11, opacity: 0.6, fontFamily: "monospace", width: 14, textAlign: "center" }}>{icon}</span>
            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{el.label}</span>
          </div>
          {el.children && el.children.length > 0 && renderTreeItems(el.children, depth + 1)}
        </div>
      );
    });
  };

  const renderTree = () => {
    return artboards.map(ab => {
      const isActive = ab.id === activeArtboardId;
      return (
        <div key={ab.id}>
          <div
            onClick={() => { setActiveArtboardId(ab.id); setSelectedIds(new Set()); }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 10px",
              background: isActive ? "rgba(99,102,241,0.12)" : "transparent",
              borderLeft: isActive ? "2px solid #6366f1" : "2px solid transparent",
              cursor: "pointer", fontSize: 11, fontWeight: 600,
              color: isActive ? "#a5a5ff" : "#666",
              textTransform: "uppercase", letterSpacing: 0.6,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ab.name}</span>
          </div>
          {renderTreeItems(ab.children, 1)}
        </div>
      );
    });
  };

  // ── Properties panel ──
  const sel = selectedIds.size === 1 ? elements[[...selectedIds][0]] : null;
  const activeArtboard = artboards.find(ab => ab.id === activeArtboardId);

  const renderProps = () => {
    // Multi-select panel
    if (selectedIds.size > 1) {
      const selectedEls = [...selectedIds].map(id => elements[id]).filter(Boolean);
      const val = (key) => {
        const vals = selectedEls.map(e => e[key]);
        return vals.every(v => v === vals[0]) ? vals[0] : undefined;
      };
      const mixed = (key) => selectedEls.map(e => e[key]).some((v, _, a) => v !== a[0]);
      const updateAll = (patch) => [...selectedIds].forEach(id => updateEl(id, patch));
      const allType = selectedEls.every(e => e.type === selectedEls[0]?.type) ? selectedEls[0]?.type : null;
      return (
        <div style={{ overflowY: "auto", flex: 1 }}>
          <Section title={`${selectedEls.length} Selected`} defaultOpen>
            <div style={{ fontSize: 11, color: "#666", marginBottom: 8 }}>
              {allType ? `All ${allType}s` : "Mixed types"} · Shift/⌘ click to add
            </div>
            <NumInput label="Opacity" value={mixed("opacity") ? "" : (val("opacity") ?? 1)} onChange={v => updateAll({ opacity: v })} min={0} max={1} step={0.05} />
          </Section>

          {allType === "rect" && (
            <>
              <Section title="Size">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  <NumInput label="Width" value={mixed("width") ? "" : (val("width") ?? 120)} onChange={v => updateAll({ width: v })} min={10} />
                  <NumInput label="Height" value={mixed("height") ? "" : (val("height") ?? 80)} onChange={v => updateAll({ height: v })} min={10} />
                </div>
              </Section>
              <Section title="Fill & Border">
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                  <ColorInput value={val("bg") ?? "#6366f1"} onChange={v => updateAll({ bg: v })} label={mixed("bg") ? "Fill (mixed)" : "Fill"} />
                  <ColorInput value={val("borderColor") ?? "#000"} onChange={v => updateAll({ borderColor: v })} label="Border" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  <NumInput label="Radius" value={mixed("borderRadius") ? "" : (val("borderRadius") ?? 0)} onChange={v => updateAll({ borderRadius: v })} min={0} />
                  <NumInput label="Border W" value={mixed("borderWidth") ? "" : (val("borderWidth") ?? 0)} onChange={v => updateAll({ borderWidth: v })} min={0} />
                </div>
              </Section>
            </>
          )}

          {allType === "text" && (
            <Section title="Typography">
              <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <ColorInput value={val("color") ?? "#fff"} onChange={v => updateAll({ color: v })} label={mixed("color") ? "Color (mixed)" : "Color"} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                <NumInput label="Size" value={mixed("fontSize") ? "" : (val("fontSize") ?? 16)} onChange={v => updateAll({ fontSize: v })} min={6} max={200} />
                <SelectInput label="Weight" value={val("fontWeight") ?? "400"} onChange={v => updateAll({ fontWeight: v })}
                  options={["100","200","300","400","500","600","700","800","900"]} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 6 }}>
                <SelectInput label="Align" value={val("textAlign") ?? "left"} onChange={v => updateAll({ textAlign: v })}
                  options={["left","center","right"]} />
                <NumInput label="Line H" value={mixed("lineHeight") ? "" : (val("lineHeight") ?? 1.4)} onChange={v => updateAll({ lineHeight: v })} min={0.5} max={4} step={0.1} />
              </div>
            </Section>
          )}

          {allType === "icon" && (
            <Section title="Icon">
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <ColorInput value={val("color") ?? "#fff"} onChange={v => updateAll({ color: v })} label={mixed("color") ? "Color (mixed)" : "Color"} />
              </div>
              <NumInput label="Size" value={mixed("iconSize") ? "" : (val("iconSize") ?? 24)} onChange={v => updateAll({ iconSize: v })} min={8} max={128} />
            </Section>
          )}

          <Section title="Actions" defaultOpen>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={duplicateSelected} style={{ ...actionBtnStyle, background: "#2a3a2e", borderColor: "#3a5a3e" }}>Duplicate</button>
              <button onClick={deleteSelected} style={{ ...actionBtnStyle, background: "#3a2a2a", borderColor: "#5a3a3a" }}>Delete</button>
            </div>
          </Section>
        </div>
      );
    }

    // No element selected — show artboard properties
    if (!sel) {
      if (!activeArtboard) return null;
      return (
        <div style={{ overflowY: "auto", flex: 1 }}>
          <Section title="Artboard" defaultOpen>
            <input
              value={activeArtboard.name}
              onChange={e => updateArtboard(activeArtboard.id, { name: e.target.value })}
              style={{ width: "100%", background: "#1e1e2e", border: "1px solid #3a3a4a", borderRadius: 4, color: "#e0e0e0", padding: "5px 8px", fontSize: 12, outline: "none", marginBottom: 8 }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              <NumInput label="Width" value={activeArtboard.width} onChange={v => updateArtboard(activeArtboard.id, { width: v })} min={100} />
              <NumInput label="Height" value={activeArtboard.height} onChange={v => updateArtboard(activeArtboard.id, { height: v })} min={100} />
            </div>
            {artboards.length > 1 && (
              <button
                onClick={() => deleteArtboard(activeArtboard.id)}
                style={{ ...actionBtnStyle, marginTop: 10, width: "100%", background: "#3a2a2a", borderColor: "#5a3a3a" }}
              >
                Delete Artboard
              </button>
            )}
          </Section>
        </div>
      );
    }

    return (
      <div style={{ overflowY: "auto", flex: 1 }}>
        {/* Label */}
        <Section title="Element" defaultOpen>
          <input value={sel.label} onChange={e => updateEl(sel.id, { label: e.target.value })}
            style={{ width: "100%", background: "#1e1e2e", border: "1px solid #3a3a4a", borderRadius: 4, color: "#e0e0e0", padding: "5px 8px", fontSize: 12, outline: "none", marginBottom: 6 }} />
          <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
            <BtnGroup label="Position" value={sel.position} onChange={v => updateEl(sel.id, { position: v })} options={["relative", "absolute"]} />
          </div>
          {sel.position === "absolute" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              <NumInput label="X" value={sel.x} onChange={v => updateEl(sel.id, { x: v })} />
              <NumInput label="Y" value={sel.y} onChange={v => updateEl(sel.id, { y: v })} />
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 6 }}>
            <NumInput label="Opacity" value={sel.opacity ?? 1} onChange={v => updateEl(sel.id, { opacity: v })} min={0} max={1} step={0.05} />
          </div>
        </Section>

        {/* RECT specific */}
        {sel.type === "rect" && (
          <>
            <Section title="Size">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <BtnGroup label="Width" value={sel.width === "100%" ? "fill" : "fixed"}
                    onChange={v => updateEl(sel.id, { width: v === "fill" ? "100%" : (typeof sel.width === "number" ? sel.width : 120) })}
                    options={[{ value: "fixed", label: "Fixed" }, { value: "fill", label: "Fill" }]} />
                  {sel.width !== "100%" && (
                    <NumInput value={typeof sel.width === "number" ? sel.width : 120} onChange={v => updateEl(sel.id, { width: v })} min={10} />
                  )}
                </div>
                <NumInput label="Height" value={sel.height} onChange={v => updateEl(sel.id, { height: v })} min={10} />
              </div>
            </Section>

            <Section title="Fill & Border">
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                <ColorInput value={sel.bg} onChange={v => updateEl(sel.id, { bg: v })} label="Fill" />
                <ColorInput value={sel.borderColor || "#000"} onChange={v => updateEl(sel.id, { borderColor: v })} label="Border" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                <NumInput label="Radius" value={sel.borderRadius} onChange={v => updateEl(sel.id, { borderRadius: v })} min={0} />
                <NumInput label="Border W" value={sel.borderWidth || 0} onChange={v => updateEl(sel.id, { borderWidth: v })} min={0} />
              </div>
            </Section>

            <Section title="Flexbox Container">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                <BtnGroup label="Direction" value={sel.flexDirection} onChange={v => updateEl(sel.id, { flexDirection: v })}
                  options={[{ value: "row", label: "→" }, { value: "column", label: "↓" }, { value: "row-reverse", label: "←" }, { value: "column-reverse", label: "↑" }]} />
                <BtnGroup label="Wrap" value={sel.flexWrap} onChange={v => updateEl(sel.id, { flexWrap: v })}
                  options={["nowrap", "wrap"]} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 6 }}>
                <SelectInput label="Justify" value={sel.justifyContent} onChange={v => updateEl(sel.id, { justifyContent: v })}
                  options={["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"]} />
                <SelectInput label="Align" value={sel.alignItems} onChange={v => updateEl(sel.id, { alignItems: v })}
                  options={["flex-start", "center", "flex-end", "stretch", "baseline"]} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 6 }}>
                <NumInput label="Gap" value={sel.gap} onChange={v => updateEl(sel.id, { gap: v })} min={0} />
                <NumInput label="Padding" value={sel.padding} onChange={v => updateEl(sel.id, { padding: v })} min={0} />
              </div>
              <div style={{ marginTop: 6 }}>
                <SelectInput label="Overflow" value={sel.overflow || "visible"} onChange={v => updateEl(sel.id, { overflow: v })}
                  options={["visible", "hidden", "scroll", "auto"]} />
              </div>
            </Section>
          </>
        )}

        {/* TEXT specific */}
        {sel.type === "text" && (
          <>
          <Section title="Size">
            <BtnGroup label="Width" value={sel.width === "100%" ? "fill" : "auto"}
              onChange={v => updateEl(sel.id, { width: v === "fill" ? "100%" : "auto" })}
              options={[{ value: "auto", label: "Auto" }, { value: "fill", label: "Fill" }]} />
          </Section>
          <Section title="Typography">
            <textarea value={sel.content} onChange={e => updateEl(sel.id, { content: e.target.value })} rows={3}
              style={{ width: "100%", background: "#1e1e2e", border: "1px solid #3a3a4a", borderRadius: 4, color: "#e0e0e0", padding: "5px 8px", fontSize: 12, resize: "vertical", outline: "none", marginBottom: 6, fontFamily: "inherit" }} />
            <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <ColorInput value={sel.color} onChange={v => updateEl(sel.id, { color: v })} label="Color" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              <NumInput label="Size" value={sel.fontSize} onChange={v => updateEl(sel.id, { fontSize: v })} min={6} max={200} />
              <SelectInput label="Weight" value={sel.fontWeight} onChange={v => updateEl(sel.id, { fontWeight: v })}
                options={["100", "200", "300", "400", "500", "600", "700", "800", "900"]} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 6 }}>
              <SelectInput label="Align" value={sel.textAlign} onChange={v => updateEl(sel.id, { textAlign: v })}
                options={["left", "center", "right"]} />
              <NumInput label="Line H" value={sel.lineHeight} onChange={v => updateEl(sel.id, { lineHeight: v })} min={0.5} max={4} step={0.1} />
            </div>
            <div style={{ marginTop: 6 }}>
              <NumInput label="Letter Spacing" value={sel.letterSpacing} onChange={v => updateEl(sel.id, { letterSpacing: v })} min={-5} max={20} step={0.5} />
            </div>
            <div style={{ marginTop: 6 }}>
              <SelectInput label="Font" value={sel.fontFamily} onChange={v => updateEl(sel.id, { fontFamily: v })}
                options={[
                  { value: "'Inter', sans-serif", label: "Inter" },
                  { value: "'Georgia', serif", label: "Georgia" },
                  { value: "'Courier New', monospace", label: "Courier" },
                  { value: "'Arial', sans-serif", label: "Arial" },
                  { value: "'Trebuchet MS', sans-serif", label: "Trebuchet" },
                  { value: "'Impact', sans-serif", label: "Impact" },
                  { value: "'Comic Sans MS', cursive", label: "Comic Sans" },
                  { value: "system-ui", label: "System UI" },
                ]} />
            </div>
          </Section>
          </>
        )}

        {/* ICON specific */}
        {sel.type === "icon" && (
          <Section title="Icon">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4, marginBottom: 8 }}>
              {ICON_NAMES.map(name => (
                <button key={name} onClick={() => updateEl(sel.id, { iconName: name })}
                  style={{
                    padding: 6, background: sel.iconName === name ? "#6366f1" : "#1e1e2e",
                    border: sel.iconName === name ? "1px solid #818cf8" : "1px solid #3a3a4a",
                    borderRadius: 4, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    color: sel.iconName === name ? "#fff" : "#888",
                  }}>
                  {ICONS[name](14, sel.iconName === name ? "#fff" : "#888")}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <ColorInput value={sel.color} onChange={v => updateEl(sel.id, { color: v })} label="Color" />
            </div>
            <NumInput label="Size" value={sel.iconSize} onChange={v => updateEl(sel.id, { iconSize: v })} min={8} max={128} />
          </Section>
        )}

        {/* Flex child properties (for all) */}
        <Section title="Flex Child" defaultOpen={false}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            <NumInput label="Grow" value={sel.flexGrow ?? 0} onChange={v => updateEl(sel.id, { flexGrow: v })} min={0} max={10} />
            <NumInput label="Shrink" value={sel.flexShrink ?? 1} onChange={v => updateEl(sel.id, { flexShrink: v })} min={0} max={10} />
          </div>
          <div style={{ marginTop: 6 }}>
            <SelectInput label="Align Self" value={sel.alignSelf || "auto"} onChange={v => updateEl(sel.id, { alignSelf: v })}
              options={["auto", "flex-start", "center", "flex-end", "stretch", "baseline"]} />
          </div>
        </Section>

        {/* Actions */}
        <Section title="Actions" defaultOpen>
          {sel.type === "rect" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: "#666", marginBottom: 2 }}>Add child inside:</span>
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={() => addElement(createRect, sel.id)} style={actionBtnStyle}>+ Rect</button>
                <button onClick={() => addElement(createText, sel.id)} style={actionBtnStyle}>+ Text</button>
                <button onClick={() => addElement(createIcon, sel.id)} style={actionBtnStyle}>+ Icon</button>
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => duplicateElement(sel.id)} style={{ ...actionBtnStyle, background: "#2a3a2e", borderColor: "#3a5a3e" }}>Duplicate</button>
            <button onClick={() => deleteElement(sel.id)} style={{ ...actionBtnStyle, background: "#3a2a2a", borderColor: "#5a3a3a" }}>Delete</button>
          </div>
        </Section>
      </div>
    );
  };

  const actionBtnStyle = {
    flex: 1, padding: "6px 8px", fontSize: 11, border: "1px solid #3a3a4a", borderRadius: 4,
    background: "#1e1e2e", color: "#ccc", cursor: "pointer", fontWeight: 500,
  };

  // ── Styles ──
  const sidebarStyle = {
    width: 220, background: "#14141e", borderRight: "1px solid #2a2a3a", display: "flex", flexDirection: "column", overflow: "hidden",
    fontFamily: "'Inter', -apple-system, sans-serif",
  };
  const propsPanelStyle = {
    width: 240, background: "#14141e", borderLeft: "1px solid #2a2a3a", display: "flex", flexDirection: "column", overflow: "hidden",
    fontFamily: "'Inter', -apple-system, sans-serif",
  };

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh", background: "#0d0d15", color: "#e0e0e0", fontFamily: "'Inter', -apple-system, sans-serif", overflow: "hidden", userSelect: (dragging || resizing || draggingArtboard) ? "none" : "auto" }}>
      {/* Left sidebar: Layers + Add */}
      <div style={sidebarStyle}>
        <div style={{ padding: "10px 12px", borderBottom: "1px solid #2a2a3a", display: "flex", alignItems: "center", gap: 6, background: "#18182a" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="3"/></svg>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.5, color: "#a5a5ff" }}>FlexDesign</span>
        </div>

        {/* Add element buttons */}
        <div style={{ padding: "8px 10px", borderBottom: "1px solid #2a2a3a", display: "flex", gap: 4 }}>
          <button onClick={() => addElement(createRect)} style={{ ...addBtnStyle, background: "#6366f1" }} title="Rectangle">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
          </button>
          <button onClick={() => addElement(createText)} style={addBtnStyle} title="Text">
            <span style={{ fontSize: 13, fontWeight: 700 }}>T</span>
          </button>
          <button onClick={() => addElement(createIcon)} style={addBtnStyle} title="Icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#ccc" stroke="#ccc" strokeWidth="0.5"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
          </button>
          {/* Add artboard button */}
          <button onClick={addArtboard} style={{ ...addBtnStyle, marginLeft: "auto", paddingLeft: 8, paddingRight: 8, gap: 4, fontSize: 10, color: "#888", flexShrink: 0, flexGrow: 0, width: "auto" }} title="Add Artboard">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Frame
          </button>
        </div>

        {/* Layer tree */}
        <div style={{ flex: 1, overflowY: "auto", paddingTop: 4 }}>
          <div style={{ padding: "4px 10px", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2, color: "#555" }}>Layers</div>
          {renderTree()}
        </div>

        {/* Zoom */}
        <div style={{ padding: "8px 10px", borderTop: "1px solid #2a2a3a", display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={() => setZoom(z => Math.max(0.1, z - 0.1))} style={zoomBtnStyle}>−</button>
          <span style={{ fontSize: 11, color: "#888", flex: 1, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(5, z + 0.1))} style={zoomBtnStyle}>+</button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} style={{ ...zoomBtnStyle, fontSize: 9 }}>FIT</button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={canvasRef} style={{ flex: 1, overflow: "hidden", background: "#0d0d15", position: "relative", cursor: isPanning ? "grabbing" : "default" }}
        onMouseDown={onCanvasMouseDown}
        onWheel={onWheel}
      >
        {/* Grid pattern */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }} />

        {/* All artboards */}
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "center center" }}>
          {artboards.map(ab => {
            const isActive = ab.id === activeArtboardId;
            return (
              <div key={ab.id} style={{ position: "absolute", left: ab.x, top: ab.y }}>
                {/* Artboard label */}
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setActiveArtboardId(ab.id);
                    setSelectedIds(new Set());
                    setDraggingArtboard({ id: ab.id, startX: e.clientX, startY: e.clientY, origX: ab.x, origY: ab.y });
                  }}
                  style={{
                    position: "absolute", top: -24, left: 0,
                    fontSize: 11, fontWeight: 600,
                    color: isActive ? "#a5a5ff" : "#555",
                    cursor: draggingArtboard?.id === ab.id ? "grabbing" : "grab",
                    userSelect: "none",
                    transition: "color 0.1s",
                  }}
                >
                  {ab.name} — {ab.width} × {ab.height}
                </div>
                {/* Artboard body */}
                <div
                  style={{
                    width: ab.width, minHeight: ab.height, background: "#1a1a2e",
                    borderRadius: 8,
                    border: isActive ? "1px solid #3a3a5a" : "1px solid #2a2a3a",
                    boxShadow: isActive ? "0 20px 60px rgba(0,0,0,0.5)" : "0 10px 40px rgba(0,0,0,0.3)",
                    display: "flex", flexDirection: "column", alignItems: "flex-start",
                    padding: 24, gap: 12, position: "relative",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                  onMouseDown={(e) => {
                    if (e.target === e.currentTarget) {
                      setActiveArtboardId(ab.id);
                      setSelectedIds(new Set());
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const dragId = e.dataTransfer.getData("element-id");
                    if (dragId && elements[dragId]) {
                      const dragEl = elements[dragId];
                      if (dragEl.parent) {
                        setElements(prev => ({
                          ...prev,
                          [dragEl.parent]: { ...prev[dragEl.parent], children: prev[dragEl.parent].children.filter(c => c !== dragId) }
                        }));
                        updateEl(dragId, { parent: null });
                        setArtboards(prev => prev.map(a =>
                          a.id === ab.id ? { ...a, children: [...a.children, dragId] } : a
                        ));
                      }
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {ab.children.map(id => renderElement(id))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Help tooltip */}
        <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", background: "rgba(20,20,30,0.85)", border: "1px solid #2a2a3a", borderRadius: 6, padding: "6px 14px", fontSize: 11, color: "#666", display: "flex", gap: 16, backdropFilter: "blur(8px)" }}>
          <span><b style={{ color: "#888" }}>Ctrl+Scroll</b> Zoom</span>
          <span><b style={{ color: "#888" }}>Drag</b> canvas to pan</span>
          <span><b style={{ color: "#888" }}>Dbl-click</b> text to edit</span>
          <span><b style={{ color: "#888" }}>Del</b> remove</span>
          <span><b style={{ color: "#888" }}>Ctrl+D</b> duplicate</span>
        </div>
      </div>

      {/* Right sidebar: Properties */}
      <div style={propsPanelStyle}>
        <div style={{ padding: "10px 12px", borderBottom: "1px solid #2a2a3a", fontSize: 12, fontWeight: 600, color: "#888", background: "#18182a", textTransform: "uppercase", letterSpacing: 1 }}>
          Properties
        </div>
        {renderProps()}
      </div>
    </div>
  );
}

const addBtnStyle = {
  flex: 1, padding: "6px 0", border: "1px solid #3a3a4a", borderRadius: 5,
  background: "#1e1e2e", color: "#ccc", cursor: "pointer", display: "flex",
  alignItems: "center", justifyContent: "center", fontSize: 12, gap: 4,
};

const zoomBtnStyle = {
  padding: "3px 8px", border: "1px solid #3a3a4a", borderRadius: 4,
  background: "#1e1e2e", color: "#aaa", cursor: "pointer", fontSize: 13,
};
