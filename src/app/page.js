'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as LucideIcons from 'lucide-react';
import {
  Star,
  Square,
  SquarePlus,
  Layers,
  ChevronRight,
  Undo2,
  Redo2,
  Type,
  Frame,
} from 'lucide-react';
import { lucideIcons } from './lucideIcons';

// ── Icon library ──
const toIconComponent = (name) => {
  const pascal = name.replace(/(^|-)([a-z0-9])/g, (_, __, c) =>
    c.toUpperCase(),
  );
  return LucideIcons[pascal] || null;
};

const renderIcon = (name, size = 20, color = 'currentColor') => {
  const Comp = toIconComponent(name);
  return Comp ? <Comp size={size} color={color} /> : null;
};

const ICON_NAMES = Object.keys(lucideIcons);

// ── Unique ID generator ──
let _id = 0;
const uid = () => `el_${++_id}_${Date.now()}`;

// ── Random name generator ──
const NAMES = [
  'Anu',
  'Ari',
  'Dev',
  'Dhi',
  'Ila',
  'Jai',
  'Kavi',
  'Kiran',
  'Nav',
  'Neel',
  'Om',
  'Prem',
  'Raj',
  'Ravi',
  'Ria',
  'Rishi',
  'Sat',
  'Shiv',
  'Sri',
  'Tej',
  'Uma',
  'Vani',
  'Veer',
  'Vel',
  'Yash',
  'Ai',
  'Bao',
  'Cai',
  'Chen',
  'Hana',
  'Haru',
  'Jin',
  'Jun',
  'Kei',
  'Lan',
  'Lei',
  'Lin',
  'Ming',
  'Ran',
  'Rei',
  'Ren',
  'Rui',
  'Soo',
  'Tae',
  'Wei',
  'Xin',
  'Yan',
  'Yoo',
  'Yuki',
  'Zhen',
  'An',
  'Dao',
  'Linh',
  'Mai',
  'Minh',
  'Nhi',
  'Pita',
  'Sang',
  'Sol',
  'Tai',
  'Tam',
  'Tan',
  'Tao',
  'Thu',
  'Tran',
  'Tuyen',
  'Van',
  'Viet',
  'Wisa',
  'Yen',
  'Yui',
  'Zara',
  'Zen',
  'Zin',
  'Amir',
  'Dara',
  'Eden',
  'Eli',
  'Faiz',
  'Ilan',
  'Layl',
  'Lev',
  'Noor',
  'Nur',
  'Omer',
  'Ori',
  'Rami',
  'Raz',
  'Reem',
  'Samir',
  'Sari',
  'Shir',
  'Tal',
  'Tali',
  'Tamir',
  'Yael',
  'Yam',
  'Ziv',
  'Zuri',
  'Ade',
  'Amara',
  'Ayo',
  'Bayo',
  'Chibu',
  'Dami',
  'Ezi',
  'Femi',
  'Ife',
  'Imani',
  'Jomo',
  'Kemi',
  'Kofi',
  'Kwame',
  'Lebo',
  'Nia',
  'Obi',
  'Sade',
  'Seun',
  'Taiwo',
  'Temi',
  'Tobi',
  'Wole',
  'Zola',
  'Ash',
  'Blair',
  'Blake',
  'Cree',
  'Drew',
  'Ellis',
  'Emil',
  'Evan',
  'Fern',
  'Finn',
  'Flynn',
  'Gray',
  'Ira',
  'Jan',
  'Lane',
  'Luca',
  'Lumi',
  'Nik',
  'Page',
  'Perry',
  'Quinn',
  'Remy',
  'Robin',
  'Rowan',
  'Sasha',
  'Alexo',
  'Amor',
  'Cayo',
  'Cruz',
  'Dali',
  'Flor',
  'Ines',
  'Inti',
  'Koa',
  'Leal',
  'Lena',
  'Lian',
  'Lior',
  'Luz',
  'Mar',
  'Nati',
  'Niko',
  'Nova',
  'Paz',
  'Pico',
  'Rio',
  'Rory',
  'Sage',
  'Yara',
  'Hemi',
  'Hina',
  'Io',
  'Kai',
  'Kale',
  'Kali',
  'Lani',
  'Lono',
  'Mako',
  'Mana',
  'Maui',
  'Noa',
  'Pono',
  'Raka',
  'Rangi',
  'Tama',
  'Tane',
  'Tui',
  'Uku',
  'Wai',
  'Wiki',
  'Wiremu',
  'Wren',
  'Zane',
  'Zephyr',
];
const pick = () => NAMES[Math.floor(Math.random() * NAMES.length)];
const randomName = (prefix) => {
  let a = pick(),
    b = pick();
  while (b === a) b = pick();
  return `${prefix} ${a} ${b}`;
};

// ── Initial Frame (module-level so id is stable across renders) ──
const AB_DEFAULTS = {
  bg: '#ffffff',
  borderRadius: 8,
  borderWidth: 0,
  borderColor: '#000000',
  opacity: 1,
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: 12,
  padding: 0,
  flexWrap: 'nowrap',
  overflow: 'visible',
};

const _initAb = (() => {
  const id = uid();
  return {
    id,
    name: 'Frame 1',
    width: 800,
    height: 600,
    x: 0,
    y: 0,
    children: [],
    ...AB_DEFAULTS,
  };
})();

// ── Default element factories ──
const createRect = (parent = null, extras = {}) => ({
  id: uid(),
  type: 'rect',
  parent,
  label: randomName('Box'),
  x: 0,
  y: 0,
  width: 120,
  height: 80,
  bg: '#2563eb',
  borderRadius: 8,
  borderWidth: 0,
  borderColor: '#000',
  opacity: 1,
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: 0,
  padding: 0,
  flexWrap: 'nowrap',
  overflow: 'visible',
  flexGrow: 0,
  flexShrink: 1,
  alignSelf: 'auto',
  children: [],
  ...extras,
});

const createText = (parent = null, extras = {}) => ({
  id: uid(),
  type: 'text',
  parent,
  label: randomName('Text'),
  x: 0,
  y: 0,
  content: 'Text',
  fontSize: 16,
  fontWeight: '400',
  color: '#64748b',
  fontFamily: "'Inter', sans-serif",
  textAlign: 'left',
  lineHeight: 1.4,
  letterSpacing: 0,
  position: 'relative',
  flexGrow: 0,
  flexShrink: 1,
  alignSelf: 'auto',
  width: 'auto',
  height: 'auto',
  opacity: 1,
  ...extras,
});

const createIcon = (parent = null, extras = {}) => ({
  id: uid(),
  type: 'icon',
  parent,
  label: randomName('Icon'),
  x: 0,
  y: 0,
  iconName: 'star',
  iconSize: 24,
  color: '#64748b',
  position: 'relative',
  flexGrow: 0,
  flexShrink: 1,
  alignSelf: 'auto',
  opacity: 1,
  ...extras,
});

const PALETTE = [
  ['#000', '#fff', '#ffffff00'],
  ['#fecaca', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#7f1d1d'],
  ['#fed7aa', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#7c2d12'],
  ['#bbf7d0', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#14532d'],
  ['#a5f3fc', '#22d3ee', '#06b6d4', '#0891b2', '#0e7490', '#164e63'],
  ['#bfdbfe', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e3a8a'],
  ['#e9d5ff', '#c084fc', '#a855f7', '#9333ea', '#7e22ce', '#581c87'],
  ['#fbcfe8', '#f472b6', '#ec4899', '#db2777', '#be185d', '#831843'],
  ['#e2e8f0', '#94a3b8', '#64748b', '#475569', '#334155', '#0f172a'],
];

// ── Palette-aware color helpers ──
const hexLuminance = (hex) => {
  try {
    const h = hex.replace('#', '');
    const full =
      h.length === 3
        ? h
            .split('')
            .map((c) => c + c)
            .join('')
        : h;
    const [r, g, b] = [0, 2, 4].map(
      (i) => parseInt(full.slice(i, i + 2), 16) / 255,
    );
    const toLinear = (c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  } catch {
    return 1;
  }
};
const contrastColorFor = (bgHex) => {
  try {
    return hexLuminance(bgHex) > 0.179 ? '#1e293b' : '#f8fafc';
  } catch {
    return '#1e293b';
  }
};

// ── Theme definitions ──
// Each theme is a flat object of CSS custom properties.
// Add custom themes by extending THEMES with the same token structure.
export const THEMES = {
  light: {
    name: 'Light',
    '--bg': '#f2f2f7',
    '--bg-panel': '#ffffff',
    '--bg-header': '#f7f7fc',
    '--bg-input': '#f0f0f8',
    '--bg-artboard': '#ffffff',
    '--bg-group': '#e8e8f2',
    '--border': '#dddde8',
    '--border-input': '#c8c8d8',
    '--text': '#1a1a2a',
    '--text-muted': '#5a5a70',
    '--text-dim': '#8888a0',
    '--accent': '#6366f1',
    '--accent-light': '#6366f1',
    '--accent-selected': 'rgba(99,102,241,0.12)',
    '--accent-selected-text': '#4b4de0',
    '--btn-delete-bg': '#fef2f2',
    '--btn-delete-border': '#fca5a5',
    '--btn-dup-bg': '#f0fdf4',
    '--btn-dup-border': '#86efac',
    '--grid': 'rgba(0,0,0,0.05)',
    '--tooltip-bg': 'rgba(248,248,252,0.95)',
    '--tooltip-border': '#dddde8',
    '--tooltip-text': '#6a6a80',
    '--tooltip-bold': '#4a4a60',
    '--ab-label': '#9090a8',
    '--ab-label-active': '#6366f1',
    '--ab-border': '#dddde8',
    '--ab-border-active': '#8183f4',
    '--ab-shadow': '0 10px 40px rgba(0,0,0,0.08)',
    '--ab-shadow-active': '0 20px 60px rgba(0,0,0,0.14)',
  },
  dark: {
    name: 'Dark',
    '--bg': '#0d0d15',
    '--bg-panel': '#14141e',
    '--bg-header': '#18182a',
    '--bg-input': '#1e1e2e',
    '--bg-artboard': '#1a1a2e',
    '--bg-group': '#1a1a2a',
    '--border': '#2a2a3a',
    '--border-input': '#3a3a4a',
    '--text': '#e0e0e0',
    '--text-muted': '#aaaaaa',
    '--text-dim': '#666666',
    '--accent': '#6366f1',
    '--accent-light': '#a5a5ff',
    '--accent-selected': 'rgba(99,102,241,0.2)',
    '--accent-selected-text': '#c7c7ff',
    '--btn-delete-bg': '#3a2a2a',
    '--btn-delete-border': '#5a3a3a',
    '--btn-dup-bg': '#2a3a2e',
    '--btn-dup-border': '#3a5a3e',
    '--grid': 'rgba(255,255,255,0.04)',
    '--tooltip-bg': 'rgba(20,20,30,0.85)',
    '--tooltip-border': '#2a2a3a',
    '--tooltip-text': '#666666',
    '--tooltip-bold': '#888888',
    '--ab-label': '#555555',
    '--ab-label-active': '#a5a5ff',
    '--ab-border': '#2a2a3a',
    '--ab-border-active': '#3a3a5a',
    '--ab-shadow': '0 10px 40px rgba(0,0,0,0.3)',
    '--ab-shadow-active': '0 20px 60px rgba(0,0,0,0.5)',
  },
  // ── Example custom theme ──
  // ocean: {
  //   name: "Ocean",
  //   "--bg": "#0a1628",
  //   "--bg-panel": "#0f2040",
  //   "--bg-header": "#0d1a33",
  //   "--bg-input": "#142850",
  //   "--bg-artboard": "#0f2040",
  //   "--bg-group": "#0d1e3a",
  //   "--border": "#1a3a5c",
  //   "--border-input": "#1e4a70",
  //   "--text": "#cce8ff",
  //   "--text-muted": "#7fb0d8",
  //   "--text-dim": "#4a7a9b",
  //   "--accent": "#00b4d8",
  //   "--accent-light": "#90e0ef",
  //   "--accent-selected": "rgba(0,180,216,0.2)",
  //   "--accent-selected-text": "#90e0ef",
  //   "--btn-delete-bg": "#2a1020",
  //   "--btn-delete-border": "#5a2030",
  //   "--btn-dup-bg": "#0a2a20",
  //   "--btn-dup-border": "#1a5a3a",
  //   "--grid": "rgba(0,180,216,0.05)",
  //   "--tooltip-bg": "rgba(10,22,40,0.9)",
  //   "--tooltip-border": "#1a3a5c",
  //   "--tooltip-text": "#4a7a9b",
  //   "--tooltip-bold": "#7fb0d8",
  //   "--ab-label": "#2a5a7a",
  //   "--ab-label-active": "#00b4d8",
  //   "--ab-border": "#1a3a5c",
  //   "--ab-border-active": "#00b4d8",
  //   "--ab-shadow": "0 10px 40px rgba(0,0,0,0.4)",
  //   "--ab-shadow-active": "0 20px 60px rgba(0,180,216,0.15)",
  // },
};

// ── Tiny color input ──
const ColorInput = ({ value, onChange, label }) => {
  const [open, setOpen] = useState(false);
  const [palettePos, setPalettePos] = useState({
    top: 0,
    left: null,
    right: null,
  });
  const ref = useRef(null);
  const paletteRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        ref.current?.contains(e.target) ||
        paletteRef.current?.contains(e.target)
      )
        return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);
  const handleOpen = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const nearRight = rect.left > window.innerWidth / 2;
      setPalettePos({
        top: rect.bottom + 4,
        left: nearRight ? null : rect.left,
        right: nearRight ? window.innerWidth - rect.right : null,
      });
    }
    setOpen((o) => !o);
  };
  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        position: 'relative',
      }}
    >
      <div
        onClick={handleOpen}
        style={{
          width: 32,
          height: 22,
          borderRadius: 4,
          border: '1px solid var(--border-input)',
          cursor: 'pointer',
          flexShrink: 0,
          background:
            value === '#ffffff00'
              ? 'linear-gradient(to top right, transparent calc(50% - 1px), red calc(50% - 1px), red calc(50% + 1px), transparent calc(50% + 1px)), #fff'
              : value,
        }}
      />
      {label && (
        <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{label}</span>
      )}
      {open &&
        createPortal(
          <div
            ref={paletteRef}
            style={{
              position: 'fixed',
              top: palettePos.top,
              ...(palettePos.left !== null
                ? { left: palettePos.left }
                : { right: palettePos.right }),
              zIndex: 9999,
              background: 'var(--bg-input)',
              border: '1px solid var(--border-input)',
              borderRadius: 8,
              padding: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            }}
          >
            {PALETTE.map((row, ri) => (
              <div key={ri} style={{ display: 'flex', gap: 2 }}>
                {row.map((color) => {
                  const isTransparent = color === '#ffffff00';
                  return (
                    <div
                      key={color}
                      onClick={() => {
                        onChange(color);
                        setOpen(false);
                      }}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 3,
                        cursor: 'pointer',
                        border:
                          color === value
                            ? '2px solid var(--accent)'
                            : '1px solid var(--border-input)',
                        boxSizing: 'border-box',
                        background: isTransparent
                          ? 'linear-gradient(to top right, transparent calc(50% - 1px), red calc(50% - 1px), red calc(50% + 1px), transparent calc(50% + 1px)), #fff'
                          : color,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
};

const NumInput = ({
  value,
  onChange,
  label,
  min,
  max,
  step = 1,
  unit = '',
  disabled = false,
}) => (
  <label
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      fontSize: 11,
      color: 'var(--text-dim)',
    }}
  >
    {label}
    <input
      type='number'
      value={value}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      style={{
        width: '100%',
        background: 'var(--bg-input)',
        border: '1px solid var(--border-input)',
        borderRadius: 4,
        color: disabled ? 'var(--text-dim)' : 'var(--text)',
        padding: '4px 6px',
        fontSize: 12,
        outline: 'none',
        opacity: disabled ? 0.5 : 1,
      }}
    />
  </label>
);

const SelectInput = ({ value, onChange, label, options }) => (
  <label
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      fontSize: 11,
      color: 'var(--text-dim)',
    }}
  >
    {label}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        background: 'var(--bg-input)',
        border: '1px solid var(--border-input)',
        borderRadius: 4,
        color: 'var(--text)',
        padding: '4px 6px',
        fontSize: 12,
        outline: 'none',
      }}
    >
      {options.map((o) => (
        <option
          key={typeof o === 'string' ? o : o.value}
          value={typeof o === 'string' ? o : o.value}
        >
          {typeof o === 'string' ? o : o.label}
        </option>
      ))}
    </select>
  </label>
);

// ── Toggle button group ──
const BtnGroup = ({ options, value, onChange, label }) => (
  <label
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      fontSize: 11,
      color: 'var(--text-dim)',
    }}
  >
    {label}
    <div
      style={{
        display: 'flex',
        gap: 1,
        background: 'var(--bg-group)',
        borderRadius: 5,
        padding: 2,
      }}
    >
      {options.map((o) => {
        const val = typeof o === 'string' ? o : o.value;
        const lbl = typeof o === 'string' ? o : o.label;
        const active = value === val;
        return (
          <button
            key={val}
            onClick={() => onChange(val)}
            style={{
              flex: 1,
              padding: '3px 4px',
              fontSize: 10,
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontWeight: active ? 600 : 400,
              background: active ? 'var(--accent)' : 'transparent',
              color: active ? '#fff' : 'var(--text-dim)',
              transition: 'all 0.15s',
            }}
          >
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
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: '8px 12px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        {title}
        <ChevronRight
          size={10}
          style={{
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s',
          }}
        />
      </div>
      {open && <div style={{ padding: '4px 12px 12px' }}>{children}</div>}
    </div>
  );
};

// ── Variable type badge colors ──
const VAR_TYPE_COLORS = {
  number: '#3b82f6',
  string: '#22c55e',
  boolean: '#f59e0b',
  object: '#a855f7',
  array: '#ec4899',
};
const TYPE_DEFAULTS = {
  number: 0,
  string: '',
  boolean: false,
  object: {},
  array: [],
};

// ── JSON textarea editor for object/array variables ──
const JsonEditor = ({ variable, onChange }) => {
  const [draft, setDraft] = useState(() =>
    JSON.stringify(variable.value, null, 2),
  );
  const [error, setError] = useState(null);
  useEffect(() => {
    setDraft(JSON.stringify(variable.value, null, 2));
    setError(null);
  }, [variable.value]);
  const commit = () => {
    try {
      const parsed = JSON.parse(draft);
      const isArray = Array.isArray(parsed);
      if (variable.type === 'array' && !isArray) {
        setError('Expected array');
        return;
      }
      if (
        variable.type === 'object' &&
        (isArray || typeof parsed !== 'object')
      ) {
        setError('Expected object');
        return;
      }
      setError(null);
      onChange(parsed);
    } catch {
      setError('Invalid JSON');
    }
  };
  return (
    <div>
      <textarea
        value={draft}
        rows={4}
        onChange={(e) => {
          setDraft(e.target.value);
          setError(null);
        }}
        onBlur={commit}
        style={{
          width: '100%',
          background: 'var(--bg-input)',
          border: `1px solid ${error ? '#ef4444' : 'var(--border-input)'}`,
          borderRadius: 4,
          color: 'var(--text)',
          padding: '4px 6px',
          fontSize: 11,
          resize: 'vertical',
          outline: 'none',
          fontFamily: 'monospace',
          boxSizing: 'border-box',
        }}
      />
      {error && (
        <div style={{ fontSize: 10, color: '#ef4444', marginTop: 2 }}>
          {error}
        </div>
      )}
    </div>
  );
};

// ── Type-appropriate value editor for variables ──
const VariableValueEditor = ({ variable, onChange }) => {
  const base = {
    width: '100%',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-input)',
    borderRadius: 4,
    color: 'var(--text)',
    padding: '4px 6px',
    fontSize: 12,
    outline: 'none',
    boxSizing: 'border-box',
  };
  switch (variable.type) {
    case 'number':
      return (
        <input
          type='number'
          value={variable.value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          style={base}
        />
      );
    case 'string':
      return (
        <input
          type='text'
          value={variable.value}
          onChange={(e) => onChange(e.target.value)}
          style={base}
        />
      );
    case 'boolean':
      return (
        <div
          style={{
            display: 'flex',
            gap: 1,
            background: 'var(--bg-group)',
            borderRadius: 5,
            padding: 2,
          }}
        >
          {[true, false].map((bool) => (
            <button
              key={String(bool)}
              onClick={() => onChange(bool)}
              style={{
                flex: 1,
                padding: '3px 4px',
                fontSize: 10,
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontWeight: variable.value === bool ? 600 : 400,
                background:
                  variable.value === bool ? 'var(--accent)' : 'transparent',
                color: variable.value === bool ? '#fff' : 'var(--text-dim)',
                transition: 'all 0.15s',
              }}
            >
              {bool ? 'true' : 'false'}
            </button>
          ))}
        </div>
      );
    case 'object':
    case 'array':
      return <JsonEditor variable={variable} onChange={onChange} />;
    default:
      return null;
  }
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
  const [dropPos, setDropPos] = useState(null); // { targetId, pos: 'before'|'after'|'into' }
  const [dndDraggingId, setDndDraggingId] = useState(null);
  const dropPosRef = useRef(null);
  dropPosRef.current = dropPos;
  const canvasRef = useRef(null);
  const createRectColored = (parent, extras = {}) => createRect(parent, extras);

  // ── Theme ──
  const themeKeys = Object.keys(THEMES);
  const [themeKey, setThemeKey] = useState('light');
  const theme = THEMES[themeKey] ?? THEMES.light;
  const themeVars = Object.fromEntries(
    Object.entries(theme).filter(([k]) => k.startsWith('--')),
  );
  const cycleTheme = () => {
    const idx = themeKeys.indexOf(themeKey);
    setThemeKey(themeKeys[(idx + 1) % themeKeys.length]);
  };

  // ── Variable canvases ──
  const [varCanvases, setVarCanvases] = useState([]);
  const [draggingVarCanvas, setDraggingVarCanvas] = useState(null);
  const [editingVar, setEditingVar] = useState(null); // { canvasId, varId }
  const [varNewType, setVarNewType] = useState({}); // { [canvasId]: type }

  useEffect(() => {
    try {
      const saved = localStorage.getItem('rfd_varCanvases');
      if (saved) {
        const p = JSON.parse(saved);
        if (Array.isArray(p)) setVarCanvases(p);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem('rfd_varCanvases', JSON.stringify(varCanvases));
      } catch {}
    }, 300);
    return () => clearTimeout(t);
  }, [varCanvases]);

  // ── Undo / Redo ──
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  const [editingLayerName, setEditingLayerName] = useState(null); // { id, value }
  const [childInsertMode, setChildInsertMode] = useState(null); // null | "first-child" | "last-child"
  const childInsertModeRef = useRef(null);
  childInsertModeRef.current = childInsertMode;
  const editingLayerNameRef = useRef(null);
  const artboardsRef = useRef(artboards);
  const elementsRef = useRef(elements);
  artboardsRef.current = artboards;
  elementsRef.current = elements;

  const historyRef = useRef({ past: [], future: [] });
  const propChangeSnapRef = useRef(null);
  const propChangeTimerRef = useRef(null);
  const dragSnapRef = useRef(null);
  const clipboardRef = useRef(null);

  const getSnapshot = useCallback(
    () => ({
      artboards: JSON.parse(JSON.stringify(artboardsRef.current)),
      elements: JSON.parse(JSON.stringify(elementsRef.current)),
    }),
    [],
  );

  const pushToHistory = useCallback((snap) => {
    const h = historyRef.current;
    h.past = [...h.past.slice(-49), snap];
    h.future = [];
    setCanUndo(true);
    setCanRedo(false);
  }, []);

  // Debounced: captures state before first change in a burst, pushes after 500ms quiet
  const recordChange = useCallback(() => {
    if (!propChangeSnapRef.current) {
      propChangeSnapRef.current = getSnapshot();
    }
    clearTimeout(propChangeTimerRef.current);
    propChangeTimerRef.current = setTimeout(() => {
      if (propChangeSnapRef.current) {
        pushToHistory(propChangeSnapRef.current);
        propChangeSnapRef.current = null;
      }
    }, 500);
  }, [getSnapshot, pushToHistory]);

  const undo = useCallback(() => {
    clearTimeout(propChangeTimerRef.current);
    propChangeSnapRef.current = null;
    const h = historyRef.current;
    if (!h.past.length) return;
    const current = getSnapshot();
    const prev = h.past[h.past.length - 1];
    h.past = h.past.slice(0, -1);
    h.future = [current, ...h.future.slice(0, 49)];
    setArtboards(prev.artboards);
    setElements(prev.elements);
    setSelectedIds(new Set());
    setCanUndo(h.past.length > 0);
    setCanRedo(true);
  }, [getSnapshot]);

  const redo = useCallback(() => {
    clearTimeout(propChangeTimerRef.current);
    propChangeSnapRef.current = null;
    const h = historyRef.current;
    if (!h.future.length) return;
    const current = getSnapshot();
    const next = h.future[0];
    h.future = h.future.slice(1);
    h.past = [...h.past.slice(-49), current];
    setArtboards(next.artboards);
    setElements(next.elements);
    setSelectedIds(new Set());
    setCanUndo(true);
    setCanRedo(h.future.length > 0);
  }, [getSnapshot]);

  // ── Variable Canvas CRUD ──
  const addVarCanvas = useCallback(() => {
    const lastAb = artboardsRef.current[artboardsRef.current.length - 1];
    const vc = {
      id: uid(),
      name: `Variables ${varCanvases.length + 1}`,
      x: lastAb ? lastAb.x + lastAb.width + 80 : 100,
      y: 0,
      variables: [],
    };
    setVarCanvases((prev) => [...prev, vc]);
  }, [varCanvases.length]);

  const updateVarCanvas = useCallback((id, patch) => {
    setVarCanvases((prev) =>
      prev.map((vc) => (vc.id === id ? { ...vc, ...patch } : vc)),
    );
  }, []);

  const deleteVarCanvas = useCallback((id) => {
    setVarCanvases((prev) => prev.filter((vc) => vc.id !== id));
    setEditingVar((prev) => (prev?.canvasId === id ? null : prev));
  }, []);

  const addVarToCanvas = useCallback((canvasId, type = 'string') => {
    const v = {
      id: uid(),
      name: `var${Date.now()}`,
      type,
      value: TYPE_DEFAULTS[type],
      description: '',
    };
    setVarCanvases((prev) =>
      prev.map((vc) =>
        vc.id === canvasId ? { ...vc, variables: [...vc.variables, v] } : vc,
      ),
    );
    setEditingVar({ canvasId, varId: v.id });
  }, []);

  const updateVarInCanvas = useCallback((canvasId, varId, patch) => {
    setVarCanvases((prev) =>
      prev.map((vc) =>
        vc.id !== canvasId
          ? vc
          : {
              ...vc,
              variables: vc.variables.map((v) =>
                v.id === varId ? { ...v, ...patch } : v,
              ),
            },
      ),
    );
  }, []);

  const deleteVarFromCanvas = useCallback((canvasId, varId) => {
    setVarCanvases((prev) =>
      prev.map((vc) =>
        vc.id !== canvasId
          ? vc
          : { ...vc, variables: vc.variables.filter((v) => v.id !== varId) },
      ),
    );
    setEditingVar((prev) => (prev?.varId === varId ? null : prev));
  }, []);

  // ── Artboard CRUD ──
  const updateArtboard = useCallback((id, patch) => {
    setArtboards((prev) =>
      prev.map((ab) => (ab.id === id ? { ...ab, ...patch } : ab)),
    );
  }, []);

  const addArtboard = useCallback(() => {
    pushToHistory(getSnapshot());
    setArtboards((prev) => {
      const lastAb = prev[prev.length - 1];
      const newAb = {
        id: uid(),
        name: `Frame ${prev.length + 1}`,
        width: 800,
        height: 600,
        x: lastAb.x + lastAb.width + 80,
        y: 0,
        children: [],
        ...AB_DEFAULTS,
      };
      setActiveArtboardId(newAb.id);
      return [...prev, newAb];
    });
    setSelectedIds(new Set());
  }, [getSnapshot, pushToHistory]);

  // ── Element CRUD ──
  const updateEl = useCallback((id, patch) => {
    setElements((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }, []);

  const addElement = useCallback(
    (factory, parentId = null, insertMode = null) => {
      pushToHistory(getSnapshot());

      const selectedId = selectedIds.size === 1 ? [...selectedIds][0] : null;
      const selectedEl = selectedId ? elements[selectedId] : null;

      // Child insert modes: use the selected element itself as parent
      if (insertMode === 'first-child' || insertMode === 'last-child') {
        if (!selectedId) {
          // No selection — fall back to normal sibling insertion
        } else {
          const effectiveParentId = selectedId;
          const parentBg = elements[effectiveParentId]?.bg ?? '#ffffff';
          let el = factory(effectiveParentId);
          if (el.type === 'rect') {
            el = { ...el, bg: parentBg === '#e2e8f0' ? '#94a3b8' : '#e2e8f0' };
          } else if (el.type === 'text' || el.type === 'icon') {
            el = { ...el, color: contrastColorFor(parentBg) };
          }
          setElements((prev) => {
            const parent = prev[effectiveParentId];
            if (!parent) return { ...prev, [el.id]: el };
            const children = parent.children || [];
            const next =
              insertMode === 'first-child'
                ? [el.id, ...children]
                : [...children, el.id];
            return {
              ...prev,
              [el.id]: el,
              [effectiveParentId]: { ...parent, children: next },
            };
          });
          setSelectedIds(new Set([el.id]));
          return;
        }
      }

      // Default sibling insertion
      const effectiveParentId = parentId ?? (selectedEl?.parent || null);
      const parentBg = effectiveParentId
        ? (elements[effectiveParentId]?.bg ?? '#ffffff')
        : (artboards.find((ab) => ab.id === activeArtboardId)?.bg ?? '#ffffff');
      let el = factory(effectiveParentId);
      if (el.type === 'rect') {
        el = { ...el, bg: parentBg === '#e2e8f0' ? '#94a3b8' : '#e2e8f0' };
      } else if (el.type === 'text' || el.type === 'icon') {
        el = { ...el, color: contrastColorFor(parentBg) };
      }
      setElements((prev) => ({ ...prev, [el.id]: el }));

      if (effectiveParentId) {
        setElements((prev) => {
          const parent = prev[effectiveParentId];
          const children = parent.children || [];
          // Insert after selected element if it's a direct child of this parent
          if (!parentId && selectedEl?.parent === effectiveParentId) {
            const idx = children.indexOf(selectedId);
            const next = [...children];
            next.splice(idx + 1, 0, el.id);
            return {
              ...prev,
              [effectiveParentId]: { ...parent, children: next },
            };
          }
          return {
            ...prev,
            [effectiveParentId]: { ...parent, children: [...children, el.id] },
          };
        });
      } else {
        setArtboards((prev) =>
          prev.map((ab) => {
            if (ab.id !== activeArtboardId) return ab;
            if (
              selectedEl &&
              !selectedEl.parent &&
              ab.children.includes(selectedId)
            ) {
              const idx = ab.children.indexOf(selectedId);
              const next = [...ab.children];
              next.splice(idx + 1, 0, el.id);
              return { ...ab, children: next };
            }
            return { ...ab, children: [...ab.children, el.id] };
          }),
        );
      }
      setSelectedIds(new Set([el.id]));
      console.log({ artboards, elements });
    },
    [activeArtboardId, elements, selectedIds, getSnapshot, pushToHistory],
  );

  // ── Batch delete / duplicate for multi-select ──
  const deleteSelected = useCallback(() => {
    if (selectedIds.size === 0) return;
    pushToHistory(getSnapshot());
    const ids = [...selectedIds];
    const toRemove = new Set();
    const gather = (eid) => {
      if (toRemove.has(eid)) return;
      toRemove.add(eid);
      const e = elements[eid];
      if (e?.children) e.children.forEach((c) => gather(c));
    };
    ids.forEach((id) => gather(id));
    // Remove from parent elements (only if parent is not itself being removed)
    ids.forEach((id) => {
      const el = elements[id];
      if (el?.parent && !toRemove.has(el.parent)) {
        setElements((prev) => ({
          ...prev,
          [el.parent]: {
            ...prev[el.parent],
            children: (prev[el.parent]?.children || []).filter(
              (c) => !toRemove.has(c),
            ),
          },
        }));
      }
    });
    setArtboards((prev) =>
      prev.map((ab) => ({
        ...ab,
        children: ab.children.filter((c) => !toRemove.has(c)),
      })),
    );
    setElements((prev) => {
      const next = { ...prev };
      toRemove.forEach((r) => delete next[r]);
      return next;
    });
    setSelectedIds(new Set());
  }, [elements, selectedIds, getSnapshot, pushToHistory]);

  const duplicateSelected = useCallback(() => {
    if (selectedIds.size === 0) return;
    pushToHistory(getSnapshot());
    const newIds = [];
    [...selectedIds].forEach((id) => {
      const el = elements[id];
      if (!el) return;
      const newId = uid();
      const cloned = {
        ...el,
        id: newId,
        label: el.label + ' copy',
        children: [],
      };
      setElements((prev) => ({ ...prev, [newId]: cloned }));
      if (el.parent) {
        setElements((prev) => ({
          ...prev,
          [el.parent]: {
            ...prev[el.parent],
            children: [...prev[el.parent].children, newId],
          },
        }));
      } else {
        setArtboards((prev) =>
          prev.map((ab) => ({
            ...ab,
            children: ab.children.includes(id)
              ? [...ab.children, newId]
              : ab.children,
          })),
        );
      }
      newIds.push(newId);
    });
    setSelectedIds(new Set(newIds));
  }, [elements, selectedIds, getSnapshot, pushToHistory]);

  // ── Cut / Copy / Paste ──
  const copySelected = useCallback(() => {
    if (selectedIds.size === 0) return;
    const elMap = {};
    const collect = (id) => {
      const el = elementsRef.current[id];
      if (!el) return;
      elMap[id] = JSON.parse(JSON.stringify(el));
      (el.children || []).forEach(collect);
    };
    [...selectedIds].forEach(collect);
    clipboardRef.current = {
      roots: [...selectedIds].filter((id) => elementsRef.current[id]),
      elements: elMap,
    };
  }, [selectedIds]);

  const cutSelected = useCallback(() => {
    if (selectedIds.size === 0) return;
    const elMap = {};
    const collect = (id) => {
      const el = elementsRef.current[id];
      if (!el) return;
      elMap[id] = JSON.parse(JSON.stringify(el));
      (el.children || []).forEach(collect);
    };
    [...selectedIds].forEach(collect);
    clipboardRef.current = {
      roots: [...selectedIds].filter((id) => elementsRef.current[id]),
      elements: elMap,
    };
    deleteSelected();
  }, [selectedIds, deleteSelected]);

  const pasteClipboard = useCallback(() => {
    const cb = clipboardRef.current;
    if (!cb || cb.roots.length === 0) return;
    pushToHistory(getSnapshot());
    const idMap = {};
    Object.keys(cb.elements).forEach((id) => {
      idMap[id] = uid();
    });
    const newEls = {};
    Object.entries(cb.elements).forEach(([oldId, el]) => {
      const newId = idMap[oldId];
      const isRoot = cb.roots.includes(oldId);
      newEls[newId] = {
        ...el,
        id: newId,
        label: isRoot ? el.label + ' copy' : el.label,
        parent: el.parent && idMap[el.parent] ? idMap[el.parent] : null,
        children: (el.children || []).map((c) => idMap[c] || c),
      };
    });
    setElements((prev) => ({ ...prev, ...newEls }));
    const newRootIds = cb.roots.map((id) => idMap[id]);
    setArtboards((prev) =>
      prev.map((ab) =>
        ab.id === activeArtboardId
          ? { ...ab, children: [...ab.children, ...newRootIds] }
          : ab,
      ),
    );
    setSelectedIds(new Set(newRootIds));
  }, [activeArtboardId, getSnapshot, pushToHistory]);

  // ── Reorder / reparent via drag-and-drop ──
  const moveElement = useCallback(
    (dragId, targetId, pos) => {
      if (dragId === targetId) return;
      const dragEl = elementsRef.current[dragId];
      const targetEl = elementsRef.current[targetId];
      if (!dragEl) return;

      pushToHistory(getSnapshot());

      if (pos === 'into') {
        if (!targetEl || targetEl.type !== 'rect') return;
        // Remove from old location
        if (dragEl.parent) {
          setElements((prev) => ({
            ...prev,
            [dragEl.parent]: {
              ...prev[dragEl.parent],
              children: prev[dragEl.parent].children.filter(
                (c) => c !== dragId,
              ),
            },
          }));
        } else {
          setArtboards((prev) =>
            prev.map((ab) => ({
              ...ab,
              children: ab.children.filter((c) => c !== dragId),
            })),
          );
        }
        // Add as last child of target
        setElements((prev) => ({
          ...prev,
          [dragId]: { ...prev[dragId], parent: targetId },
          [targetId]: {
            ...prev[targetId],
            children: [
              ...(prev[targetId].children || []).filter((c) => c !== dragId),
              dragId,
            ],
          },
        }));
      } else {
        // 'before' or 'after' — reorder / reparent relative to target
        if (!targetEl) return;
        const newParent = targetEl.parent; // null = artboard root

        // Remove dragId from its current location
        if (dragEl.parent) {
          setElements((prev) => ({
            ...prev,
            [dragEl.parent]: {
              ...prev[dragEl.parent],
              children: prev[dragEl.parent].children.filter(
                (c) => c !== dragId,
              ),
            },
          }));
        } else {
          setArtboards((prev) =>
            prev.map((ab) => ({
              ...ab,
              children: ab.children.filter((c) => c !== dragId),
            })),
          );
        }

        // Update dragId's parent field if it changed
        if (dragEl.parent !== newParent) {
          setElements((prev) => ({
            ...prev,
            [dragId]: { ...prev[dragId], parent: newParent },
          }));
        }

        // Insert at new location
        if (newParent) {
          setElements((prev) => {
            const parentEl = prev[newParent];
            const kids = (parentEl.children || []).filter((c) => c !== dragId);
            const idx = kids.indexOf(targetId);
            if (idx === -1) return prev;
            const i = pos === 'before' ? idx : idx + 1;
            return {
              ...prev,
              [newParent]: {
                ...parentEl,
                children: [...kids.slice(0, i), dragId, ...kids.slice(i)],
              },
            };
          });
        } else {
          setArtboards((prev) =>
            prev.map((ab) => {
              if (!ab.children.includes(targetId)) return ab;
              const kids = ab.children.filter((c) => c !== dragId);
              const idx = kids.indexOf(targetId);
              if (idx === -1) return ab;
              const i = pos === 'before' ? idx : idx + 1;
              return {
                ...ab,
                children: [...kids.slice(0, i), dragId, ...kids.slice(i)],
              };
            }),
          );
        }
      }
    },
    [getSnapshot, pushToHistory],
  );

  // ── Drag (absolute positioned elements) ──
  const onMouseDown = useCallback(
    (e, id) => {
      e.stopPropagation();
      const el = elements[id];
      if (el.position === 'absolute') {
        dragSnapRef.current = getSnapshot();
        setDragging({
          id,
          startX: e.clientX,
          startY: e.clientY,
          origX: el.x || 0,
          origY: el.y || 0,
        });
      }
      if (e.shiftKey || e.metaKey || e.ctrlKey) {
        setSelectedIds((prev) => {
          if (prev.size === 0) return new Set([id]);
          // Find artboard of an element by walking up to root and checking artboards
          const getAb = (eid) => {
            let cur = elements[eid];
            while (cur?.parent) cur = elements[cur.parent];
            if (!cur) return null;
            return (
              artboards.find((ab) => ab.children.includes(cur.id))?.id ?? null
            );
          };
          if (getAb([...prev][0]) !== getAb(id)) return new Set([id]);
          const next = new Set(prev);
          next.has(id) ? next.delete(id) : next.add(id);
          return next.size > 0 ? next : new Set([id]);
        });
      } else {
        setSelectedIds(new Set([id]));
      }
    },
    [elements, artboards, getSnapshot],
  );

  // ── Resize ──
  const onResizeStart = useCallback(
    (e, id, handle) => {
      e.stopPropagation();
      e.preventDefault();
      dragSnapRef.current = getSnapshot();
      const el = elements[id];
      const domRect = e.currentTarget.parentElement.getBoundingClientRect();
      const actualW = domRect.width / zoom;
      const actualH = domRect.height / zoom;
      setResizing({
        id,
        handle,
        startX: e.clientX,
        startY: e.clientY,
        origW: typeof el.width === 'number' ? el.width : actualW,
        origH: typeof el.height === 'number' ? el.height : actualH,
        origX: el.x || 0,
        origY: el.y || 0,
      });
    },
    [elements, getSnapshot, zoom],
  );

  useEffect(() => {
    const onMove = (e) => {
      if (dragging) {
        const dx = (e.clientX - dragging.startX) / zoom;
        const dy = (e.clientY - dragging.startY) / zoom;
        updateEl(dragging.id, {
          x: Math.round(dragging.origX + dx),
          y: Math.round(dragging.origY + dy),
        });
      }
      if (resizing) {
        const dx = (e.clientX - resizing.startX) / zoom;
        const dy = (e.clientY - resizing.startY) / zoom;
        const h = resizing.handle;
        let x = resizing.origX,
          y = resizing.origY;
        const patch = { x: Math.round(x), y: Math.round(y) };
        if (h.includes('e'))
          patch.width = Math.round(Math.max(20, resizing.origW + dx));
        if (h.includes('w')) {
          patch.width = Math.round(Math.max(20, resizing.origW - dx));
          patch.x = Math.round(resizing.origX + dx);
        }
        if (h.includes('s'))
          patch.height = Math.round(Math.max(20, resizing.origH + dy));
        if (h.includes('n')) {
          patch.height = Math.round(Math.max(20, resizing.origH - dy));
          patch.y = Math.round(resizing.origY + dy);
        }
        updateEl(resizing.id, patch);
      }
      if (draggingArtboard) {
        const dx = (e.clientX - draggingArtboard.startX) / zoom;
        const dy = (e.clientY - draggingArtboard.startY) / zoom;
        updateArtboard(draggingArtboard.id, {
          x: Math.round(draggingArtboard.origX + dx),
          y: Math.round(draggingArtboard.origY + dy),
        });
      }
      if (draggingVarCanvas) {
        const dx = (e.clientX - draggingVarCanvas.startX) / zoom;
        const dy = (e.clientY - draggingVarCanvas.startY) / zoom;
        updateVarCanvas(draggingVarCanvas.id, {
          x: Math.round(draggingVarCanvas.origX + dx),
          y: Math.round(draggingVarCanvas.origY + dy),
        });
      }
      if (isPanning && panStart) {
        const dx = e.clientX - panStart.x;
        const dy = e.clientY - panStart.y;
        setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        setPanStart({ x: e.clientX, y: e.clientY });
      }
    };
    const onUp = () => {
      if ((dragging || resizing || draggingArtboard) && dragSnapRef.current) {
        pushToHistory(dragSnapRef.current);
        dragSnapRef.current = null;
      }
      setDragging(null);
      setResizing(null);
      setDraggingArtboard(null);
      setDraggingVarCanvas(null);
      setIsPanning(false);
      setPanStart(null);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [
    dragging,
    resizing,
    draggingArtboard,
    draggingVarCanvas,
    isPanning,
    panStart,
    zoom,
    updateEl,
    updateArtboard,
    updateVarCanvas,
    pushToHistory,
  ]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === 'z' || e.key === 'Z') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (e.key === 'y' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        redo();
        return;
      }
      if (editingText) return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'c' && (e.metaKey || e.ctrlKey) && selectedIds.size > 0) {
        e.preventDefault();
        copySelected();
        return;
      }
      if (e.key === 'x' && (e.metaKey || e.ctrlKey) && selectedIds.size > 0) {
        e.preventDefault();
        cutSelected();
        return;
      }
      if (e.key === 'v' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        pasteClipboard();
        return;
      }
      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        selectedIds.size > 0
      ) {
        e.preventDefault();
        deleteSelected();
      }
      if (e.key === 'd' && (e.metaKey || e.ctrlKey) && selectedIds.size > 0) {
        e.preventDefault();
        duplicateSelected();
      }
      if (e.key === 'Escape') {
        setSelectedIds(new Set());
        setChildInsertMode(null);
      }
      if (e.key === 'c' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setChildInsertMode((prev) =>
          prev === null
            ? 'first-child'
            : prev === 'first-child'
              ? 'last-child'
              : null,
        );
        return;
      }
      if (e.key === 'r' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        addElement(createRectColored, null, childInsertModeRef.current);
        setChildInsertMode(null);
        return;
      }
      if (e.key === 't' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        addElement(createText, null, childInsertModeRef.current);
        setChildInsertMode(null);
        return;
      }
      if (e.key === 'i' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        addElement(createIcon, null, childInsertModeRef.current);
        setChildInsertMode(null);
        return;
      }
      if (e.key === 'f' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        addArtboard();
        return;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [
    selectedIds,
    editingText,
    deleteSelected,
    duplicateSelected,
    copySelected,
    cutSelected,
    pasteClipboard,
    undo,
    redo,
    addElement,
    addArtboard,
  ]);

  const onWheel = useCallback((e) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      setZoom((z) => Math.max(0.1, Math.min(5, z - e.deltaY * 0.002)));
    } else {
      setPan((p) => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
    }
  }, []);

  // Non-passive wheel listener so preventDefault works
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const handler = (e) => onWheel(e);
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [onWheel]);

  // Canvas pan with middle mouse / space
  const onCanvasMouseDown = (e) => {
    if (e.button === 1 || e.target === canvasRef.current) {
      if (e.target === canvasRef.current) setSelectedIds(new Set());
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  // ── Render element ──
  const renderElement = (id, depth = 0, parentFlexDir = 'column') => {
    const el = elements[id];
    if (!el) return null;
    const isSelected = selectedIds.has(id);
    const isHovered = hoveredId === id && !isSelected;
    const dp = dropPosRef.current;
    const isDropTarget = dp?.targetId === id;
    const isRow = parentFlexDir === 'row';

    // Drop indicator shadow: line before/after or inset glow for 'into'
    let dropShadow = '';
    if (isDropTarget) {
      if (dp.pos === 'before')
        dropShadow = isRow ? '-3px 0 0 #6366f1' : '0 -3px 0 #6366f1';
      else if (dp.pos === 'after')
        dropShadow = isRow ? '3px 0 0 #6366f1' : '0 3px 0 #6366f1';
      else if (dp.pos === 'into') dropShadow = 'inset 0 0 0 2px #a5b4fc';
    }

    const onDragOverEl = (e, elType) => {
      e.preventDefault();
      e.stopPropagation();

      // When hovering a rect container's background (i.e. the gap between its children),
      // find which gap the pointer is in and set dropPos to the neighbouring child.
      if (elType === 'rect' && el.children?.length > 0) {
        const childDivs = [...e.currentTarget.children].filter(
          (c) => c.dataset.elementId,
        );
        if (childDivs.length > 0) {
          const flexDir = el.flexDirection || 'row';
          const isRowLayout = flexDir === 'row';
          let insertBeforeId = null;
          for (const childDiv of childDivs) {
            const cr = childDiv.getBoundingClientRect();
            if (
              isRowLayout
                ? e.clientX < cr.left + cr.width / 2
                : e.clientY < cr.top + cr.height / 2
            ) {
              insertBeforeId = childDiv.dataset.elementId;
              break;
            }
          }
          if (insertBeforeId) {
            setDropPos({ targetId: insertBeforeId, pos: 'before' });
          } else {
            setDropPos({
              targetId: childDivs[childDivs.length - 1].dataset.elementId,
              pos: 'after',
            });
          }
          return;
        }
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      let pos;
      if (isRow) {
        // Parent lays children horizontally: use X axis for before/after
        const inCenter = relX > rect.width * 0.25 && relX < rect.width * 0.75;
        if (
          elType === 'rect' &&
          inCenter &&
          relY > rect.height * 0.25 &&
          relY < rect.height * 0.75
        ) {
          pos = 'into';
        } else {
          pos = relX < rect.width / 2 ? 'before' : 'after';
        }
      } else {
        // Parent lays children vertically: use Y axis for before/after
        const inCenter = relY > rect.height * 0.25 && relY < rect.height * 0.75;
        if (
          elType === 'rect' &&
          inCenter &&
          relX > rect.width * 0.25 &&
          relX < rect.width * 0.75
        ) {
          pos = 'into';
        } else {
          pos = relY < rect.height / 2 ? 'before' : 'after';
        }
      }
      setDropPos({ targetId: id, pos });
    };

    const onDragLeaveEl = (e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setDropPos((prev) => {
          if (!prev) return prev;
          // Clear if the drop target is this element or one of its direct children (gap drop)
          if (prev.targetId === id || el.children?.includes(prev.targetId))
            return null;
          return prev;
        });
      }
    };

    const onDropEl = (e) => {
      e.stopPropagation();
      e.preventDefault();
      const dragId = e.dataTransfer.getData('element-id');
      if (!dragId || dragId === id) {
        setDropPos(null);
        setDndDraggingId(null);
        return;
      }
      const dp = dropPosRef.current;
      // dp.targetId may be a child of this rect (gap drop) or this rect itself
      const targetId = dp?.targetId ?? id;
      const pos = dp?.pos ?? 'into';
      moveElement(dragId, targetId, pos);
      setDropPos(null);
      setDndDraggingId(null);
    };

    const onDragStartEl = (e) => {
      e.dataTransfer.setData('element-id', id);
      e.stopPropagation();
      setDndDraggingId(id);
      const domRect = e.currentTarget.getBoundingClientRect();
      const ghost = document.createElement('div');
      ghost.style.cssText = `width:${domRect.width}px;height:${domRect.height}px;position:fixed;top:-9999px;left:-9999px;border:2px dashed rgba(130,130,130,0.8);border-radius:${el.borderRadius || 0}px;background:transparent;box-sizing:border-box;pointer-events:none;`;
      document.body.appendChild(ghost);
      e.dataTransfer.setDragImage(ghost, domRect.width / 2, domRect.height / 2);
      setTimeout(() => document.body.removeChild(ghost), 0);
    };

    const onDragEndEl = () => {
      setDropPos(null);
      setDndDraggingId(null);
    };

    const isDndDragging = dndDraggingId === id;

    const childModeBadge = isSelected && childInsertMode && (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translate(-50%, calc(-100% - 6px))',
          background: '#6366f1',
          color: '#fff',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: 0.5,
          padding: '2px 7px',
          borderRadius: 10,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 200,
        }}
      >
        {childInsertMode === 'first-child' ? '↑ first child' : '↓ last child'}
      </div>
    );

    const baseStyle = {
      position: el.position || 'relative',
      ...(el.position === 'absolute' ? { left: el.x, top: el.y } : {}),
      opacity: isDndDragging ? 0 : (el.opacity ?? 1),
      outline: isSelected
        ? '2px solid #6366f1'
        : isHovered
          ? '1px solid rgba(99,102,241,0.4)'
          : 'none',
      outlineOffset: isSelected ? 1 : 0,
      cursor: el.position === 'absolute' ? 'move' : 'pointer',
      transition: 'outline 0.1s',
      boxSizing: 'border-box',
      minWidth: 0,
      minHeight: 0,
      boxShadow: dropShadow || undefined,
    };

    // Translate "fill" (100%) to correct flex CSS based on parent axis
    const isFillW = el.width === '100%';
    const isFillH = el.height === '100%';
    const isRowParent =
      parentFlexDir === 'row' || parentFlexDir === 'row-reverse';
    const isColParent =
      parentFlexDir === 'column' || parentFlexDir === 'column-reverse';
    let effWidth = el.width;
    let effHeight = el.height;
    let effFlexGrow = el.flexGrow ?? 0;
    let effAlignSelf = el.alignSelf !== 'auto' ? el.alignSelf : undefined;
    if (isFillW) {
      effWidth = undefined;
      if (isRowParent)
        effFlexGrow = 1; // main axis → grow
      else effAlignSelf = 'stretch'; // cross axis → stretch
    }
    if (isFillH) {
      effHeight = undefined;
      if (isColParent)
        effFlexGrow = 1; // main axis → grow
      else effAlignSelf = 'stretch'; // cross axis → stretch
    }

    if (el.type === 'rect') {
      const style = {
        ...baseStyle,
        width: effWidth,
        height: effHeight,
        background: el.bg,
        borderRadius: el.borderRadius,
        border: el.borderWidth
          ? `${el.borderWidth}px solid ${el.borderColor}`
          : 'none',
        display: el.display || 'flex',
        flexDirection: el.flexDirection || 'row',
        justifyContent: el.justifyContent || 'flex-start',
        alignItems: el.alignItems || 'flex-start',
        gap: el.gap || 0,
        padding: el.padding ?? 0,
        flexWrap: el.flexWrap || 'nowrap',
        overflow: el.overflow || 'visible',
        flexGrow: effFlexGrow,
        flexShrink: el.flexShrink ?? 1,
        alignSelf: effAlignSelf,
      };

      return (
        <div
          key={id}
          data-element-id={id}
          style={style}
          draggable
          onDragStart={onDragStartEl}
          onDragEnd={onDragEndEl}
          onDragOver={(e) => onDragOverEl(e, 'rect')}
          onDragLeave={onDragLeaveEl}
          onDrop={onDropEl}
          onMouseDown={(e) => onMouseDown(e, id)}
          onMouseEnter={() => setHoveredId(id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {childModeBadge}
          {(el.children || []).map((cid) =>
            renderElement(cid, depth + 1, el.flexDirection || 'row'),
          )}
          {/* Resize handles */}
          {selectedIds.size === 1 &&
            isSelected &&
            (typeof el.width === 'number' || typeof el.height === 'number') && (
              <>
                {['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'].map((h) => {
                  const pos = {};
                  if (h.includes('n')) pos.top = -4;
                  if (h.includes('s')) pos.bottom = -4;
                  if (h.includes('e')) pos.right = -4;
                  if (h.includes('w')) pos.left = -4;
                  if (h === 'n' || h === 's') {
                    pos.left = '50%';
                    pos.transform = 'translateX(-50%)';
                  }
                  if (h === 'e' || h === 'w') {
                    pos.top = '50%';
                    pos.transform = 'translateY(-50%)';
                  }
                  const cursors = {
                    n: 'ns-resize',
                    s: 'ns-resize',
                    e: 'ew-resize',
                    w: 'ew-resize',
                    nw: 'nwse-resize',
                    ne: 'nesw-resize',
                    sw: 'nesw-resize',
                    se: 'nwse-resize',
                  };
                  return (
                    <div
                      key={h}
                      onMouseDown={(e) => onResizeStart(e, id, h)}
                      style={{
                        position: 'absolute',
                        ...pos,
                        width: 8,
                        height: 8,
                        background: 'var(--bg-panel)',
                        border: '1.5px solid #6366f1',
                        borderRadius: 2,
                        cursor: cursors[h],
                        zIndex: 100,
                      }}
                    />
                  );
                })}
              </>
            )}
        </div>
      );
    }

    if (el.type === 'text') {
      const style = {
        ...baseStyle,
        fontSize: el.fontSize,
        fontWeight: el.fontWeight,
        color: el.color,
        fontFamily: el.fontFamily,
        textAlign: el.textAlign,
        lineHeight: el.lineHeight,
        letterSpacing: el.letterSpacing,
        width: el.width === 'auto' ? undefined : effWidth,
        height: effHeight,
        flexGrow: effFlexGrow,
        flexShrink: el.flexShrink ?? 1,
        alignSelf: effAlignSelf,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        padding: 2,
      };
      return (
        <div
          key={id}
          data-element-id={id}
          style={style}
          draggable
          onDragStart={onDragStartEl}
          onDragEnd={onDragEndEl}
          onDragOver={(e) => onDragOverEl(e, 'text')}
          onDragLeave={onDragLeaveEl}
          onDrop={onDropEl}
          onMouseDown={(e) => onMouseDown(e, id)}
          onMouseEnter={() => setHoveredId(id)}
          onMouseLeave={() => setHoveredId(null)}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setEditingText(id);
          }}
        >
          {childModeBadge}
          {editingText === id ? (
            <textarea
              autoFocus
              value={el.content}
              onChange={(e) => updateEl(id, { content: e.target.value })}
              onBlur={() => setEditingText(null)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setEditingText(null);
              }}
              style={{
                all: 'inherit',
                background: 'rgba(0,0,0,0.08)',
                border: 'none',
                outline: '1px dashed #6366f1',
                resize: 'none',
                width: '100%',
                minHeight: 20,
                padding: 2,
                fontFamily: 'inherit',
              }}
            />
          ) : (
            el.content
          )}
        </div>
      );
    }

    if (el.type === 'icon') {
      const style = {
        ...baseStyle,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: effFlexGrow,
        flexShrink: 0,
        flexBasis: 'auto',
        width: el.iconSize + 4,
        height: el.iconSize + 4,
        alignSelf: effAlignSelf,
        padding: 2,
      };
      return (
        <div
          key={id}
          data-element-id={id}
          style={style}
          draggable
          onDragStart={onDragStartEl}
          onDragEnd={onDragEndEl}
          onDragOver={(e) => onDragOverEl(e, 'icon')}
          onDragLeave={onDragLeaveEl}
          onDrop={onDropEl}
          onMouseDown={(e) => onMouseDown(e, id)}
          onMouseEnter={() => setHoveredId(id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {childModeBadge}
          {renderIcon(el.iconName, el.iconSize, el.color)}
        </div>
      );
    }
    return null;
  };

  // ── Layer tree ──
  const renderTreeItems = (ids, depth = 0) => {
    return ids.map((id) => {
      const el = elements[id];
      if (!el) return null;
      const isSelected = selectedIds.has(id);
      const icon =
        el.type === 'rect' ? (
          <Square size={11} />
        ) : el.type === 'text' ? (
          <Type size={11} />
        ) : (
          <Star size={11} />
        );
      return (
        <div key={id}>
          <div
            onClick={(e) => {
              if (editingLayerName?.id === id) return;
              if (e.shiftKey || e.metaKey || e.ctrlKey) {
                setSelectedIds((prev) => {
                  const next = new Set(prev);
                  next.has(id) ? next.delete(id) : next.add(id);
                  return next.size > 0 ? next : new Set([id]);
                });
              } else {
                setSelectedIds(new Set([id]));
              }
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setEditingLayerName({ id, value: el.label });
            }}
            draggable={!editingLayerName}
            onDragStart={(e) => {
              e.dataTransfer.setData('element-id', id);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 8px',
              paddingLeft: 8 + depth * 14,
              background: isSelected ? 'var(--accent-selected)' : 'transparent',
              borderLeft: isSelected
                ? '2px solid var(--accent)'
                : '2px solid transparent',
              cursor: 'pointer',
              fontSize: 12,
              color: isSelected
                ? 'var(--accent-selected-text)'
                : 'var(--text-muted)',
              transition: 'all 0.1s',
            }}
            onMouseEnter={() => setHoveredId(id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.6,
                width: 14,
                flexShrink: 0,
              }}
            >
              {icon}
            </span>
            {editingLayerName?.id === id ? (
              <input
                ref={editingLayerNameRef}
                value={editingLayerName.value}
                onChange={(e) =>
                  setEditingLayerName((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }))
                }
                onBlur={() => {
                  updateEl(id, { label: editingLayerName.value });
                  setEditingLayerName(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    updateEl(id, { label: editingLayerName.value });
                    setEditingLayerName(null);
                  }
                  if (e.key === 'Escape') {
                    setEditingLayerName(null);
                  }
                  e.stopPropagation();
                }}
                onClick={(e) => e.stopPropagation()}
                autoFocus
                style={{
                  flex: 1,
                  background: 'var(--bg-input)',
                  border: '1px solid var(--accent)',
                  borderRadius: 3,
                  color: 'var(--text)',
                  fontSize: 12,
                  padding: '1px 4px',
                  outline: 'none',
                }}
              />
            ) : (
              <span
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {el.label}
              </span>
            )}
          </div>
          {el.children &&
            el.children.length > 0 &&
            renderTreeItems(el.children, depth + 1)}
        </div>
      );
    });
  };

  const renderTree = () => {
    return artboards.map((ab) => {
      const isActive = ab.id === activeArtboardId;
      return (
        <div key={ab.id}>
          <div
            onClick={() => {
              setActiveArtboardId(ab.id);
              setSelectedIds(new Set());
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 10px',
              background: isActive ? 'var(--accent-selected)' : 'transparent',
              borderLeft: isActive
                ? '2px solid var(--accent)'
                : '2px solid transparent',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 600,
              color: isActive ? 'var(--ab-label-active)' : 'var(--text-dim)',
              textTransform: 'uppercase',
              letterSpacing: 0.6,
            }}
          >
            <Square size={10} />
            <span
              style={{
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {ab.name}
            </span>
          </div>
          {renderTreeItems(ab.children, 1)}
        </div>
      );
    });
  };

  // ── Variable Canvas renderer ──
  const renderVarCanvas = (vc) => {
    const colHdr = {
      padding: '5px 10px',
      fontSize: 10,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: 'var(--text-dim)',
      background: 'var(--bg-group)',
      borderBottom: '1px solid var(--border)',
    };
    const inputStyle = {
      width: '100%',
      background: 'var(--bg-input)',
      border: '1px solid var(--border-input)',
      borderRadius: 4,
      color: 'var(--text)',
      padding: '4px 6px',
      fontSize: 12,
      outline: 'none',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
    };
    const curType = varNewType[vc.id] ?? 'string';

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Inter', -apple-system, sans-serif",
        }}
      >
        {/* Draggable header */}
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            setDraggingVarCanvas({
              id: vc.id,
              startX: e.clientX,
              startY: e.clientY,
              origX: vc.x,
              origY: vc.y,
            });
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            background: 'var(--bg-header)',
            borderBottom: '1px solid var(--border)',
            cursor: draggingVarCanvas?.id === vc.id ? 'grabbing' : 'grab',
            userSelect: 'none',
            borderRadius: '8px 8px 0 0',
          }}
        >
          <SquarePlus size={13} color='#a855f7' />
          <span
            style={{
              flex: 1,
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: 0.3,
            }}
          >
            {vc.name}
          </span>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => deleteVarCanvas(vc.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-dim)',
              fontSize: 16,
              lineHeight: 1,
              padding: '0 2px',
              opacity: 0.6,
            }}
            title='Delete canvas'
          >
            ×
          </button>
        </div>

        {/* Column headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr 1fr 28px',
            ...colHdr,
          }}
        >
          <span>Type</span>
          <span>Name</span>
          <span>Value</span>
          <span />
        </div>

        {/* Variable rows — scrollable area */}
        <div style={{ maxHeight: 620, overflowY: 'auto' }}>
          {vc.variables.length === 0 && (
            <div
              style={{
                padding: '20px 16px',
                textAlign: 'center',
                fontSize: 12,
                color: 'var(--text-dim)',
              }}
            >
              No variables yet. Add one below.
            </div>
          )}
          {vc.variables.map((v) => {
            const isEditing =
              editingVar?.canvasId === vc.id && editingVar?.varId === v.id;
            const valPreview =
              v.type === 'boolean'
                ? String(v.value)
                : v.type === 'object' || v.type === 'array'
                  ? JSON.stringify(v.value)
                  : String(v.value);
            return (
              <div
                key={v.id}
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                {/* Collapsed row */}
                <div
                  onClick={() =>
                    setEditingVar(
                      isEditing ? null : { canvasId: vc.id, varId: v.id },
                    )
                  }
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr 1fr 28px',
                    alignItems: 'center',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    background: isEditing
                      ? 'var(--accent-selected)'
                      : 'transparent',
                    borderLeft: isEditing
                      ? '2px solid var(--accent)'
                      : '2px solid transparent',
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: '2px 5px',
                      borderRadius: 3,
                      background: VAR_TYPE_COLORS[v.type] + '20',
                      color: VAR_TYPE_COLORS[v.type],
                      border: `1px solid ${VAR_TYPE_COLORS[v.type]}40`,
                      textTransform: 'uppercase',
                      letterSpacing: 0.3,
                      display: 'inline-block',
                    }}
                  >
                    {v.type}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: 'monospace',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: 'var(--text)',
                    }}
                  >
                    {v.name}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: 'monospace',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: 'var(--text-dim)',
                    }}
                  >
                    {valPreview}
                  </span>
                  <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteVarFromCanvas(vc.id, v.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-dim)',
                      fontSize: 15,
                      lineHeight: 1,
                      padding: 0,
                      opacity: 0.5,
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Expanded editor */}
                {isEditing && (
                  <div
                    style={{
                      padding: '10px 14px 14px',
                      background: 'var(--bg-group)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 8,
                      }}
                    >
                      <label
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 3,
                          fontSize: 11,
                          color: 'var(--text-dim)',
                        }}
                      >
                        Name
                        <input
                          value={v.name}
                          onChange={(e) =>
                            updateVarInCanvas(vc.id, v.id, {
                              name: e.target.value,
                            })
                          }
                          style={{ ...inputStyle }}
                        />
                      </label>
                      <label
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 3,
                          fontSize: 11,
                          color: 'var(--text-dim)',
                        }}
                      >
                        Type
                        <select
                          value={v.type}
                          onChange={(e) => {
                            const t = e.target.value;
                            updateVarInCanvas(vc.id, v.id, {
                              type: t,
                              value: TYPE_DEFAULTS[t],
                            });
                          }}
                          style={{ ...inputStyle }}
                        >
                          {[
                            'number',
                            'string',
                            'boolean',
                            'object',
                            'array',
                          ].map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        fontSize: 11,
                        color: 'var(--text-dim)',
                      }}
                    >
                      Value
                      <VariableValueEditor
                        variable={v}
                        onChange={(val) =>
                          updateVarInCanvas(vc.id, v.id, { value: val })
                        }
                      />
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        fontSize: 11,
                        color: 'var(--text-dim)',
                      }}
                    >
                      Description
                      <input
                        value={v.description ?? ''}
                        onChange={(e) =>
                          updateVarInCanvas(vc.id, v.id, {
                            description: e.target.value,
                          })
                        }
                        placeholder='Optional note…'
                        style={{ ...inputStyle }}
                      />
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer: add + export/import */}
        <div
          style={{
            padding: '8px 10px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-panel)',
            borderRadius: '0 0 8px 8px',
          }}
        >
          <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
            <select
              value={curType}
              onMouseDown={(e) => e.stopPropagation()}
              onChange={(e) =>
                setVarNewType((prev) => ({ ...prev, [vc.id]: e.target.value }))
              }
              style={{
                flex: 1,
                background: 'var(--bg-input)',
                border: '1px solid var(--border-input)',
                borderRadius: 4,
                color: 'var(--text)',
                padding: '4px 6px',
                fontSize: 11,
                outline: 'none',
              }}
            >
              {['number', 'string', 'boolean', 'object', 'array'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => addVarToCanvas(vc.id, curType)}
              style={{
                padding: '4px 12px',
                background: 'var(--accent)',
                border: 'none',
                borderRadius: 4,
                color: '#fff',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + Add
            </button>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => {
                const blob = new Blob([JSON.stringify(vc.variables, null, 2)], {
                  type: 'application/json',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${vc.name}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              style={{
                flex: 1,
                padding: '4px 0',
                fontSize: 10,
                border: '1px solid var(--border-input)',
                borderRadius: 4,
                background: 'var(--bg-input)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              Export JSON
            </button>
            <label
              style={{ flex: 1, display: 'flex', cursor: 'pointer' }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <span
                style={{
                  flex: 1,
                  padding: '4px 0',
                  fontSize: 10,
                  border: '1px solid var(--border-input)',
                  borderRadius: 4,
                  background: 'var(--bg-input)',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                }}
              >
                Import JSON
              </span>
              <input
                type='file'
                accept='.json'
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    try {
                      const parsed = JSON.parse(ev.target.result);
                      if (Array.isArray(parsed))
                        updateVarCanvas(vc.id, { variables: parsed });
                    } catch {}
                  };
                  reader.readAsText(file);
                  e.target.value = '';
                }}
              />
            </label>
          </div>
        </div>
      </div>
    );
  };

  // ── Properties panel ──
  const sel = selectedIds.size === 1 ? elements[[...selectedIds][0]] : null;
  const activeArtboard = artboards.find((ab) => ab.id === activeArtboardId);

  const renderProps = () => {
    // Helpers that record change for undo/redo
    const update = (id, patch) => {
      recordChange();
      updateEl(id, patch);
    };
    const updateAb = (id, patch) => {
      recordChange();
      updateArtboard(id, patch);
    };

    // Multi-select panel
    if (selectedIds.size > 1) {
      const selectedEls = [...selectedIds]
        .map((id) => elements[id])
        .filter(Boolean);
      const val = (key) => {
        const vals = selectedEls.map((e) => e[key]);
        return vals.every((v) => v === vals[0]) ? vals[0] : undefined;
      };
      const mixed = (key) =>
        selectedEls.map((e) => e[key]).some((v, _, a) => v !== a[0]);
      const updateAll = (patch) => {
        recordChange();
        [...selectedIds].forEach((id) => updateEl(id, patch));
      };
      const allType = selectedEls.every((e) => e.type === selectedEls[0]?.type)
        ? selectedEls[0]?.type
        : null;
      return (
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <Section title={`${selectedEls.length} Selected`} defaultOpen>
            <div
              style={{
                fontSize: 11,
                color: 'var(--text-dim)',
                marginBottom: 8,
              }}
            >
              {allType ? `All ${allType}s` : 'Mixed types'} · Shift/⌘ click to
              add
            </div>
          </Section>

          {allType === 'rect' && (
            <>
              <Section title='Fill & Border'>
                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <ColorInput
                    value={val('bg') ?? '#6366f1'}
                    onChange={(v) => updateAll({ bg: v })}
                    label={mixed('bg') ? 'Fill (mixed)' : 'Fill'}
                  />
                  <ColorInput
                    value={val('borderColor') ?? '#000'}
                    onChange={(v) => updateAll({ borderColor: v })}
                    label='Border'
                  />
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 6,
                  }}
                >
                  <NumInput
                    label='Radius'
                    value={
                      mixed('borderRadius') ? '' : (val('borderRadius') ?? 0)
                    }
                    onChange={(v) => updateAll({ borderRadius: v })}
                    min={0}
                  />
                  <NumInput
                    label='Border W'
                    value={
                      mixed('borderWidth') ? '' : (val('borderWidth') ?? 0)
                    }
                    onChange={(v) => updateAll({ borderWidth: v })}
                    min={0}
                  />
                </div>
              </Section>
              <Section title='Size'>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 6,
                  }}
                >
                  <NumInput
                    label='Width'
                    value={mixed('width') ? '' : (val('width') ?? 120)}
                    onChange={(v) => updateAll({ width: v })}
                    min={10}
                  />
                  <NumInput
                    label='Height'
                    value={mixed('height') ? '' : (val('height') ?? 80)}
                    onChange={(v) => updateAll({ height: v })}
                    min={10}
                  />
                </div>
              </Section>
            </>
          )}

          {allType === 'text' && (
            <Section title='Typography'>
              <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <ColorInput
                  value={val('color') ?? '#fff'}
                  onChange={(v) => updateAll({ color: v })}
                  label={mixed('color') ? 'Color (mixed)' : 'Color'}
                />
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 6,
                }}
              >
                <NumInput
                  label='Size'
                  value={mixed('fontSize') ? '' : (val('fontSize') ?? 16)}
                  onChange={(v) => updateAll({ fontSize: v })}
                  min={6}
                  max={200}
                />
                <SelectInput
                  label='Weight'
                  value={val('fontWeight') ?? '400'}
                  onChange={(v) => updateAll({ fontWeight: v })}
                  options={[
                    '100',
                    '200',
                    '300',
                    '400',
                    '500',
                    '600',
                    '700',
                    '800',
                    '900',
                  ]}
                />
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 6,
                  marginTop: 6,
                }}
              >
                <SelectInput
                  label='Align'
                  value={val('textAlign') ?? 'left'}
                  onChange={(v) => updateAll({ textAlign: v })}
                  options={['left', 'center', 'right']}
                />
                <NumInput
                  label='Line H'
                  value={mixed('lineHeight') ? '' : (val('lineHeight') ?? 1.4)}
                  onChange={(v) => updateAll({ lineHeight: v })}
                  min={0.5}
                  max={4}
                  step={0.1}
                />
              </div>
            </Section>
          )}

          {allType === 'icon' && (
            <Section title='Icon'>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  marginBottom: 6,
                }}
              >
                <ColorInput
                  value={val('color') ?? '#fff'}
                  onChange={(v) => updateAll({ color: v })}
                  label={mixed('color') ? 'Color (mixed)' : 'Color'}
                />
              </div>
              <NumInput
                label='Size'
                value={mixed('iconSize') ? '' : (val('iconSize') ?? 24)}
                onChange={(v) => updateAll({ iconSize: v })}
                min={8}
                max={128}
              />
            </Section>
          )}
        </div>
      );
    }

    // No element selected — show artboard properties
    if (!sel) {
      if (!activeArtboard) return null;
      const ab = activeArtboard;
      return (
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <Section title='Frame' defaultOpen>
            <input
              value={ab.name}
              onChange={(e) => updateAb(ab.id, { name: e.target.value })}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-input)',
                borderRadius: 4,
                color: 'var(--text)',
                padding: '5px 8px',
                fontSize: 12,
                outline: 'none',
                marginBottom: 8,
              }}
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 6,
              }}
            >
              <NumInput
                label='Width'
                value={ab.width}
                onChange={(v) => updateAb(ab.id, { width: v })}
                min={100}
              />
              <NumInput
                label='Height'
                value={ab.height}
                onChange={(v) => updateAb(ab.id, { height: v })}
                min={100}
              />
            </div>
          </Section>

          <Section title='Fill & Border'>
            <div
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <ColorInput
                value={ab.bg ?? '#ffffff'}
                onChange={(v) => updateAb(ab.id, { bg: v })}
                label='Fill'
              />
              <ColorInput
                value={ab.borderColor ?? '#000000'}
                onChange={(v) => updateAb(ab.id, { borderColor: v })}
                label='Border'
              />
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 6,
              }}
            >
              <NumInput
                label='Radius'
                value={ab.borderRadius ?? 8}
                onChange={(v) => updateAb(ab.id, { borderRadius: v })}
                min={0}
              />
              <NumInput
                label='Border W'
                value={ab.borderWidth ?? 0}
                onChange={(v) => updateAb(ab.id, { borderWidth: v })}
                min={0}
              />
            </div>
            <div style={{ marginTop: 6 }}>
              <NumInput
                label='Opacity'
                value={ab.opacity ?? 1}
                onChange={(v) =>
                  updateAb(ab.id, { opacity: Math.min(1, Math.max(0, v)) })
                }
                min={0}
                max={1}
                step={0.01}
              />
            </div>
          </Section>

          <Section title='Layout'>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 6,
              }}
            >
              <BtnGroup
                label='Direction'
                value={ab.flexDirection ?? 'column'}
                onChange={(v) => updateAb(ab.id, { flexDirection: v })}
                options={[
                  { value: 'row', label: '→' },
                  { value: 'column', label: '↓' },
                  { value: 'row-reverse', label: '←' },
                  { value: 'column-reverse', label: '↑' },
                ]}
              />
              <BtnGroup
                label='Wrap'
                value={ab.flexWrap ?? 'nowrap'}
                onChange={(v) => updateAb(ab.id, { flexWrap: v })}
                options={['nowrap', 'wrap']}
              />
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 6,
                marginTop: 6,
              }}
            >
              <SelectInput
                label='Justify'
                value={ab.justifyContent ?? 'flex-start'}
                onChange={(v) => updateAb(ab.id, { justifyContent: v })}
                options={[
                  'flex-start',
                  'center',
                  'flex-end',
                  'space-between',
                  'space-around',
                  'space-evenly',
                ]}
              />
              <SelectInput
                label='Align'
                value={ab.alignItems ?? 'flex-start'}
                onChange={(v) => updateAb(ab.id, { alignItems: v })}
                options={[
                  'flex-start',
                  'center',
                  'flex-end',
                  'stretch',
                  'baseline',
                ]}
              />
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 6,
                marginTop: 6,
              }}
            >
              <NumInput
                label='Gap'
                value={ab.gap ?? 12}
                onChange={(v) => updateAb(ab.id, { gap: v })}
                min={0}
              />
              <NumInput
                label='Padding'
                value={ab.padding ?? 0}
                onChange={(v) => updateAb(ab.id, { padding: v })}
                min={0}
              />
            </div>
            <div style={{ marginTop: 6 }}>
              <SelectInput
                label='Overflow'
                value={ab.overflow ?? 'visible'}
                onChange={(v) => updateAb(ab.id, { overflow: v })}
                options={['visible', 'hidden', 'scroll', 'auto']}
              />
            </div>
          </Section>
        </div>
      );
    }

    return (
      <div style={{ overflowY: 'auto', flex: 1 }}>
        <Section
          title={
            sel.type === 'rect' ? 'Box' : sel.type === 'text' ? 'Text' : 'Icon'
          }
          defaultOpen
        >
          <input
            value={sel.label}
            onChange={(e) => update(sel.id, { label: e.target.value })}
            style={{
              width: '100%',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-input)',
              borderRadius: 4,
              color: 'var(--text)',
              padding: '5px 8px',
              fontSize: 12,
              outline: 'none',
              marginBottom: 6,
            }}
          />
          <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
            <BtnGroup
              label='Position'
              value={sel.position}
              onChange={(v) => update(sel.id, { position: v })}
              options={['relative', 'absolute']}
            />
          </div>
          {sel.position === 'absolute' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 6,
              }}
            >
              <NumInput
                label='X'
                value={sel.x}
                onChange={(v) => update(sel.id, { x: v })}
              />
              <NumInput
                label='Y'
                value={sel.y}
                onChange={(v) => update(sel.id, { y: v })}
              />
            </div>
          )}
        </Section>

        {/* RECT specific */}
        {sel.type === 'rect' && (
          <>
            <Section title='Fill & Border'>
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <ColorInput
                  value={sel.bg}
                  onChange={(v) => update(sel.id, { bg: v })}
                  label='Fill'
                />
                <ColorInput
                  value={sel.borderColor || '#000'}
                  onChange={(v) => update(sel.id, { borderColor: v })}
                  label='Border'
                />
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 6,
                }}
              >
                <NumInput
                  label='Radius'
                  value={sel.borderRadius}
                  onChange={(v) => update(sel.id, { borderRadius: v })}
                  min={0}
                />
                <NumInput
                  label='Border W'
                  value={sel.borderWidth || 0}
                  onChange={(v) => update(sel.id, { borderWidth: v })}
                  min={0}
                />
              </div>
            </Section>

            <Section title='Size'>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 6,
                }}
              >
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
                >
                  <BtnGroup
                    label='Width'
                    value={
                      sel.width === '100%'
                        ? 'fill'
                        : sel.width === 'fit-content'
                          ? 'hug'
                          : 'fixed'
                    }
                    onChange={(v) => {
                      if (v === 'fixed') {
                        const domEl = document.querySelector(
                          `[data-element-id="${sel.id}"]`,
                        );
                        const measured = domEl
                          ? Math.round(
                              domEl.getBoundingClientRect().width / zoom,
                            )
                          : null;
                        update(sel.id, {
                          width:
                            typeof sel.width === 'number'
                              ? sel.width
                              : (measured ?? 120),
                        });
                      } else if (v === 'fill') {
                        recordChange();
                        updateEl(sel.id, { width: '100%' });
                        if (sel.parent) {
                          const par = elements[sel.parent];
                          const parDir = par.flexDirection || 'row';
                          if (
                            (parDir === 'row' || parDir === 'row-reverse') &&
                            par.width === 'fit-content'
                          ) {
                            const parDom = document.querySelector(
                              `[data-element-id="${sel.parent}"]`,
                            );
                            const measured = parDom
                              ? Math.round(
                                  parDom.getBoundingClientRect().width / zoom,
                                )
                              : 200;
                            updateEl(sel.parent, { width: measured });
                          }
                        }
                      } else {
                        update(sel.id, { width: 'fit-content' });
                      }
                    }}
                    options={[
                      { value: 'fixed', label: 'Fixed' },
                      { value: 'fill', label: 'Fill' },
                      { value: 'hug', label: 'Hug' },
                    ]}
                  />
                  <NumInput
                    value={typeof sel.width === 'number' ? sel.width : 120}
                    onChange={(v) => update(sel.id, { width: v })}
                    min={10}
                    disabled={
                      sel.width === '100%' || sel.width === 'fit-content'
                    }
                  />
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
                >
                  <BtnGroup
                    label='Height'
                    value={
                      sel.height === '100%'
                        ? 'fill'
                        : sel.height === 'fit-content'
                          ? 'hug'
                          : 'fixed'
                    }
                    onChange={(v) => {
                      if (v === 'fixed') {
                        const domEl = document.querySelector(
                          `[data-element-id="${sel.id}"]`,
                        );
                        const measured = domEl
                          ? Math.round(
                              domEl.getBoundingClientRect().height / zoom,
                            )
                          : null;
                        update(sel.id, {
                          height:
                            typeof sel.height === 'number'
                              ? sel.height
                              : (measured ?? 80),
                        });
                      } else if (v === 'fill') {
                        recordChange();
                        updateEl(sel.id, { height: '100%' });
                        if (sel.parent) {
                          const par = elements[sel.parent];
                          const parDir = par.flexDirection || 'row';
                          if (
                            (parDir === 'column' ||
                              parDir === 'column-reverse') &&
                            par.height === 'fit-content'
                          ) {
                            const parDom = document.querySelector(
                              `[data-element-id="${sel.parent}"]`,
                            );
                            const measured = parDom
                              ? Math.round(
                                  parDom.getBoundingClientRect().height / zoom,
                                )
                              : 200;
                            updateEl(sel.parent, { height: measured });
                          }
                        }
                      } else {
                        update(sel.id, { height: 'fit-content' });
                      }
                    }}
                    options={[
                      { value: 'fixed', label: 'Fixed' },
                      { value: 'fill', label: 'Fill' },
                      { value: 'hug', label: 'Hug' },
                    ]}
                  />
                  <NumInput
                    value={typeof sel.height === 'number' ? sel.height : 80}
                    onChange={(v) => update(sel.id, { height: v })}
                    min={10}
                    disabled={
                      sel.height === '100%' || sel.height === 'fit-content'
                    }
                  />
                </div>
              </div>
            </Section>

            <Section title='Flexbox Container'>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 6,
                }}
              >
                <BtnGroup
                  label='Direction'
                  value={sel.flexDirection}
                  onChange={(v) => update(sel.id, { flexDirection: v })}
                  options={[
                    { value: 'row', label: '→' },
                    { value: 'column', label: '↓' },
                    { value: 'row-reverse', label: '←' },
                    { value: 'column-reverse', label: '↑' },
                  ]}
                />
                <BtnGroup
                  label='Wrap'
                  value={sel.flexWrap}
                  onChange={(v) => update(sel.id, { flexWrap: v })}
                  options={['nowrap', 'wrap']}
                />
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 6,
                  marginTop: 6,
                }}
              >
                <SelectInput
                  label='Justify'
                  value={sel.justifyContent}
                  onChange={(v) => update(sel.id, { justifyContent: v })}
                  options={[
                    'flex-start',
                    'center',
                    'flex-end',
                    'space-between',
                    'space-around',
                    'space-evenly',
                  ]}
                />
                <SelectInput
                  label='Align'
                  value={sel.alignItems}
                  onChange={(v) => update(sel.id, { alignItems: v })}
                  options={[
                    'flex-start',
                    'center',
                    'flex-end',
                    'stretch',
                    'baseline',
                  ]}
                />
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 6,
                  marginTop: 6,
                }}
              >
                <NumInput
                  label='Gap'
                  value={sel.gap}
                  onChange={(v) => update(sel.id, { gap: v })}
                  min={0}
                />
                <NumInput
                  label='Padding'
                  value={sel.padding}
                  onChange={(v) => update(sel.id, { padding: v })}
                  min={0}
                />
              </div>
              <div style={{ marginTop: 6 }}>
                <SelectInput
                  label='Overflow'
                  value={sel.overflow || 'visible'}
                  onChange={(v) => update(sel.id, { overflow: v })}
                  options={['visible', 'hidden', 'scroll', 'auto']}
                />
              </div>
            </Section>
          </>
        )}

        {/* TEXT specific */}
        {sel.type === 'text' && (
          <>
            <Section title='Size'>
              <BtnGroup
                label='Width'
                value={sel.width === '100%' ? 'fill' : 'auto'}
                onChange={(v) =>
                  update(sel.id, { width: v === 'fill' ? '100%' : 'auto' })
                }
                options={[
                  { value: 'auto', label: 'Auto' },
                  { value: 'fill', label: 'Fill' },
                ]}
              />
            </Section>
            <Section title='Typography'>
              <textarea
                value={sel.content}
                onChange={(e) => update(sel.id, { content: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-input)',
                  borderRadius: 4,
                  color: 'var(--text)',
                  padding: '5px 8px',
                  fontSize: 12,
                  resize: 'vertical',
                  outline: 'none',
                  marginBottom: 6,
                  fontFamily: 'inherit',
                }}
              />
              <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <ColorInput
                  value={sel.color}
                  onChange={(v) => update(sel.id, { color: v })}
                  label='Color'
                />
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 6,
                }}
              >
                <NumInput
                  label='Size'
                  value={sel.fontSize}
                  onChange={(v) => update(sel.id, { fontSize: v })}
                  min={6}
                  max={200}
                />
                <SelectInput
                  label='Weight'
                  value={sel.fontWeight}
                  onChange={(v) => update(sel.id, { fontWeight: v })}
                  options={[
                    '100',
                    '200',
                    '300',
                    '400',
                    '500',
                    '600',
                    '700',
                    '800',
                    '900',
                  ]}
                />
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 6,
                  marginTop: 6,
                }}
              >
                <SelectInput
                  label='Align'
                  value={sel.textAlign}
                  onChange={(v) => update(sel.id, { textAlign: v })}
                  options={['left', 'center', 'right']}
                />
                <NumInput
                  label='Line H'
                  value={sel.lineHeight}
                  onChange={(v) => update(sel.id, { lineHeight: v })}
                  min={0.5}
                  max={4}
                  step={0.1}
                />
              </div>
              <div style={{ marginTop: 6 }}>
                <NumInput
                  label='Letter Spacing'
                  value={sel.letterSpacing}
                  onChange={(v) => update(sel.id, { letterSpacing: v })}
                  min={-5}
                  max={20}
                  step={0.5}
                />
              </div>
              <div style={{ marginTop: 6 }}>
                <SelectInput
                  label='Font'
                  value={sel.fontFamily}
                  onChange={(v) => update(sel.id, { fontFamily: v })}
                  options={[
                    { value: "'Inter', sans-serif", label: 'Inter' },
                    { value: "'Georgia', serif", label: 'Georgia' },
                    { value: "'Courier New', monospace", label: 'Courier' },
                    { value: "'Arial', sans-serif", label: 'Arial' },
                    { value: "'Trebuchet MS', sans-serif", label: 'Trebuchet' },
                    { value: "'Impact', sans-serif", label: 'Impact' },
                    { value: "'Comic Sans MS', cursive", label: 'Comic Sans' },
                    { value: 'system-ui', label: 'System UI' },
                  ]}
                />
              </div>
            </Section>
          </>
        )}

        {/* ICON specific */}
        {sel.type === 'icon' && (
          <Section title='Icon'>
            <input
              type='text'
              placeholder='Search icons…'
              value={iconSearch}
              onChange={(e) => setIconSearch(e.target.value)}
              style={{
                width: '100%',
                marginBottom: 8,
                padding: '4px 8px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-input)',
                borderRadius: 4,
                color: 'var(--text)',
                fontSize: 11,
                boxSizing: 'border-box',
              }}
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 4,
                marginBottom: 8,
                maxHeight: 200,
                overflowY: 'auto',
              }}
            >
              {ICON_NAMES.filter((name) => {
                if (!iconSearch) return true;
                const q = iconSearch.toLowerCase();
                return (
                  name.includes(q) ||
                  (lucideIcons[name] || []).some((kw) => kw.includes(q))
                );
              }).map((name) => (
                <button
                  key={name}
                  title={name}
                  onClick={() => update(sel.id, { iconName: name })}
                  style={{
                    padding: 6,
                    background:
                      sel.iconName === name
                        ? 'var(--accent)'
                        : 'var(--bg-input)',
                    border:
                      sel.iconName === name
                        ? '1px solid var(--accent-light)'
                        : '1px solid var(--border-input)',
                    borderRadius: 4,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: sel.iconName === name ? '#fff' : 'var(--text-dim)',
                  }}
                >
                  {renderIcon(
                    name,
                    14,
                    sel.iconName === name ? '#fff' : 'var(--text-dim)',
                  )}
                </button>
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <ColorInput
                value={sel.color}
                onChange={(v) => update(sel.id, { color: v })}
                label='Color'
              />
            </div>
            <NumInput
              label='Size'
              value={sel.iconSize}
              onChange={(v) => update(sel.id, { iconSize: v })}
              min={8}
              max={128}
            />
          </Section>
        )}
      </div>
    );
  };

  // ── Styles ──
  const sidebarStyle = {
    width: 220,
    background: 'var(--bg-panel)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, sans-serif",
  };
  const propsPanelStyle = {
    width: 240,
    background: 'var(--bg-panel)',
    borderLeft: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, sans-serif",
  };

  return (
    <div
      style={{
        ...themeVars,
        display: 'flex',
        width: '100%',
        height: '100vh',
        background: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: "'Inter', -apple-system, sans-serif",
        overflow: 'hidden',
        userSelect:
          dragging || resizing || draggingArtboard || draggingVarCanvas
            ? 'none'
            : 'auto',
      }}
    >
      {/* Left sidebar: Layers + Add */}
      <div style={sidebarStyle}>
        <div
          style={{
            padding: '10px 12px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--bg-header)',
          }}
        >
          <Layers size={16} color='#6366f1' />
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.5,
              color: 'var(--accent-light)',
              flex: 1,
            }}
          >
            FlexDesign
          </span>
          {/* Theme toggle */}
          <button
            onClick={cycleTheme}
            title={`Theme: ${theme.name} — click to switch`}
            style={{
              padding: '2px 8px',
              fontSize: 10,
              border: '1px solid var(--border-input)',
              borderRadius: 10,
              background: 'var(--bg-input)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 500,
              letterSpacing: 0.3,
              flexShrink: 0,
            }}
          >
            {theme.name}
          </button>
        </div>

        {/* Add element buttons */}
        <div
          style={{
            padding: '8px 10px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            gap: 4,
          }}
        >
          <button
            onClick={() => addElement(createRectColored)}
            style={{
              ...addBtnStyle,
              background: '#6366f1',
              border: '1px solid #4f51cc',
              color: '#fff',
            }}
            title='Box (R)'
          >
            <Square size={13} color='#fff' />
          </button>
          <button
            onClick={() => addElement(createText)}
            style={addBtnStyle}
            title='Text (T)'
          >
            <span style={{ fontSize: 13, fontWeight: 700 }}>T</span>
          </button>
          <button
            onClick={() => addElement(createIcon)}
            style={addBtnStyle}
            title='Icon (I)'
          >
            <Star size={13} />
          </button>
          {/* Add artboard button */}
          <button
            onClick={addArtboard}
            style={{
              ...addBtnStyle,
              marginLeft: 'auto',
              paddingLeft: 8,
              paddingRight: 8,
              gap: 4,
              fontSize: 10,
              flexShrink: 0,
              flexGrow: 0,
              width: 'auto',
            }}
            title='Add Frame (F)'
          >
            <Frame size={13} />
          </button>
          {/* Add variable canvas button */}
          <button
            onClick={addVarCanvas}
            style={{
              ...addBtnStyle,
              paddingLeft: 8,
              paddingRight: 8,
              gap: 3,
              fontSize: 10,
              flexShrink: 0,
              flexGrow: 0,
              width: 'auto',
              background: '#a855f720',
              border: '1px solid #a855f740',
              color: '#a855f7',
            }}
            title='Add Variables Canvas'
          >
            <SquarePlus size={13} />
            <span>Vars</span>
          </button>
        </div>

        {/* Layer tree */}
        <div style={{ flex: 1, overflowY: 'auto', paddingTop: 4 }}>
          <div
            style={{
              padding: '4px 10px',
              fontSize: 10,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              color: 'var(--text-dim)',
            }}
          >
            Layers
          </div>
          {renderTree()}
        </div>

        {/* Undo / Redo */}
        <div
          style={{
            padding: '6px 10px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <button
            onClick={undo}
            disabled={!canUndo}
            title='Undo (Ctrl+Z)'
            style={{
              ...zoomBtnStyle,
              flex: 1,
              opacity: canUndo ? 1 : 0.35,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Undo2 size={14} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title='Redo (Ctrl+Y)'
            style={{
              ...zoomBtnStyle,
              flex: 1,
              opacity: canRedo ? 1 : 0.35,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Redo2 size={14} />
          </button>
        </div>

        {/* Zoom */}
        <div
          style={{
            padding: '8px 10px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <button
            onClick={() => setZoom((z) => Math.max(0.1, z - 0.1))}
            style={zoomBtnStyle}
          >
            −
          </button>
          <span
            style={{
              fontSize: 11,
              color: 'var(--text-dim)',
              flex: 1,
              textAlign: 'center',
            }}
          >
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(5, z + 0.1))}
            style={zoomBtnStyle}
          >
            +
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            style={{ ...zoomBtnStyle, fontSize: 9 }}
          >
            FIT
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        style={{
          flex: 1,
          overflow: 'hidden',
          background: 'var(--bg)',
          position: 'relative',
          cursor: isPanning ? 'grabbing' : 'default',
        }}
        onMouseDown={onCanvasMouseDown}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: `linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)`,
            backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }}
        />

        {/* All artboards */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          {artboards.map((ab) => {
            const isActive = ab.id === activeArtboardId;
            return (
              <div
                key={ab.id}
                style={{ position: 'absolute', left: ab.x, top: ab.y }}
              >
                {/* Artboard label */}
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setActiveArtboardId(ab.id);
                    setSelectedIds(new Set());
                    dragSnapRef.current = getSnapshot();
                    setDraggingArtboard({
                      id: ab.id,
                      startX: e.clientX,
                      startY: e.clientY,
                      origX: ab.x,
                      origY: ab.y,
                    });
                  }}
                  style={{
                    position: 'absolute',
                    top: -24,
                    left: 0,
                    fontSize: 11,
                    fontWeight: 600,
                    color: isActive
                      ? 'var(--ab-label-active)'
                      : 'var(--ab-label)',
                    cursor:
                      draggingArtboard?.id === ab.id ? 'grabbing' : 'grab',
                    userSelect: 'none',
                    transition: 'color 0.1s',
                  }}
                >
                  {ab.name} — {ab.width} × {ab.height}
                </div>
                {/* Artboard body */}
                <div
                  style={{
                    width: ab.width,
                    height: ab.height,
                    background: ab.bg ?? 'var(--bg-artboard)',
                    borderRadius: ab.borderRadius ?? 8,
                    border:
                      (ab.borderWidth ?? 0) > 0
                        ? `${ab.borderWidth}px solid ${ab.borderColor}`
                        : isActive
                          ? '1px solid var(--ab-border-active)'
                          : '1px solid var(--ab-border)',
                    boxShadow: isActive
                      ? 'var(--ab-shadow-active)'
                      : 'var(--ab-shadow)',
                    display: 'flex',
                    flexDirection: ab.flexDirection ?? 'column',
                    justifyContent: ab.justifyContent ?? 'flex-start',
                    alignItems: ab.alignItems ?? 'flex-start',
                    flexWrap: ab.flexWrap ?? 'nowrap',
                    padding: ab.padding ?? 0,
                    gap: ab.gap ?? 12,
                    overflow: ab.overflow ?? 'visible',
                    opacity: ab.opacity ?? 1,
                    position: 'relative',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onMouseDown={(e) => {
                    if (e.target === e.currentTarget) {
                      setActiveArtboardId(ab.id);
                      setSelectedIds(new Set());
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const dragId = e.dataTransfer.getData('element-id');
                    if (dragId && elements[dragId]) {
                      const dragEl = elements[dragId];
                      const dp = dropPosRef.current;
                      if (dp?.targetId && dp.targetId !== ab.id) {
                        // Gap drop: insert relative to a sibling in this artboard
                        moveElement(dragId, dp.targetId, dp.pos);
                      } else if (dragEl.parent) {
                        pushToHistory(getSnapshot());
                        setElements((prev) => ({
                          ...prev,
                          [dragEl.parent]: {
                            ...prev[dragEl.parent],
                            children: prev[dragEl.parent].children.filter(
                              (c) => c !== dragId,
                            ),
                          },
                        }));
                        updateEl(dragId, { parent: null });
                        setArtboards((prev) =>
                          prev.map((a) =>
                            a.id === ab.id
                              ? { ...a, children: [...a.children, dragId] }
                              : a,
                          ),
                        );
                      }
                    }
                    setDropPos(null);
                    setDndDraggingId(null);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (ab.children.length > 0) {
                      const childDivs = [...e.currentTarget.children].filter(
                        (c) => c.dataset.elementId,
                      );
                      if (childDivs.length > 0) {
                        const isRowLayout =
                          (ab.flexDirection ?? 'column') === 'row';
                        let insertBeforeId = null;
                        for (const childDiv of childDivs) {
                          const cr = childDiv.getBoundingClientRect();
                          if (
                            isRowLayout
                              ? e.clientX < cr.left + cr.width / 2
                              : e.clientY < cr.top + cr.height / 2
                          ) {
                            insertBeforeId = childDiv.dataset.elementId;
                            break;
                          }
                        }
                        if (insertBeforeId) {
                          setDropPos({
                            targetId: insertBeforeId,
                            pos: 'before',
                          });
                        } else {
                          setDropPos({
                            targetId:
                              childDivs[childDivs.length - 1].dataset.elementId,
                            pos: 'after',
                          });
                        }
                      }
                    }
                  }}
                >
                  {ab.children.map((id) =>
                    renderElement(id, 1, ab.flexDirection ?? 'column'),
                  )}
                </div>
              </div>
            );
          })}

          {/* Variable canvases */}
          {varCanvases.map((vc) => (
            <div
              key={vc.id}
              style={{ position: 'absolute', left: vc.x, top: vc.y }}
            >
              {/* Canvas label */}
              <div
                style={{
                  position: 'absolute',
                  top: -22,
                  left: 0,
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--ab-label)',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {vc.name} — variables
              </div>
              <div
                style={{
                  width: 800,
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--ab-shadow)',
                  background: 'var(--bg-artboard)',
                  overflow: 'hidden',
                }}
              >
                {renderVarCanvas(vc)}
              </div>
            </div>
          ))}
        </div>

        {/* Help tooltip */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--tooltip-bg)',
            border: '1px solid var(--tooltip-border)',
            borderRadius: 6,
            padding: '6px 14px',
            fontSize: 11,
            color: 'var(--tooltip-text)',
            display: 'flex',
            gap: 16,
            backdropFilter: 'blur(8px)',
          }}
        >
          <span>
            <b style={{ color: 'var(--tooltip-bold)' }}>R/T/I/F</b> add element
          </span>
          <span>
            <b style={{ color: 'var(--tooltip-bold)' }}>Ctrl+Scroll</b> Zoom
          </span>
          <span>
            <b style={{ color: 'var(--tooltip-bold)' }}>Drag</b> canvas to pan
          </span>
          <span>
            <b style={{ color: 'var(--tooltip-bold)' }}>Dbl-click</b> text to
            edit
          </span>
          <span>
            <b style={{ color: 'var(--tooltip-bold)' }}>Del</b> remove
          </span>
          <span>
            <b style={{ color: 'var(--tooltip-bold)' }}>Ctrl+C/X/V</b>{' '}
            copy/cut/paste
          </span>
          <span>
            <b style={{ color: 'var(--tooltip-bold)' }}>Ctrl+D</b> duplicate
          </span>
          <span>
            <b style={{ color: 'var(--tooltip-bold)' }}>Ctrl+Z</b> undo
          </span>
        </div>
      </div>

      {/* Right sidebar: Properties */}
      <div style={propsPanelStyle}>{renderProps()}</div>
    </div>
  );
}

const addBtnStyle = {
  flex: 1,
  padding: '6px 0',
  border: '1px solid var(--border-input)',
  borderRadius: 5,
  background: 'var(--bg-input)',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12,
  gap: 4,
};

const zoomBtnStyle = {
  padding: '3px 8px',
  border: '1px solid var(--border-input)',
  borderRadius: 4,
  background: 'var(--bg-input)',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  fontSize: 13,
};
