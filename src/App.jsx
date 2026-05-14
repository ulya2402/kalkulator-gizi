// ─── 1. IMPORTS ─────────────────────────────────────────
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chart, registerables } from 'chart.js/auto';
import { 
  Baby, Scale, Ruler, HeartPulse, LineChart, 
  ClipboardList, Moon, Sun, RotateCcw, 
  ChevronDown, AlertCircle, CheckCircle, Info, Trash2, Calendar,
  User, Bed, PersonStanding, ArrowDownCircle
} from 'lucide-react';

Chart.register(...registerables);

// Menambahkan Font ke document (Jika belum ada di index.html)
const addFonts = () => {
  if (!document.getElementById('app-fonts')) {
    const style = document.createElement('style');
    style.id = 'app-fonts';
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
      
      html { scroll-behavior: smooth; } /* Efek gulir halus (Smooth Scroll) */
      
      .font-heading { font-family: 'Plus Jakarta Sans', sans-serif; }
      .font-body { font-family: 'Inter', sans-serif; }
      
      @media print {
        body { background: white !important; }
        .no-print { display: none !important; }
        .print-only { display: block !important; }
        .print-container { padding: 0 !important; max-width: 100% !important; box-shadow: none !important; }
        .print-break { page-break-inside: avoid; }
      }
      
      /* Animasi Halus (Smooth Slide Up Fade) */
      @keyframes slideUpFade {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-slide-up {
        animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0; /* Mulai dalam keadaan tak terlihat */
      }
      
      /* Animasi gelembung background (Glow effect) */
      @keyframes floatBlob {
        0% { transform: translate(0px, 0px) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0px, 0px) scale(1); }
      }
      .animate-blob { animation: floatBlob 10s infinite alternate ease-in-out; }
    `;
    document.head.appendChild(style);
  }
};

// ─── 2. WHO DATASET ─────────────────────────────────────
// Data sesuai Permenkes No. 2 Tahun 2020

const bbu_laki = {
  0:  { SD3neg:2.1,  SD2neg:2.5,  SD1neg:2.9,  median:3.3,  SD1:3.9,  SD2:4.4,  SD3:5.0  },
  1:  { SD3neg:2.9,  SD2neg:3.4,  SD1neg:3.9,  median:4.5,  SD1:5.1,  SD2:5.8,  SD3:6.6  },
  2:  { SD3neg:3.8,  SD2neg:4.3,  SD1neg:4.9,  median:5.6,  SD1:6.3,  SD2:7.1,  SD3:8.0  },
  3:  { SD3neg:4.4,  SD2neg:5.0,  SD1neg:5.7,  median:6.4,  SD1:7.2,  SD2:8.0,  SD3:9.0  },
  4:  { SD3neg:4.9,  SD2neg:5.6,  SD1neg:6.2,  median:7.0,  SD1:7.8,  SD2:8.7,  SD3:9.7  },
  5:  { SD3neg:5.3,  SD2neg:6.0,  SD1neg:6.7,  median:7.5,  SD1:8.4,  SD2:9.3,  SD3:10.4 },
  6:  { SD3neg:5.7,  SD2neg:6.4,  SD1neg:7.1,  median:7.9,  SD1:8.8,  SD2:9.8,  SD3:10.9 },
  7:  { SD3neg:5.9,  SD2neg:6.7,  SD1neg:7.4,  median:8.3,  SD1:9.2,  SD2:10.3, SD3:11.4 },
  8:  { SD3neg:6.2,  SD2neg:6.9,  SD1neg:7.7,  median:8.6,  SD1:9.6,  SD2:10.7, SD3:11.9 },
  9:  { SD3neg:6.4,  SD2neg:7.1,  SD1neg:8.0,  median:8.9,  SD1:9.9,  SD2:11.0, SD3:12.3 },
  10: { SD3neg:6.6,  SD2neg:7.4,  SD1neg:8.2,  median:9.2,  SD1:10.2, SD2:11.4, SD3:12.7 },
  11: { SD3neg:6.8,  SD2neg:7.6,  SD1neg:8.4,  median:9.4,  SD1:10.5, SD2:11.7, SD3:13.0 },
  12: { SD3neg:6.9,  SD2neg:7.7,  SD1neg:8.6,  median:9.6,  SD1:10.8, SD2:12.0, SD3:13.3 },
  13: { SD3neg:7.1,  SD2neg:7.9,  SD1neg:8.8,  median:9.9,  SD1:11.0, SD2:12.3, SD3:13.7 },
  14: { SD3neg:7.2,  SD2neg:8.1,  SD1neg:9.0,  median:10.1, SD1:11.3, SD2:12.6, SD3:14.0 },
  15: { SD3neg:7.4,  SD2neg:8.3,  SD1neg:9.2,  median:10.3, SD1:11.5, SD2:12.8, SD3:14.3 },
  16: { SD3neg:7.5,  SD2neg:8.4,  SD1neg:9.4,  median:10.5, SD1:11.7, SD2:13.1, SD3:14.6 },
  17: { SD3neg:7.7,  SD2neg:8.6,  SD1neg:9.6,  median:10.7, SD1:12.0, SD2:13.4, SD3:14.9 },
  18: { SD3neg:7.8,  SD2neg:8.8,  SD1neg:9.8,  median:10.9, SD1:12.2, SD2:13.7, SD3:15.3 },
  19: { SD3neg:8.0,  SD2neg:8.9,  SD1neg:10.0, median:11.1, SD1:12.5, SD2:13.9, SD3:15.6 },
  20: { SD3neg:8.1,  SD2neg:9.1,  SD1neg:10.1, median:11.3, SD1:12.7, SD2:14.2, SD3:15.9 },
  21: { SD3neg:8.2,  SD2neg:9.2,  SD1neg:10.3, median:11.5, SD1:12.9, SD2:14.5, SD3:16.2 },
  22: { SD3neg:8.4,  SD2neg:9.4,  SD1neg:10.5, median:11.8, SD1:13.2, SD2:14.7, SD3:16.5 },
  23: { SD3neg:8.5,  SD2neg:9.5,  SD1neg:10.7, median:12.0, SD1:13.4, SD2:15.0, SD3:16.8 },
  24: { SD3neg:8.6,  SD2neg:9.7,  SD1neg:10.8, median:12.2, SD1:13.6, SD2:15.3, SD3:17.1 },
  25: { SD3neg:8.8,  SD2neg:9.8,  SD1neg:11.0, median:12.4, SD1:13.9, SD2:15.5, SD3:17.5 },
  26: { SD3neg:8.9,  SD2neg:10.0, SD1neg:11.2, median:12.5, SD1:14.1, SD2:15.8, SD3:17.8 },
  27: { SD3neg:9.0,  SD2neg:10.1, SD1neg:11.3, median:12.7, SD1:14.3, SD2:16.1, SD3:18.1 },
  28: { SD3neg:9.1,  SD2neg:10.2, SD1neg:11.5, median:12.9, SD1:14.5, SD2:16.3, SD3:18.4 },
  29: { SD3neg:9.2,  SD2neg:10.4, SD1neg:11.7, median:13.1, SD1:14.8, SD2:16.6, SD3:18.7 },
  30: { SD3neg:9.4,  SD2neg:10.5, SD1neg:11.8, median:13.3, SD1:15.0, SD2:16.9, SD3:19.0 },
  31: { SD3neg:9.5,  SD2neg:10.7, SD1neg:12.0, median:13.5, SD1:15.2, SD2:17.1, SD3:19.3 },
  32: { SD3neg:9.6,  SD2neg:10.8, SD1neg:12.1, median:13.7, SD1:15.4, SD2:17.4, SD3:19.6 },
  33: { SD3neg:9.7,  SD2neg:10.9, SD1neg:12.3, median:13.8, SD1:15.6, SD2:17.6, SD3:19.9 },
  34: { SD3neg:9.8,  SD2neg:11.0, SD1neg:12.4, median:14.0, SD1:15.8, SD2:17.8, SD3:20.2 },
  35: { SD3neg:9.9,  SD2neg:11.2, SD1neg:12.6, median:14.2, SD1:16.0, SD2:18.1, SD3:20.4 },
  36: { SD3neg:10.0, SD2neg:11.3, SD1neg:12.7, median:14.3, SD1:16.2, SD2:18.3, SD3:20.7 },
  37: { SD3neg:10.1, SD2neg:11.4, SD1neg:12.9, median:14.5, SD1:16.4, SD2:18.6, SD3:21.0 },
  38: { SD3neg:10.2, SD2neg:11.5, SD1neg:13.0, median:14.7, SD1:16.6, SD2:18.8, SD3:21.3 },
  39: { SD3neg:10.3, SD2neg:11.6, SD1neg:13.1, median:14.8, SD1:16.8, SD2:19.0, SD3:21.6 },
  40: { SD3neg:10.4, SD2neg:11.8, SD1neg:13.3, median:15.0, SD1:17.0, SD2:19.3, SD3:21.9 },
  41: { SD3neg:10.5, SD2neg:11.9, SD1neg:13.4, median:15.2, SD1:17.2, SD2:19.5, SD3:22.1 },
  42: { SD3neg:10.6, SD2neg:12.0, SD1neg:13.6, median:15.3, SD1:17.4, SD2:19.7, SD3:22.4 },
  43: { SD3neg:10.7, SD2neg:12.1, SD1neg:13.7, median:15.5, SD1:17.6, SD2:20.0, SD3:22.7 },
  44: { SD3neg:10.8, SD2neg:12.2, SD1neg:13.8, median:15.7, SD1:17.8, SD2:20.2, SD3:23.0 },
  45: { SD3neg:10.9, SD2neg:12.4, SD1neg:14.0, median:15.8, SD1:18.0, SD2:20.5, SD3:23.3 },
  46: { SD3neg:11.0, SD2neg:12.5, SD1neg:14.1, median:16.0, SD1:18.2, SD2:20.7, SD3:23.6 },
  47: { SD3neg:11.1, SD2neg:12.6, SD1neg:14.3, median:16.2, SD1:18.4, SD2:20.9, SD3:23.9 },
  48: { SD3neg:11.2, SD2neg:12.7, SD1neg:14.4, median:16.3, SD1:18.6, SD2:21.2, SD3:24.2 },
  49: { SD3neg:11.3, SD2neg:12.8, SD1neg:14.5, median:16.5, SD1:18.8, SD2:21.4, SD3:24.5 },
  50: { SD3neg:11.4, SD2neg:12.9, SD1neg:14.7, median:16.7, SD1:19.0, SD2:21.7, SD3:24.8 },
  51: { SD3neg:11.5, SD2neg:13.1, SD1neg:14.8, median:16.8, SD1:19.2, SD2:21.9, SD3:25.1 },
  52: { SD3neg:11.6, SD2neg:13.2, SD1neg:15.0, median:17.0, SD1:19.4, SD2:22.2, SD3:25.4 },
  53: { SD3neg:11.7, SD2neg:13.3, SD1neg:15.1, median:17.2, SD1:19.6, SD2:22.4, SD3:25.7 },
  54: { SD3neg:11.8, SD2neg:13.4, SD1neg:15.2, median:17.3, SD1:19.8, SD2:22.7, SD3:26.0 },
  55: { SD3neg:11.9, SD2neg:13.5, SD1neg:15.4, median:17.5, SD1:20.0, SD2:22.9, SD3:26.3 },
  56: { SD3neg:12.0, SD2neg:13.6, SD1neg:15.5, median:17.7, SD1:20.2, SD2:23.2, SD3:26.6 },
  57: { SD3neg:12.1, SD2neg:13.7, SD1neg:15.6, median:17.8, SD1:20.4, SD2:23.4, SD3:26.9 },
  58: { SD3neg:12.2, SD2neg:13.8, SD1neg:15.8, median:18.0, SD1:20.6, SD2:23.7, SD3:27.2 },
  59: { SD3neg:12.3, SD2neg:14.0, SD1neg:15.9, median:18.2, SD1:20.8, SD2:23.9, SD3:27.6 },
  60: { SD3neg:12.4, SD2neg:14.1, SD1neg:16.0, median:18.3, SD1:21.0, SD2:24.2, SD3:27.9 }
};

const pbu_laki = {
  0:  { SD3neg:44.2, SD2neg:46.1, SD1neg:48.0, median:49.9, SD1:51.8, SD2:53.7, SD3:55.6 },
  1:  { SD3neg:48.9, SD2neg:50.8, SD1neg:52.8, median:54.7, SD1:56.7, SD2:58.6, SD3:60.6 },
  2:  { SD3neg:52.4, SD2neg:54.4, SD1neg:56.4, median:58.4, SD1:60.4, SD2:62.4, SD3:64.4 },
  3:  { SD3neg:55.3, SD2neg:57.3, SD1neg:59.4, median:61.4, SD1:63.5, SD2:65.5, SD3:67.6 },
  4:  { SD3neg:57.6, SD2neg:59.7, SD1neg:61.8, median:63.9, SD1:66.0, SD2:68.0, SD3:70.1 },
  5:  { SD3neg:59.6, SD2neg:61.7, SD1neg:63.8, median:65.9, SD1:68.0, SD2:70.1, SD3:72.2 },
  6:  { SD3neg:61.2, SD2neg:63.3, SD1neg:65.5, median:67.6, SD1:69.8, SD2:71.9, SD3:74.0 },
  7:  { SD3neg:62.7, SD2neg:64.8, SD1neg:67.0, median:69.2, SD1:71.3, SD2:73.5, SD3:75.7 },
  8:  { SD3neg:64.0, SD2neg:66.2, SD1neg:68.4, median:70.6, SD1:72.8, SD2:75.0, SD3:77.2 },
  9:  { SD3neg:65.2, SD2neg:67.5, SD1neg:69.7, median:72.0, SD1:74.2, SD2:76.5, SD3:78.7 },
  10: { SD3neg:66.4, SD2neg:68.7, SD1neg:71.0, median:73.3, SD1:75.6, SD2:77.9, SD3:80.1 },
  11: { SD3neg:67.6, SD2neg:69.9, SD1neg:72.2, median:74.5, SD1:76.9, SD2:79.2, SD3:81.5 },
  12: { SD3neg:68.6, SD2neg:71.0, SD1neg:73.4, median:75.7, SD1:78.1, SD2:80.5, SD3:82.9 },
  13: { SD3neg:69.6, SD2neg:72.1, SD1neg:74.5, median:76.9, SD1:79.3, SD2:81.8, SD3:84.2 },
  14: { SD3neg:70.6, SD2neg:73.1, SD1neg:75.6, median:78.0, SD1:80.5, SD2:83.0, SD3:85.5 },
  15: { SD3neg:71.6, SD2neg:74.1, SD1neg:76.6, median:79.1, SD1:81.7, SD2:84.2, SD3:86.7 },
  16: { SD3neg:72.5, SD2neg:75.0, SD1neg:77.6, median:80.2, SD1:82.8, SD2:85.4, SD3:88.0 },
  17: { SD3neg:73.3, SD2neg:76.0, SD1neg:78.6, median:81.2, SD1:83.9, SD2:86.5, SD3:89.2 },
  18: { SD3neg:74.2, SD2neg:76.9, SD1neg:79.6, median:82.3, SD1:85.0, SD2:87.7, SD3:90.4 },
  19: { SD3neg:75.0, SD2neg:77.7, SD1neg:80.5, median:83.2, SD1:86.0, SD2:88.8, SD3:91.5 },
  20: { SD3neg:75.8, SD2neg:78.6, SD1neg:81.4, median:84.2, SD1:87.0, SD2:89.8, SD3:92.6 },
  21: { SD3neg:76.5, SD2neg:79.4, SD1neg:82.3, median:85.1, SD1:88.0, SD2:90.9, SD3:93.8 },
  22: { SD3neg:77.2, SD2neg:80.2, SD1neg:83.1, median:86.0, SD1:89.0, SD2:91.9, SD3:94.9 },
  23: { SD3neg:78.0, SD2neg:81.0, SD1neg:83.9, median:86.9, SD1:89.9, SD2:92.9, SD3:95.9 },
  24: { SD3neg:78.7, SD2neg:81.7, SD1neg:84.8, median:87.8, SD1:90.9, SD2:93.9, SD3:97.0 }
};

const tbu_laki = {
  24: { SD3neg:78.0, SD2neg:81.0, SD1neg:84.1, median:87.1, SD1:90.2, SD2:93.2, SD3:96.3 },
  25: { SD3neg:78.6, SD2neg:81.7, SD1neg:84.9, median:88.0, SD1:91.1, SD2:94.2, SD3:97.3 },
  26: { SD3neg:79.3, SD2neg:82.5, SD1neg:85.6, median:88.8, SD1:92.0, SD2:95.2, SD3:98.3 },
  27: { SD3neg:79.9, SD2neg:83.1, SD1neg:86.4, median:89.6, SD1:92.9, SD2:96.1, SD3:99.3 },
  28: { SD3neg:80.5, SD2neg:83.8, SD1neg:87.1, median:90.4, SD1:93.7, SD2:97.0, SD3:100.3},
  29: { SD3neg:81.1, SD2neg:84.5, SD1neg:87.8, median:91.2, SD1:94.5, SD2:97.9, SD3:101.2},
  30: { SD3neg:81.7, SD2neg:85.1, SD1neg:88.5, median:91.9, SD1:95.3, SD2:98.7, SD3:102.1},
  31: { SD3neg:82.3, SD2neg:85.7, SD1neg:89.2, median:92.7, SD1:96.1, SD2:99.6, SD3:103.0},
  32: { SD3neg:82.8, SD2neg:86.4, SD1neg:89.9, median:93.4, SD1:96.9, SD2:100.4,SD3:103.9},
  33: { SD3neg:83.4, SD2neg:86.9, SD1neg:90.5, median:94.1, SD1:97.6, SD2:101.2,SD3:104.8},
  34: { SD3neg:83.9, SD2neg:87.5, SD1neg:91.1, median:94.8, SD1:98.4, SD2:102.0,SD3:105.6},
  35: { SD3neg:84.4, SD2neg:88.1, SD1neg:91.8, median:95.4, SD1:99.1, SD2:102.7,SD3:106.4},
  36: { SD3neg:85.0, SD2neg:88.7, SD1neg:92.4, median:96.1, SD1:99.8, SD2:103.5,SD3:107.2},
  37: { SD3neg:85.5, SD2neg:89.2, SD1neg:93.0, median:96.7, SD1:100.5,SD2:104.2,SD3:108.0},
  38: { SD3neg:86.0, SD2neg:89.8, SD1neg:93.6, median:97.4, SD1:101.2,SD2:105.0,SD3:108.8},
  39: { SD3neg:86.5, SD2neg:90.3, SD1neg:94.2, median:98.0, SD1:101.8,SD2:105.7,SD3:109.5},
  40: { SD3neg:87.0, SD2neg:90.9, SD1neg:94.7, median:98.6, SD1:102.5,SD2:106.4,SD3:110.3},
  41: { SD3neg:87.5, SD2neg:91.4, SD1neg:95.3, median:99.2, SD1:103.2,SD2:107.1,SD3:111.0},
  42: { SD3neg:88.0, SD2neg:91.9, SD1neg:95.9, median:99.9, SD1:103.8,SD2:107.8,SD3:111.7},
  43: { SD3neg:88.4, SD2neg:92.4, SD1neg:96.4, median:100.4,SD1:104.5,SD2:108.5,SD3:112.5},
  44: { SD3neg:88.9, SD2neg:93.0, SD1neg:97.0, median:101.0,SD1:105.1,SD2:109.1,SD3:113.2},
  45: { SD3neg:89.4, SD2neg:93.5, SD1neg:97.5, median:101.6,SD1:105.7,SD2:109.8,SD3:113.9},
  46: { SD3neg:89.8, SD2neg:94.0, SD1neg:98.1, median:102.2,SD1:106.3,SD2:110.4,SD3:114.6},
  47: { SD3neg:90.3, SD2neg:94.4, SD1neg:98.6, median:102.8,SD1:106.9,SD2:111.1,SD3:115.2},
  48: { SD3neg:90.7, SD2neg:94.9, SD1neg:99.1, median:103.3,SD1:107.5,SD2:111.7,SD3:115.9},
  49: { SD3neg:91.2, SD2neg:95.4, SD1neg:99.7, median:103.9,SD1:108.1,SD2:112.4,SD3:116.6},
  50: { SD3neg:91.6, SD2neg:95.9, SD1neg:100.2,median:104.4,SD1:108.7,SD2:113.0,SD3:117.3},
  51: { SD3neg:92.1, SD2neg:96.4, SD1neg:100.7,median:105.0,SD1:109.3,SD2:113.6,SD3:117.9},
  52: { SD3neg:92.5, SD2neg:96.9, SD1neg:101.2,median:105.6,SD1:109.9,SD2:114.2,SD3:118.6},
  53: { SD3neg:93.0, SD2neg:97.4, SD1neg:101.7,median:106.1,SD1:110.5,SD2:114.9,SD3:119.2},
  54: { SD3neg:93.4, SD2neg:97.8, SD1neg:102.3,median:106.7,SD1:111.1,SD2:115.5,SD3:119.9},
  55: { SD3neg:93.9, SD2neg:98.3, SD1neg:102.8,median:107.2,SD1:111.7,SD2:116.1,SD3:120.6},
  56: { SD3neg:94.3, SD2neg:98.8, SD1neg:103.3,median:107.8,SD1:112.3,SD2:116.7,SD3:121.2},
  57: { SD3neg:94.7, SD2neg:99.3, SD1neg:103.8,median:108.3,SD1:112.8,SD2:117.4,SD3:121.9},
  58: { SD3neg:95.2, SD2neg:99.7, SD1neg:104.3,median:108.9,SD1:113.4,SD2:118.0,SD3:122.6},
  59: { SD3neg:95.6, SD2neg:100.2,SD1neg:104.8,median:109.4,SD1:114.0,SD2:118.6,SD3:123.2},
  60: { SD3neg:96.1, SD2neg:100.7,SD1neg:105.3,median:110.0,SD1:114.6,SD2:119.2,SD3:123.9}
};

const bbpb_laki = {
  "45.0": { SD3neg:1.9, SD2neg:2.0, SD1neg:2.2, median:2.4, SD1:2.7, SD2:3.0, SD3:3.3 },
  "45.5": { SD3neg:1.9, SD2neg:2.1, SD1neg:2.3, median:2.5, SD1:2.8, SD2:3.1, SD3:3.4 },
  "46.0": { SD3neg:2.0, SD2neg:2.2, SD1neg:2.4, median:2.6, SD1:2.9, SD2:3.1, SD3:3.5 },
  "46.5": { SD3neg:2.1, SD2neg:2.3, SD1neg:2.5, median:2.7, SD1:3.0, SD2:3.2, SD3:3.6 },
  "47.0": { SD3neg:2.1, SD2neg:2.3, SD1neg:2.5, median:2.8, SD1:3.0, SD2:3.3, SD3:3.7 },
  "47.5": { SD3neg:2.2, SD2neg:2.4, SD1neg:2.6, median:2.9, SD1:3.1, SD2:3.4, SD3:3.8 },
  "48.0": { SD3neg:2.3, SD2neg:2.5, SD1neg:2.7, median:2.9, SD1:3.2, SD2:3.6, SD3:3.9 },
  "48.5": { SD3neg:2.3, SD2neg:2.6, SD1neg:2.8, median:3.0, SD1:3.3, SD2:3.7, SD3:4.0 },
  "49.0": { SD3neg:2.4, SD2neg:2.6, SD1neg:2.9, median:3.1, SD1:3.4, SD2:3.8, SD3:4.2 },
  "49.5": { SD3neg:2.5, SD2neg:2.7, SD1neg:3.0, median:3.2, SD1:3.5, SD2:3.9, SD3:4.3 },
  "50.0": { SD3neg:2.6, SD2neg:2.8, SD1neg:3.0, median:3.3, SD1:3.6, SD2:4.0, SD3:4.4 },
  "50.5": { SD3neg:2.7, SD2neg:2.9, SD1neg:3.1, median:3.4, SD1:3.8, SD2:4.1, SD3:4.5 },
  "51.0": { SD3neg:2.7, SD2neg:3.0, SD1neg:3.2, median:3.5, SD1:3.9, SD2:4.2, SD3:4.7 },
  "51.5": { SD3neg:2.8, SD2neg:3.1, SD1neg:3.3, median:3.6, SD1:4.0, SD2:4.4, SD3:4.8 },
  "52.0": { SD3neg:2.9, SD2neg:3.2, SD1neg:3.5, median:3.8, SD1:4.1, SD2:4.5, SD3:5.0 },
  "52.5": { SD3neg:3.0, SD2neg:3.3, SD1neg:3.6, median:3.9, SD1:4.2, SD2:4.6, SD3:5.1 },
  "53.0": { SD3neg:3.1, SD2neg:3.4, SD1neg:3.7, median:4.0, SD1:4.4, SD2:4.8, SD3:5.3 },
  "53.5": { SD3neg:3.2, SD2neg:3.5, SD1neg:3.8, median:4.1, SD1:4.5, SD2:4.9, SD3:5.4 },
  "54.0": { SD3neg:3.3, SD2neg:3.6, SD1neg:3.9, median:4.3, SD1:4.7, SD2:5.1, SD3:5.6 },
  "54.5": { SD3neg:3.4, SD2neg:3.7, SD1neg:4.0, median:4.4, SD1:4.8, SD2:5.3, SD3:5.8 },
  "55.0": { SD3neg:3.6, SD2neg:3.8, SD1neg:4.2, median:4.5, SD1:5.0, SD2:5.4, SD3:6.0 },
  "55.5": { SD3neg:3.7, SD2neg:4.0, SD1neg:4.3, median:4.7, SD1:5.1, SD2:5.6, SD3:6.1 },
  "56.0": { SD3neg:3.8, SD2neg:4.1, SD1neg:4.4, median:4.8, SD1:5.3, SD2:5.8, SD3:6.3 },
  "56.5": { SD3neg:3.9, SD2neg:4.2, SD1neg:4.6, median:5.0, SD1:5.4, SD2:5.9, SD3:6.5 },
  "57.0": { SD3neg:4.0, SD2neg:4.3, SD1neg:4.7, median:5.1, SD1:5.6, SD2:6.1, SD3:6.7 },
  "57.5": { SD3neg:4.1, SD2neg:4.5, SD1neg:4.9, median:5.3, SD1:5.7, SD2:6.3, SD3:6.9 },
  "58.0": { SD3neg:4.3, SD2neg:4.6, SD1neg:5.0, median:5.4, SD1:5.9, SD2:6.4, SD3:7.1 },
  "58.5": { SD3neg:4.4, SD2neg:4.7, SD1neg:5.1, median:5.6, SD1:6.1, SD2:6.6, SD3:7.2 },
  "59.0": { SD3neg:4.5, SD2neg:4.8, SD1neg:5.3, median:5.7, SD1:6.2, SD2:6.8, SD3:7.4 },
  "59.5": { SD3neg:4.6, SD2neg:5.0, SD1neg:5.4, median:5.9, SD1:6.4, SD2:7.0, SD3:7.6 },
  "60.0": { SD3neg:4.7, SD2neg:5.1, SD1neg:5.5, median:6.0, SD1:6.5, SD2:7.1, SD3:7.8 },
  "60.5": { SD3neg:4.8, SD2neg:5.2, SD1neg:5.6, median:6.1, SD1:6.7, SD2:7.3, SD3:8.0 },
  "61.0": { SD3neg:4.9, SD2neg:5.3, SD1neg:5.8, median:6.3, SD1:6.8, SD2:7.4, SD3:8.1 },
  "61.5": { SD3neg:5.0, SD2neg:5.4, SD1neg:5.9, median:6.4, SD1:7.0, SD2:7.6, SD3:8.3 },
  "62.0": { SD3neg:5.1, SD2neg:5.6, SD1neg:6.0, median:6.5, SD1:7.1, SD2:7.7, SD3:8.5 },
  "62.5": { SD3neg:5.2, SD2neg:5.7, SD1neg:6.1, median:6.7, SD1:7.2, SD2:7.9, SD3:8.6 },
  "63.0": { SD3neg:5.3, SD2neg:5.8, SD1neg:6.2, median:6.8, SD1:7.4, SD2:8.0, SD3:8.8 },
  "63.5": { SD3neg:5.4, SD2neg:5.9, SD1neg:6.4, median:6.9, SD1:7.5, SD2:8.2, SD3:8.9 },
  "64.0": { SD3neg:5.5, SD2neg:6.0, SD1neg:6.5, median:7.0, SD1:7.6, SD2:8.3, SD3:9.1 },
  "64.5": { SD3neg:5.6, SD2neg:6.1, SD1neg:6.6, median:7.1, SD1:7.8, SD2:8.5, SD3:9.3 },
  "65.0": { SD3neg:5.7, SD2neg:6.2, SD1neg:6.7, median:7.3, SD1:7.9, SD2:8.6, SD3:9.4 },
  "65.5": { SD3neg:5.8, SD2neg:6.3, SD1neg:6.8, median:7.4, SD1:8.0, SD2:8.7, SD3:9.6 },
  "66.0": { SD3neg:5.9, SD2neg:6.4, SD1neg:6.9, median:7.5, SD1:8.2, SD2:8.9, SD3:9.7 },
  "66.5": { SD3neg:6.0, SD2neg:6.5, SD1neg:7.0, median:7.6, SD1:8.3, SD2:9.0, SD3:9.9 },
  "67.0": { SD3neg:6.1, SD2neg:6.6, SD1neg:7.1, median:7.7, SD1:8.4, SD2:9.2, SD3:10.0},
  "67.5": { SD3neg:6.2, SD2neg:6.7, SD1neg:7.2, median:7.9, SD1:8.5, SD2:9.3, SD3:10.2},
  "68.0": { SD3neg:6.3, SD2neg:6.8, SD1neg:7.3, median:8.0, SD1:8.7, SD2:9.4, SD3:10.3},
  "68.5": { SD3neg:6.4, SD2neg:6.9, SD1neg:7.5, median:8.1, SD1:8.8, SD2:9.6, SD3:10.5},
  "69.0": { SD3neg:6.5, SD2neg:7.0, SD1neg:7.6, median:8.2, SD1:8.9, SD2:9.7, SD3:10.6},
  "69.5": { SD3neg:6.6, SD2neg:7.1, SD1neg:7.7, median:8.3, SD1:9.0, SD2:9.8, SD3:10.8},
  "70.0": { SD3neg:6.6, SD2neg:7.2, SD1neg:7.8, median:8.4, SD1:9.2, SD2:10.0,SD3:10.9},
  "70.5": { SD3neg:6.7, SD2neg:7.3, SD1neg:7.9, median:8.5, SD1:9.3, SD2:10.1,SD3:11.1},
  "71.0": { SD3neg:6.8, SD2neg:7.4, SD1neg:8.0, median:8.6, SD1:9.4, SD2:10.2,SD3:11.2},
  "71.5": { SD3neg:6.9, SD2neg:7.5, SD1neg:8.1, median:8.8, SD1:9.5, SD2:10.4,SD3:11.3},
  "72.0": { SD3neg:7.0, SD2neg:7.6, SD1neg:8.2, median:8.9, SD1:9.6, SD2:10.5,SD3:11.5},
  "72.5": { SD3neg:7.1, SD2neg:7.6, SD1neg:8.3, median:9.0, SD1:9.8, SD2:10.6,SD3:11.6},
  "73.0": { SD3neg:7.2, SD2neg:7.7, SD1neg:8.4, median:9.1, SD1:9.9, SD2:10.8,SD3:11.8},
  "73.5": { SD3neg:7.2, SD2neg:7.8, SD1neg:8.5, median:9.2, SD1:10.0,SD2:10.9,SD3:11.9},
  "74.0": { SD3neg:7.3, SD2neg:7.9, SD1neg:8.6, median:9.3, SD1:10.1,SD2:11.0,SD3:12.1},
  "74.5": { SD3neg:7.4, SD2neg:8.0, SD1neg:8.7, median:9.4, SD1:10.2,SD2:11.2,SD3:12.2},
  "75.0": { SD3neg:7.5, SD2neg:8.1, SD1neg:8.8, median:9.5, SD1:10.3,SD2:11.3,SD3:12.3},
  "75.5": { SD3neg:7.6, SD2neg:8.2, SD1neg:8.8, median:9.6, SD1:10.4,SD2:11.4,SD3:12.5},
  "76.0": { SD3neg:7.6, SD2neg:8.3, SD1neg:8.9, median:9.7, SD1:10.6,SD2:11.5,SD3:12.6},
  "76.5": { SD3neg:7.7, SD2neg:8.3, SD1neg:9.0, median:9.8, SD1:10.7,SD2:11.6,SD3:12.7},
  "77.0": { SD3neg:7.8, SD2neg:8.4, SD1neg:9.1, median:9.9, SD1:10.8,SD2:11.7,SD3:12.8},
  "77.5": { SD3neg:7.9, SD2neg:8.5, SD1neg:9.2, median:10.0,SD1:10.9,SD2:11.9,SD3:13.0},
  "78.0": { SD3neg:7.9, SD2neg:8.6, SD1neg:9.3, median:10.1,SD1:11.0,SD2:12.0,SD3:13.1},
  "78.5": { SD3neg:8.0, SD2neg:8.7, SD1neg:9.4, median:10.2,SD1:11.1,SD2:12.1,SD3:13.2},
  "79.0": { SD3neg:8.1, SD2neg:8.7, SD1neg:9.5, median:10.3,SD1:11.2,SD2:12.2,SD3:13.3},
  "79.5": { SD3neg:8.2, SD2neg:8.8, SD1neg:9.5, median:10.4,SD1:11.3,SD2:12.3,SD3:13.4},
  "80.0": { SD3neg:8.2, SD2neg:8.9, SD1neg:9.6, median:10.4,SD1:11.4,SD2:12.4,SD3:13.6},
  "80.5": { SD3neg:8.3, SD2neg:9.0, SD1neg:9.7, median:10.5,SD1:11.5,SD2:12.5,SD3:13.7},
  "81.0": { SD3neg:8.4, SD2neg:9.1, SD1neg:9.8, median:10.6,SD1:11.6,SD2:12.6,SD3:13.8},
  "81.5": { SD3neg:8.5, SD2neg:9.1, SD1neg:9.9, median:10.7,SD1:11.7,SD2:12.7,SD3:13.9},
  "82.0": { SD3neg:8.5, SD2neg:9.2, SD1neg:10.0,median:10.8,SD1:11.8,SD2:12.8,SD3:14.0},
  "82.5": { SD3neg:8.6, SD2neg:9.3, SD1neg:10.1,median:10.9,SD1:11.9,SD2:13.0,SD3:14.2},
  "83.0": { SD3neg:8.7, SD2neg:9.4, SD1neg:10.2,median:11.0,SD1:12.0,SD2:13.1,SD3:14.3},
  "83.5": { SD3neg:8.8, SD2neg:9.5, SD1neg:10.3,median:11.2,SD1:12.1,SD2:13.2,SD3:14.4},
  "84.0": { SD3neg:8.9, SD2neg:9.6, SD1neg:10.4,median:11.3,SD1:12.2,SD2:13.3,SD3:14.6},
  "84.5": { SD3neg:9.0, SD2neg:9.7, SD1neg:10.5,median:11.4,SD1:12.4,SD2:13.5,SD3:14.7},
  "85.0": { SD3neg:9.1, SD2neg:9.8, SD1neg:10.6,median:11.5,SD1:12.5,SD2:13.6,SD3:14.9},
  "85.5": { SD3neg:9.2, SD2neg:9.9, SD1neg:10.7,median:11.6,SD1:12.6,SD2:13.7,SD3:15.0},
  "86.0": { SD3neg:9.3, SD2neg:10.0,SD1neg:10.8,median:11.7,SD1:12.8,SD2:13.9,SD3:15.2},
  "86.5": { SD3neg:9.4, SD2neg:10.1,SD1neg:11.0,median:11.9,SD1:12.9,SD2:14.0,SD3:15.3},
  "87.0": { SD3neg:9.5, SD2neg:10.2,SD1neg:11.1,median:12.0,SD1:13.0,SD2:14.2,SD3:15.5},
  "87.5": { SD3neg:9.6, SD2neg:10.4,SD1neg:11.2,median:12.1,SD1:13.2,SD2:14.3,SD3:15.6},
  "88.0": { SD3neg:9.7, SD2neg:10.5,SD1neg:11.3,median:12.2,SD1:13.3,SD2:14.5,SD3:15.8},
  "88.5": { SD3neg:9.8, SD2neg:10.6,SD1neg:11.4,median:12.4,SD1:13.4,SD2:14.6,SD3:15.9},
  "89.0": { SD3neg:9.9, SD2neg:10.7,SD1neg:11.5,median:12.5,SD1:13.5,SD2:14.7,SD3:16.1},
  "89.5": { SD3neg:10.0,SD2neg:10.8,SD1neg:11.6,median:12.6,SD1:13.7,SD2:14.9,SD3:16.2},
  "90.0": { SD3neg:10.1,SD2neg:10.9,SD1neg:11.8,median:12.7,SD1:13.8,SD2:15.0,SD3:16.4},
  "90.5": { SD3neg:10.2,SD2neg:11.0,SD1neg:11.9,median:12.8,SD1:13.9,SD2:15.1,SD3:16.5},
  "91.0": { SD3neg:10.3,SD2neg:11.1,SD1neg:12.0,median:13.0,SD1:14.1,SD2:15.3,SD3:16.7},
  "91.5": { SD3neg:10.4,SD2neg:11.2,SD1neg:12.1,median:13.1,SD1:14.2,SD2:15.4,SD3:16.8},
  "92.0": { SD3neg:10.5,SD2neg:11.3,SD1neg:12.2,median:13.2,SD1:14.3,SD2:15.6,SD3:17.0},
  "92.5": { SD3neg:10.6,SD2neg:11.4,SD1neg:12.3,median:13.3,SD1:14.4,SD2:15.7,SD3:17.1},
  "93.0": { SD3neg:10.7,SD2neg:11.5,SD1neg:12.4,median:13.4,SD1:14.6,SD2:15.8,SD3:17.3},
  "93.5": { SD3neg:10.7,SD2neg:11.6,SD1neg:12.5,median:13.5,SD1:14.7,SD2:16.0,SD3:17.4},
  "94.0": { SD3neg:10.8,SD2neg:11.7,SD1neg:12.6,median:13.7,SD1:14.8,SD2:16.1,SD3:17.6},
  "94.5": { SD3neg:10.9,SD2neg:11.8,SD1neg:12.7,median:13.8,SD1:14.9,SD2:16.3,SD3:17.7},
  "95.0": { SD3neg:11.0,SD2neg:11.9,SD1neg:12.8,median:13.9,SD1:15.1,SD2:16.4,SD3:17.9},
  "95.5": { SD3neg:11.1,SD2neg:12.0,SD1neg:12.9,median:14.0,SD1:15.2,SD2:16.5,SD3:18.0},
  "96.0": { SD3neg:11.2,SD2neg:12.1,SD1neg:13.1,median:14.1,SD1:15.3,SD2:16.7,SD3:18.2},
  "96.5": { SD3neg:11.3,SD2neg:12.2,SD1neg:13.2,median:14.3,SD1:15.5,SD2:16.8,SD3:18.4},
  "97.0": { SD3neg:11.4,SD2neg:12.3,SD1neg:13.3,median:14.4,SD1:15.6,SD2:17.0,SD3:18.5},
  "97.5": { SD3neg:11.5,SD2neg:12.4,SD1neg:13.4,median:14.5,SD1:15.7,SD2:17.1,SD3:18.7},
  "98.0": { SD3neg:11.6,SD2neg:12.5,SD1neg:13.5,median:14.6,SD1:15.9,SD2:17.3,SD3:18.9},
  "98.5": { SD3neg:11.7,SD2neg:12.6,SD1neg:13.6,median:14.8,SD1:16.0,SD2:17.5,SD3:19.1},
  "99.0": { SD3neg:11.8,SD2neg:12.7,SD1neg:13.7,median:14.9,SD1:16.2,SD2:17.6,SD3:19.2},
  "99.5": { SD3neg:11.9,SD2neg:12.8,SD1neg:13.9,median:15.0,SD1:16.3,SD2:17.8,SD3:19.4},
  "100.0":{ SD3neg:12.0,SD2neg:12.9,SD1neg:14.0,median:15.2,SD1:16.5,SD2:18.0,SD3:19.6},
  "100.5":{ SD3neg:12.1,SD2neg:13.0,SD1neg:14.1,median:15.3,SD1:16.6,SD2:18.1,SD3:19.8},
  "101.0":{ SD3neg:12.2,SD2neg:13.2,SD1neg:14.2,median:15.4,SD1:16.8,SD2:18.3,SD3:20.0},
  "101.5":{ SD3neg:12.3,SD2neg:13.3,SD1neg:14.4,median:15.6,SD1:16.9,SD2:18.5,SD3:20.2},
  "102.0":{ SD3neg:12.4,SD2neg:13.4,SD1neg:14.5,median:15.7,SD1:17.1,SD2:18.7,SD3:20.4},
  "102.5":{ SD3neg:12.5,SD2neg:13.5,SD1neg:14.6,median:15.9,SD1:17.3,SD2:18.8,SD3:20.6},
  "103.0":{ SD3neg:12.6,SD2neg:13.6,SD1neg:14.8,median:16.0,SD1:17.4,SD2:19.0,SD3:20.8},
  "103.5":{ SD3neg:12.7,SD2neg:13.7,SD1neg:14.9,median:16.2,SD1:17.6,SD2:19.2,SD3:21.0},
  "104.0":{ SD3neg:12.8,SD2neg:13.9,SD1neg:15.0,median:16.3,SD1:17.8,SD2:19.4,SD3:21.2},
  "104.5":{ SD3neg:12.9,SD2neg:14.0,SD1neg:15.2,median:16.5,SD1:17.9,SD2:19.6,SD3:21.5},
  "105.0":{ SD3neg:13.0,SD2neg:14.1,SD1neg:15.3,median:16.6,SD1:18.1,SD2:19.8,SD3:21.7},
  "105.5":{ SD3neg:13.2,SD2neg:14.2,SD1neg:15.4,median:16.8,SD1:18.3,SD2:20.0,SD3:21.9},
  "106.0":{ SD3neg:13.3,SD2neg:14.4,SD1neg:15.6,median:16.9,SD1:18.5,SD2:20.2,SD3:22.1},
  "106.5":{ SD3neg:13.4,SD2neg:14.5,SD1neg:15.7,median:17.1,SD1:18.6,SD2:20.4,SD3:22.4},
  "107.0":{ SD3neg:13.5,SD2neg:14.6,SD1neg:15.9,median:17.3,SD1:18.8,SD2:20.6,SD3:22.6},
  "107.5":{ SD3neg:13.6,SD2neg:14.7,SD1neg:16.0,median:17.4,SD1:19.0,SD2:20.8,SD3:22.8},
  "108.0":{ SD3neg:13.7,SD2neg:14.9,SD1neg:16.2,median:17.6,SD1:19.2,SD2:21.0,SD3:23.1},
  "108.5":{ SD3neg:13.8,SD2neg:15.0,SD1neg:16.3,median:17.8,SD1:19.4,SD2:21.2,SD3:23.3},
  "109.0":{ SD3neg:14.0,SD2neg:15.1,SD1neg:16.5,median:17.9,SD1:19.6,SD2:21.4,SD3:23.6},
  "109.5":{ SD3neg:14.1,SD2neg:15.3,SD1neg:16.6,median:18.1,SD1:19.8,SD2:21.7,SD3:23.8},
  "110.0":{ SD3neg:14.2,SD2neg:15.4,SD1neg:16.8,median:18.3,SD1:20.0,SD2:21.9,SD3:24.1}
};

const bbtb_laki = {
  "65.0": { SD3neg:5.9, SD2neg:6.3, SD1neg:6.9, median:7.4, SD1:8.1, SD2:8.8, SD3:9.6 },
  "65.5": { SD3neg:6.0, SD2neg:6.4, SD1neg:7.0, median:7.6, SD1:8.2, SD2:8.9, SD3:9.8 },
  "66.0": { SD3neg:6.1, SD2neg:6.5, SD1neg:7.1, median:7.7, SD1:8.3, SD2:9.1, SD3:9.9 },
  "66.5": { SD3neg:6.1, SD2neg:6.6, SD1neg:7.2, median:7.8, SD1:8.5, SD2:9.2, SD3:10.1},
  "67.0": { SD3neg:6.2, SD2neg:6.7, SD1neg:7.3, median:7.9, SD1:8.6, SD2:9.4, SD3:10.2},
  "67.5": { SD3neg:6.3, SD2neg:6.8, SD1neg:7.4, median:8.0, SD1:8.7, SD2:9.5, SD3:10.4},
  "68.0": { SD3neg:6.4, SD2neg:6.9, SD1neg:7.5, median:8.1, SD1:8.8, SD2:9.6, SD3:10.5},
  "68.5": { SD3neg:6.5, SD2neg:7.0, SD1neg:7.6, median:8.2, SD1:9.0, SD2:9.8, SD3:10.7},
  "69.0": { SD3neg:6.6, SD2neg:7.1, SD1neg:7.7, median:8.4, SD1:9.1, SD2:9.9, SD3:10.8},
  "69.5": { SD3neg:6.7, SD2neg:7.2, SD1neg:7.8, median:8.5, SD1:9.2, SD2:10.0,SD3:11.0},
  "70.0": { SD3neg:6.8, SD2neg:7.3, SD1neg:7.9, median:8.6, SD1:9.3, SD2:10.2,SD3:11.1},
  "70.5": { SD3neg:6.9, SD2neg:7.4, SD1neg:8.0, median:8.7, SD1:9.5, SD2:10.3,SD3:11.3},
  "71.0": { SD3neg:6.9, SD2neg:7.5, SD1neg:8.1, median:8.8, SD1:9.6, SD2:10.4,SD3:11.4},
  "71.5": { SD3neg:7.0, SD2neg:7.6, SD1neg:8.2, median:8.9, SD1:9.7, SD2:10.6,SD3:11.6},
  "72.0": { SD3neg:7.1, SD2neg:7.7, SD1neg:8.3, median:9.0, SD1:9.8, SD2:10.7,SD3:11.7},
  "72.5": { SD3neg:7.2, SD2neg:7.8, SD1neg:8.4, median:9.1, SD1:9.9, SD2:10.8,SD3:11.8},
  "73.0": { SD3neg:7.3, SD2neg:7.9, SD1neg:8.5, median:9.2, SD1:10.0,SD2:11.0,SD3:12.0},
  "73.5": { SD3neg:7.4, SD2neg:7.9, SD1neg:8.6, median:9.3, SD1:10.2,SD2:11.1,SD3:12.1},
  "74.0": { SD3neg:7.4, SD2neg:8.0, SD1neg:8.7, median:9.4, SD1:10.3,SD2:11.2,SD3:12.2},
  "74.5": { SD3neg:7.5, SD2neg:8.1, SD1neg:8.8, median:9.5, SD1:10.4,SD2:11.3,SD3:12.4},
  "75.0": { SD3neg:7.6, SD2neg:8.2, SD1neg:8.9, median:9.6, SD1:10.5,SD2:11.4,SD3:12.5},
  "75.5": { SD3neg:7.7, SD2neg:8.3, SD1neg:9.0, median:9.7, SD1:10.6,SD2:11.6,SD3:12.6},
  "76.0": { SD3neg:7.7, SD2neg:8.4, SD1neg:9.1, median:9.8, SD1:10.7,SD2:11.7,SD3:12.8},
  "76.5": { SD3neg:7.8, SD2neg:8.5, SD1neg:9.2, median:9.9, SD1:10.8,SD2:11.8,SD3:12.9},
  "77.0": { SD3neg:7.9, SD2neg:8.5, SD1neg:9.2, median:10.0,SD1:10.9,SD2:11.9,SD3:13.0},
  "77.5": { SD3neg:8.0, SD2neg:8.6, SD1neg:9.3, median:10.1,SD1:11.0,SD2:12.0,SD3:13.1},
  "78.0": { SD3neg:8.0, SD2neg:8.7, SD1neg:9.4, median:10.2,SD1:11.1,SD2:12.1,SD3:13.3},
  "78.5": { SD3neg:8.1, SD2neg:8.8, SD1neg:9.5, median:10.3,SD1:11.2,SD2:12.2,SD3:13.4},
  "79.0": { SD3neg:8.2, SD2neg:8.8, SD1neg:9.6, median:10.4,SD1:11.3,SD2:12.3,SD3:13.5},
  "79.5": { SD3neg:8.3, SD2neg:8.9, SD1neg:9.7, median:10.5,SD1:11.4,SD2:12.4,SD3:13.6},
  "80.0": { SD3neg:8.3, SD2neg:9.0, SD1neg:9.7, median:10.6,SD1:11.5,SD2:12.6,SD3:13.7},
  "80.5": { SD3neg:8.4, SD2neg:9.1, SD1neg:9.8, median:10.7,SD1:11.6,SD2:12.7,SD3:13.8},
  "81.0": { SD3neg:8.5, SD2neg:9.2, SD1neg:9.9, median:10.8,SD1:11.7,SD2:12.8,SD3:14.0},
  "81.5": { SD3neg:8.6, SD2neg:9.3, SD1neg:10.0,median:10.9,SD1:11.8,SD2:12.9,SD3:14.1},
  "82.0": { SD3neg:8.7, SD2neg:9.3, SD1neg:10.1,median:11.0,SD1:11.9,SD2:13.0,SD3:14.2},
  "82.5": { SD3neg:8.7, SD2neg:9.4, SD1neg:10.2,median:11.1,SD1:12.1,SD2:13.1,SD3:14.4},
  "83.0": { SD3neg:8.8, SD2neg:9.5, SD1neg:10.3,median:11.2,SD1:12.2,SD2:13.3,SD3:14.5},
  "83.5": { SD3neg:8.9, SD2neg:9.6, SD1neg:10.4,median:11.3,SD1:12.3,SD2:13.4,SD3:14.6},
  "84.0": { SD3neg:9.0, SD2neg:9.7, SD1neg:10.5,median:11.4,SD1:12.4,SD2:13.5,SD3:14.8},
  "84.5": { SD3neg:9.1, SD2neg:9.9, SD1neg:10.7,median:11.5,SD1:12.5,SD2:13.7,SD3:14.9},
  "85.0": { SD3neg:9.2, SD2neg:10.0,SD1neg:10.8,median:11.7,SD1:12.7,SD2:13.8,SD3:15.1},
  "85.5": { SD3neg:9.3, SD2neg:10.1,SD1neg:10.9,median:11.8,SD1:12.8,SD2:13.9,SD3:15.2},
  "86.0": { SD3neg:9.4, SD2neg:10.2,SD1neg:11.0,median:11.9,SD1:12.9,SD2:14.1,SD3:15.4},
  "86.5": { SD3neg:9.5, SD2neg:10.3,SD1neg:11.1,median:12.0,SD1:13.1,SD2:14.2,SD3:15.5},
  "87.0": { SD3neg:9.6, SD2neg:10.4,SD1neg:11.2,median:12.2,SD1:13.2,SD2:14.4,SD3:15.7},
  "87.5": { SD3neg:9.7, SD2neg:10.5,SD1neg:11.3,median:12.3,SD1:13.3,SD2:14.5,SD3:15.8},
  "88.0": { SD3neg:9.8, SD2neg:10.6,SD1neg:11.5,median:12.4,SD1:13.5,SD2:14.7,SD3:16.0},
  "88.5": { SD3neg:9.9, SD2neg:10.7,SD1neg:11.6,median:12.5,SD1:13.6,SD2:14.8,SD3:16.1},
  "89.0": { SD3neg:10.0,SD2neg:10.8,SD1neg:11.7,median:12.6,SD1:13.7,SD2:14.9,SD3:16.3},
  "89.5": { SD3neg:10.1,SD2neg:10.9,SD1neg:11.8,median:12.8,SD1:13.9,SD2:15.1,SD3:16.4},
  "90.0": { SD3neg:10.2,SD2neg:11.0,SD1neg:11.9,median:12.9,SD1:14.0,SD2:15.2,SD3:16.6},
  "90.5": { SD3neg:10.3,SD2neg:11.1,SD1neg:12.0,median:13.0,SD1:14.1,SD2:15.3,SD3:16.7},
  "91.0": { SD3neg:10.4,SD2neg:11.2,SD1neg:12.1,median:13.1,SD1:14.2,SD2:15.5,SD3:16.9},
  "91.5": { SD3neg:10.5,SD2neg:11.3,SD1neg:12.2,median:13.2,SD1:14.4,SD2:15.6,SD3:17.0},
  "92.0": { SD3neg:10.6,SD2neg:11.4,SD1neg:12.3,median:13.4,SD1:14.5,SD2:15.8,SD3:17.2},
  "92.5": { SD3neg:10.7,SD2neg:11.5,SD1neg:12.4,median:13.5,SD1:14.6,SD2:15.9,SD3:17.3},
  "93.0": { SD3neg:10.8,SD2neg:11.6,SD1neg:12.6,median:13.6,SD1:14.7,SD2:16.0,SD3:17.5},
  "93.5": { SD3neg:10.9,SD2neg:11.7,SD1neg:12.7,median:13.7,SD1:14.9,SD2:16.2,SD3:17.6},
  "94.0": { SD3neg:11.0,SD2neg:11.8,SD1neg:12.8,median:13.8,SD1:15.0,SD2:16.3,SD3:17.8},
  "94.5": { SD3neg:11.1,SD2neg:11.9,SD1neg:12.9,median:13.9,SD1:15.1,SD2:16.5,SD3:17.9},
  "95.0": { SD3neg:11.1,SD2neg:12.0,SD1neg:13.0,median:14.1,SD1:15.3,SD2:16.6,SD3:18.1},
  "95.5": { SD3neg:11.2,SD2neg:12.1,SD1neg:13.1,median:14.2,SD1:15.4,SD2:16.7,SD3:18.3},
  "96.0": { SD3neg:11.3,SD2neg:12.2,SD1neg:13.2,median:14.3,SD1:15.5,SD2:16.9,SD3:18.4},
  "96.5": { SD3neg:11.4,SD2neg:12.3,SD1neg:13.3,median:14.4,SD1:15.7,SD2:17.0,SD3:18.6},
  "97.0": { SD3neg:11.5,SD2neg:12.4,SD1neg:13.4,median:14.6,SD1:15.8,SD2:17.2,SD3:18.8},
  "97.5": { SD3neg:11.6,SD2neg:12.5,SD1neg:13.6,median:14.7,SD1:15.9,SD2:17.4,SD3:18.9},
  "98.0": { SD3neg:11.7,SD2neg:12.6,SD1neg:13.7,median:14.8,SD1:16.1,SD2:17.5,SD3:19.1},
  "98.5": { SD3neg:11.8,SD2neg:12.8,SD1neg:13.8,median:14.9,SD1:16.2,SD2:17.7,SD3:19.3},
  "99.0": { SD3neg:11.9,SD2neg:12.9,SD1neg:13.9,median:15.1,SD1:16.4,SD2:17.9,SD3:19.5},
  "99.5": { SD3neg:12.0,SD2neg:13.0,SD1neg:14.0,median:15.2,SD1:16.5,SD2:18.0,SD3:19.7},
  "100.0":{ SD3neg:12.1,SD2neg:13.1,SD1neg:14.2,median:15.4,SD1:16.7,SD2:18.2,SD3:19.9},
  "100.5":{ SD3neg:12.2,SD2neg:13.2,SD1neg:14.3,median:15.5,SD1:16.9,SD2:18.4,SD3:20.1},
  "101.0":{ SD3neg:12.3,SD2neg:13.3,SD1neg:14.4,median:15.6,SD1:17.0,SD2:18.5,SD3:20.3},
  "101.5":{ SD3neg:12.4,SD2neg:13.4,SD1neg:14.5,median:15.8,SD1:17.2,SD2:18.7,SD3:20.5},
  "102.0":{ SD3neg:12.5,SD2neg:13.6,SD1neg:14.7,median:15.9,SD1:17.3,SD2:18.9,SD3:20.7},
  "102.5":{ SD3neg:12.6,SD2neg:13.7,SD1neg:14.8,median:16.1,SD1:17.5,SD2:19.1,SD3:20.9},
  "103.0":{ SD3neg:12.8,SD2neg:13.8,SD1neg:14.9,median:16.2,SD1:17.7,SD2:19.3,SD3:21.1},
  "103.5":{ SD3neg:12.9,SD2neg:13.9,SD1neg:15.1,median:16.4,SD1:17.8,SD2:19.5,SD3:21.3},
  "104.0":{ SD3neg:13.0,SD2neg:14.0,SD1neg:15.2,median:16.5,SD1:18.0,SD2:19.7,SD3:21.6},
  "104.5":{ SD3neg:13.1,SD2neg:14.2,SD1neg:15.4,median:16.7,SD1:18.2,SD2:19.9,SD3:21.8},
  "105.0":{ SD3neg:13.2,SD2neg:14.3,SD1neg:15.5,median:16.8,SD1:18.4,SD2:20.1,SD3:22.0},
  "105.5":{ SD3neg:13.3,SD2neg:14.4,SD1neg:15.6,median:17.0,SD1:18.5,SD2:20.3,SD3:22.2},
  "106.0":{ SD3neg:13.4,SD2neg:14.5,SD1neg:15.8,median:17.2,SD1:18.7,SD2:20.5,SD3:22.5},
  "106.5":{ SD3neg:13.5,SD2neg:14.7,SD1neg:15.9,median:17.3,SD1:18.9,SD2:20.7,SD3:22.7},
  "107.0":{ SD3neg:13.7,SD2neg:14.8,SD1neg:16.1,median:17.5,SD1:19.1,SD2:20.9,SD3:22.9},
  "107.5":{ SD3neg:13.8,SD2neg:14.9,SD1neg:16.2,median:17.7,SD1:19.3,SD2:21.1,SD3:23.2},
  "108.0":{ SD3neg:13.9,SD2neg:15.1,SD1neg:16.4,median:17.8,SD1:19.5,SD2:21.3,SD3:23.4},
  "108.5":{ SD3neg:14.0,SD2neg:15.2,SD1neg:16.5,median:18.0,SD1:19.7,SD2:21.5,SD3:23.7},
  "109.0":{ SD3neg:14.1,SD2neg:15.3,SD1neg:16.7,median:18.2,SD1:19.8,SD2:21.8,SD3:23.9},
  "109.5":{ SD3neg:14.3,SD2neg:15.5,SD1neg:16.8,median:18.3,SD1:20.0,SD2:22.0,SD3:24.2},
  "110.0":{ SD3neg:14.4,SD2neg:15.6,SD1neg:17.0,median:18.5,SD1:20.2,SD2:22.2,SD3:24.4},
  "110.5":{ SD3neg:14.5,SD2neg:15.8,SD1neg:17.1,median:18.7,SD1:20.4,SD2:22.4,SD3:24.7},
  "111.0":{ SD3neg:14.6,SD2neg:15.9,SD1neg:17.3,median:18.9,SD1:20.7,SD2:22.7,SD3:25.0},
  "111.5":{ SD3neg:14.8,SD2neg:16.0,SD1neg:17.5,median:19.1,SD1:20.9,SD2:22.9,SD3:25.2},
  "112.0":{ SD3neg:14.9,SD2neg:16.2,SD1neg:17.6,median:19.2,SD1:21.1,SD2:23.1,SD3:25.5},
  "112.5":{ SD3neg:15.0,SD2neg:16.3,SD1neg:17.8,median:19.4,SD1:21.3,SD2:23.4,SD3:25.8},
  "113.0":{ SD3neg:15.2,SD2neg:16.5,SD1neg:18.0,median:19.6,SD1:21.5,SD2:23.6,SD3:26.0},
  "113.5":{ SD3neg:15.3,SD2neg:16.6,SD1neg:18.1,median:19.8,SD1:21.7,SD2:23.9,SD3:26.3},
  "114.0":{ SD3neg:15.4,SD2neg:16.8,SD1neg:18.3,median:20.0,SD1:21.9,SD2:24.1,SD3:26.6},
  "114.5":{ SD3neg:15.6,SD2neg:16.9,SD1neg:18.5,median:20.2,SD1:22.1,SD2:24.4,SD3:26.9},
  "115.0":{ SD3neg:15.7,SD2neg:17.1,SD1neg:18.6,median:20.4,SD1:22.4,SD2:24.6,SD3:27.2},
  "115.5":{ SD3neg:15.8,SD2neg:17.2,SD1neg:18.8,median:20.6,SD1:22.6,SD2:24.9,SD3:27.5},
  "116.0":{ SD3neg:16.0,SD2neg:17.4,SD1neg:19.0,median:20.8,SD1:22.8,SD2:25.1,SD3:27.8},
  "116.5":{ SD3neg:16.1,SD2neg:17.5,SD1neg:19.2,median:21.0,SD1:23.0,SD2:25.4,SD3:28.0},
  "117.0":{ SD3neg:16.2,SD2neg:17.7,SD1neg:19.3,median:21.2,SD1:23.3,SD2:25.6,SD3:28.3},
  "117.5":{ SD3neg:16.4,SD2neg:17.9,SD1neg:19.5,median:21.4,SD1:23.5,SD2:25.9,SD3:28.6},
  "118.0":{ SD3neg:16.5,SD2neg:18.0,SD1neg:19.7,median:21.6,SD1:23.7,SD2:26.1,SD3:28.9},
  "118.5":{ SD3neg:16.7,SD2neg:18.2,SD1neg:19.9,median:21.8,SD1:23.9,SD2:26.4,SD3:29.2},
  "119.0":{ SD3neg:16.8,SD2neg:18.3,SD1neg:20.0,median:22.0,SD1:24.1,SD2:26.6,SD3:29.5},
  "119.5":{ SD3neg:16.9,SD2neg:18.5,SD1neg:20.2,median:22.2,SD1:24.4,SD2:26.9,SD3:29.8},
  "120.0":{ SD3neg:17.1,SD2neg:18.6,SD1neg:20.4,median:22.4,SD1:24.6,SD2:27.2,SD3:30.1}
};

const imtu_laki_0_24 = {
  0:  { SD3neg:10.2,SD2neg:11.1,SD1neg:12.2,median:13.4,SD1:14.8,SD2:16.3,SD3:18.1},
  1:  { SD3neg:11.3,SD2neg:12.4,SD1neg:13.6,median:14.9,SD1:16.3,SD2:17.8,SD3:19.4},
  2:  { SD3neg:12.5,SD2neg:13.7,SD1neg:15.0,median:16.3,SD1:17.8,SD2:19.4,SD3:21.1},
  3:  { SD3neg:13.1,SD2neg:14.3,SD1neg:15.5,median:16.9,SD1:18.4,SD2:20.0,SD3:21.8},
  4:  { SD3neg:13.4,SD2neg:14.5,SD1neg:15.8,median:17.2,SD1:18.7,SD2:20.3,SD3:22.1},
  5:  { SD3neg:13.5,SD2neg:14.7,SD1neg:15.9,median:17.3,SD1:18.8,SD2:20.5,SD3:22.3},
  6:  { SD3neg:13.6,SD2neg:14.7,SD1neg:16.0,median:17.3,SD1:18.8,SD2:20.5,SD3:22.3},
  7:  { SD3neg:13.7,SD2neg:14.8,SD1neg:16.0,median:17.3,SD1:18.8,SD2:20.5,SD3:22.3},
  8:  { SD3neg:13.6,SD2neg:14.7,SD1neg:15.9,median:17.3,SD1:18.7,SD2:20.4,SD3:22.2},
  9:  { SD3neg:13.6,SD2neg:14.7,SD1neg:15.8,median:17.2,SD1:18.6,SD2:20.3,SD3:22.1},
  10: { SD3neg:13.5,SD2neg:14.6,SD1neg:15.7,median:17.0,SD1:18.5,SD2:20.1,SD3:22.0},
  11: { SD3neg:13.4,SD2neg:14.5,SD1neg:15.6,median:16.9,SD1:18.4,SD2:20.0,SD3:21.8},
  12: { SD3neg:13.4,SD2neg:14.4,SD1neg:15.5,median:16.8,SD1:18.2,SD2:19.8,SD3:21.6},
  13: { SD3neg:13.3,SD2neg:14.3,SD1neg:15.4,median:16.7,SD1:18.1,SD2:19.7,SD3:21.5},
  14: { SD3neg:13.2,SD2neg:14.2,SD1neg:15.3,median:16.6,SD1:18.0,SD2:19.5,SD3:21.3},
  15: { SD3neg:13.1,SD2neg:14.1,SD1neg:15.2,median:16.4,SD1:17.8,SD2:19.4,SD3:21.2},
  16: { SD3neg:13.1,SD2neg:14.0,SD1neg:15.1,median:16.3,SD1:17.7,SD2:19.3,SD3:21.0},
  17: { SD3neg:13.0,SD2neg:13.9,SD1neg:15.0,median:16.2,SD1:17.6,SD2:19.1,SD3:20.9},
  18: { SD3neg:12.9,SD2neg:13.9,SD1neg:14.9,median:16.1,SD1:17.5,SD2:19.0,SD3:20.8},
  19: { SD3neg:12.9,SD2neg:13.8,SD1neg:14.9,median:16.1,SD1:17.4,SD2:18.9,SD3:20.7},
  20: { SD3neg:12.8,SD2neg:13.7,SD1neg:14.8,median:16.0,SD1:17.3,SD2:18.8,SD3:20.6},
  21: { SD3neg:12.8,SD2neg:13.7,SD1neg:14.7,median:15.9,SD1:17.2,SD2:18.7,SD3:20.5},
  22: { SD3neg:12.7,SD2neg:13.6,SD1neg:14.7,median:15.8,SD1:17.2,SD2:18.7,SD3:20.4},
  23: { SD3neg:12.7,SD2neg:13.6,SD1neg:14.6,median:15.8,SD1:17.1,SD2:18.6,SD3:20.3},
  24: { SD3neg:12.7,SD2neg:13.6,SD1neg:14.6,median:15.7,SD1:17.0,SD2:18.5,SD3:20.3}
};

const imtu_laki_24_60 = {
  24: { SD3neg:12.9,SD2neg:13.8,SD1neg:14.8,median:16.0,SD1:17.3,SD2:18.9,SD3:20.6},
  25: { SD3neg:12.8,SD2neg:13.8,SD1neg:14.8,median:16.0,SD1:17.3,SD2:18.8,SD3:20.5},
  26: { SD3neg:12.8,SD2neg:13.7,SD1neg:14.8,median:15.9,SD1:17.3,SD2:18.8,SD3:20.5},
  27: { SD3neg:12.7,SD2neg:13.7,SD1neg:14.7,median:15.9,SD1:17.2,SD2:18.7,SD3:20.4},
  28: { SD3neg:12.7,SD2neg:13.6,SD1neg:14.7,median:15.9,SD1:17.2,SD2:18.7,SD3:20.4},
  29: { SD3neg:12.7,SD2neg:13.6,SD1neg:14.7,median:15.8,SD1:17.1,SD2:18.6,SD3:20.3},
  30: { SD3neg:12.6,SD2neg:13.6,SD1neg:14.6,median:15.8,SD1:17.1,SD2:18.6,SD3:20.2},
  31: { SD3neg:12.6,SD2neg:13.5,SD1neg:14.6,median:15.8,SD1:17.1,SD2:18.5,SD3:20.2},
  32: { SD3neg:12.5,SD2neg:13.5,SD1neg:14.6,median:15.7,SD1:17.0,SD2:18.5,SD3:20.1},
  33: { SD3neg:12.5,SD2neg:13.5,SD1neg:14.5,median:15.7,SD1:17.0,SD2:18.5,SD3:20.1},
  34: { SD3neg:12.5,SD2neg:13.4,SD1neg:14.5,median:15.7,SD1:17.0,SD2:18.4,SD3:20.0},
  35: { SD3neg:12.4,SD2neg:13.4,SD1neg:14.5,median:15.6,SD1:16.9,SD2:18.4,SD3:20.0},
  36: { SD3neg:12.4,SD2neg:13.4,SD1neg:14.4,median:15.6,SD1:16.9,SD2:18.4,SD3:20.0},
  37: { SD3neg:12.4,SD2neg:13.3,SD1neg:14.4,median:15.6,SD1:16.9,SD2:18.3,SD3:19.9},
  38: { SD3neg:12.3,SD2neg:13.3,SD1neg:14.4,median:15.5,SD1:16.8,SD2:18.3,SD3:19.9},
  39: { SD3neg:12.3,SD2neg:13.3,SD1neg:14.3,median:15.5,SD1:16.8,SD2:18.3,SD3:19.9},
  40: { SD3neg:12.3,SD2neg:13.2,SD1neg:14.3,median:15.5,SD1:16.8,SD2:18.2,SD3:19.9},
  41: { SD3neg:12.2,SD2neg:13.2,SD1neg:14.3,median:15.5,SD1:16.8,SD2:18.2,SD3:19.9},
  42: { SD3neg:12.2,SD2neg:13.2,SD1neg:14.3,median:15.4,SD1:16.8,SD2:18.2,SD3:19.8},
  43: { SD3neg:12.2,SD2neg:13.2,SD1neg:14.2,median:15.4,SD1:16.7,SD2:18.2,SD3:19.8},
  44: { SD3neg:12.2,SD2neg:13.1,SD1neg:14.2,median:15.4,SD1:16.7,SD2:18.2,SD3:19.8},
  45: { SD3neg:12.2,SD2neg:13.1,SD1neg:14.2,median:15.4,SD1:16.7,SD2:18.2,SD3:19.8},
  46: { SD3neg:12.1,SD2neg:13.1,SD1neg:14.2,median:15.4,SD1:16.7,SD2:18.2,SD3:19.8},
  47: { SD3neg:12.1,SD2neg:13.1,SD1neg:14.2,median:15.3,SD1:16.7,SD2:18.2,SD3:19.9},
  48: { SD3neg:12.1,SD2neg:13.1,SD1neg:14.1,median:15.3,SD1:16.7,SD2:18.2,SD3:19.9},
  49: { SD3neg:12.1,SD2neg:13.0,SD1neg:14.1,median:15.3,SD1:16.7,SD2:18.2,SD3:19.9},
  50: { SD3neg:12.1,SD2neg:13.0,SD1neg:14.1,median:15.3,SD1:16.7,SD2:18.2,SD3:19.9},
  51: { SD3neg:12.1,SD2neg:13.0,SD1neg:14.1,median:15.3,SD1:16.6,SD2:18.2,SD3:19.9},
  52: { SD3neg:12.0,SD2neg:13.0,SD1neg:14.1,median:15.3,SD1:16.6,SD2:18.2,SD3:19.9},
  53: { SD3neg:12.0,SD2neg:13.0,SD1neg:14.1,median:15.3,SD1:16.6,SD2:18.2,SD3:20.0},
  54: { SD3neg:12.0,SD2neg:13.0,SD1neg:14.0,median:15.3,SD1:16.6,SD2:18.2,SD3:20.0},
  55: { SD3neg:12.0,SD2neg:13.0,SD1neg:14.0,median:15.2,SD1:16.6,SD2:18.2,SD3:20.0},
  56: { SD3neg:12.0,SD2neg:12.9,SD1neg:14.0,median:15.2,SD1:16.6,SD2:18.2,SD3:20.1},
  57: { SD3neg:12.0,SD2neg:12.9,SD1neg:14.0,median:15.2,SD1:16.6,SD2:18.2,SD3:20.1},
  58: { SD3neg:12.0,SD2neg:12.9,SD1neg:14.0,median:15.2,SD1:16.6,SD2:18.3,SD3:20.2},
  59: { SD3neg:12.0,SD2neg:12.9,SD1neg:14.0,median:15.2,SD1:16.6,SD2:18.3,SD3:20.2},
  60: { SD3neg:12.0,SD2neg:12.9,SD1neg:14.0,median:15.2,SD1:16.6,SD2:18.3,SD3:20.3}
};

const bbu_perempuan = {
  0:  { SD3neg:2.0, SD2neg:2.4, SD1neg:2.8, median:3.2, SD1:3.7, SD2:4.2, SD3:4.8 },
  1:  { SD3neg:2.7, SD2neg:3.2, SD1neg:3.6, median:4.2, SD1:4.8, SD2:5.5, SD3:6.2 },
  2:  { SD3neg:3.4, SD2neg:3.9, SD1neg:4.5, median:5.1, SD1:5.8, SD2:6.6, SD3:7.5 },
  3:  { SD3neg:4.0, SD2neg:4.5, SD1neg:5.2, median:5.8, SD1:6.6, SD2:7.5, SD3:8.5 },
  4:  { SD3neg:4.4, SD2neg:5.0, SD1neg:5.7, median:6.4, SD1:7.3, SD2:8.2, SD3:9.3 },
  5:  { SD3neg:4.8, SD2neg:5.4, SD1neg:6.1, median:6.9, SD1:7.8, SD2:8.8, SD3:10.0},
  6:  { SD3neg:5.1, SD2neg:5.7, SD1neg:6.5, median:7.3, SD1:8.2, SD2:9.3, SD3:10.6},
  7:  { SD3neg:5.3, SD2neg:6.0, SD1neg:6.8, median:7.6, SD1:8.6, SD2:9.8, SD3:11.1},
  8:  { SD3neg:5.6, SD2neg:6.3, SD1neg:7.0, median:7.9, SD1:9.0, SD2:10.2,SD3:11.6},
  9:  { SD3neg:5.8, SD2neg:6.5, SD1neg:7.3, median:8.2, SD1:9.3, SD2:10.5,SD3:12.0},
  10: { SD3neg:5.9, SD2neg:6.7, SD1neg:7.5, median:8.5, SD1:9.6, SD2:10.9,SD3:12.4},
  11: { SD3neg:6.1, SD2neg:6.9, SD1neg:7.7, median:8.7, SD1:9.9, SD2:11.2,SD3:12.8},
  12: { SD3neg:6.3, SD2neg:7.0, SD1neg:7.9, median:8.9, SD1:10.1,SD2:11.5,SD3:13.1},
  13: { SD3neg:6.4, SD2neg:7.2, SD1neg:8.1, median:9.2, SD1:10.4,SD2:11.8,SD3:13.5},
  14: { SD3neg:6.6, SD2neg:7.4, SD1neg:8.3, median:9.4, SD1:10.6,SD2:12.1,SD3:13.8},
  15: { SD3neg:6.7, SD2neg:7.6, SD1neg:8.5, median:9.6, SD1:10.9,SD2:12.4,SD3:14.1},
  16: { SD3neg:6.9, SD2neg:7.7, SD1neg:8.7, median:9.8, SD1:11.1,SD2:12.6,SD3:14.5},
  17: { SD3neg:7.0, SD2neg:7.9, SD1neg:8.9, median:10.0,SD1:11.4,SD2:12.9,SD3:14.8},
  18: { SD3neg:7.2, SD2neg:8.1, SD1neg:9.1, median:10.2,SD1:11.6,SD2:13.2,SD3:15.1},
  19: { SD3neg:7.3, SD2neg:8.2, SD1neg:9.2, median:10.4,SD1:11.8,SD2:13.5,SD3:15.4},
  20: { SD3neg:7.5, SD2neg:8.4, SD1neg:9.4, median:10.6,SD1:12.1,SD2:13.7,SD3:15.7},
  21: { SD3neg:7.6, SD2neg:8.6, SD1neg:9.6, median:10.9,SD1:12.3,SD2:14.0,SD3:16.0},
  22: { SD3neg:7.8, SD2neg:8.7, SD1neg:9.8, median:11.1,SD1:12.5,SD2:14.3,SD3:16.4},
  23: { SD3neg:7.9, SD2neg:8.9, SD1neg:10.0,median:11.3,SD1:12.8,SD2:14.6,SD3:16.7},
  24: { SD3neg:8.1, SD2neg:9.0, SD1neg:10.2,median:11.5,SD1:13.0,SD2:14.8,SD3:17.0},
  25: { SD3neg:8.2, SD2neg:9.2, SD1neg:10.3,median:11.7,SD1:13.3,SD2:15.1,SD3:17.3},
  26: { SD3neg:8.4, SD2neg:9.4, SD1neg:10.5,median:11.9,SD1:13.5,SD2:15.4,SD3:17.7},
  27: { SD3neg:8.5, SD2neg:9.5, SD1neg:10.7,median:12.1,SD1:13.7,SD2:15.7,SD3:18.0},
  28: { SD3neg:8.6, SD2neg:9.7, SD1neg:10.9,median:12.3,SD1:14.0,SD2:16.0,SD3:18.3},
  29: { SD3neg:8.8, SD2neg:9.8, SD1neg:11.1,median:12.5,SD1:14.2,SD2:16.2,SD3:18.7},
  30: { SD3neg:8.9, SD2neg:10.0,SD1neg:11.2,median:12.7,SD1:14.4,SD2:16.5,SD3:19.0},
  31: { SD3neg:9.0, SD2neg:10.1,SD1neg:11.4,median:12.9,SD1:14.7,SD2:16.8,SD3:19.3},
  32: { SD3neg:9.1, SD2neg:10.3,SD1neg:11.6,median:13.1,SD1:14.9,SD2:17.1,SD3:19.6},
  33: { SD3neg:9.3, SD2neg:10.4,SD1neg:11.7,median:13.3,SD1:15.1,SD2:17.3,SD3:20.0},
  34: { SD3neg:9.4, SD2neg:10.5,SD1neg:11.9,median:13.5,SD1:15.4,SD2:17.6,SD3:20.3},
  35: { SD3neg:9.5, SD2neg:10.7,SD1neg:12.0,median:13.7,SD1:15.6,SD2:17.9,SD3:20.6},
  36: { SD3neg:9.6, SD2neg:10.8,SD1neg:12.2,median:13.9,SD1:15.8,SD2:18.1,SD3:20.9},
  37: { SD3neg:9.7, SD2neg:10.9,SD1neg:12.4,median:14.0,SD1:16.0,SD2:18.4,SD3:21.3},
  38: { SD3neg:9.8, SD2neg:11.1,SD1neg:12.5,median:14.2,SD1:16.3,SD2:18.7,SD3:21.6},
  39: { SD3neg:9.9, SD2neg:11.2,SD1neg:12.7,median:14.4,SD1:16.5,SD2:19.0,SD3:22.0},
  40: { SD3neg:10.1,SD2neg:11.3,SD1neg:12.8,median:14.6,SD1:16.7,SD2:19.2,SD3:22.3},
  41: { SD3neg:10.2,SD2neg:11.5,SD1neg:13.0,median:14.8,SD1:16.9,SD2:19.5,SD3:22.7},
  42: { SD3neg:10.3,SD2neg:11.6,SD1neg:13.1,median:15.0,SD1:17.2,SD2:19.8,SD3:23.0},
  43: { SD3neg:10.4,SD2neg:11.7,SD1neg:13.3,median:15.2,SD1:17.4,SD2:20.1,SD3:23.4},
  44: { SD3neg:10.5,SD2neg:11.8,SD1neg:13.4,median:15.3,SD1:17.6,SD2:20.4,SD3:23.7},
  45: { SD3neg:10.6,SD2neg:12.0,SD1neg:13.6,median:15.5,SD1:17.8,SD2:20.7,SD3:24.1},
  46: { SD3neg:10.7,SD2neg:12.1,SD1neg:13.7,median:15.7,SD1:18.1,SD2:20.9,SD3:24.5},
  47: { SD3neg:10.8,SD2neg:12.2,SD1neg:13.9,median:15.9,SD1:18.3,SD2:21.2,SD3:24.8},
  48: { SD3neg:10.9,SD2neg:12.3,SD1neg:14.0,median:16.1,SD1:18.5,SD2:21.5,SD3:25.2},
  49: { SD3neg:11.0,SD2neg:12.4,SD1neg:14.2,median:16.3,SD1:18.8,SD2:21.8,SD3:25.5},
  50: { SD3neg:11.1,SD2neg:12.6,SD1neg:14.3,median:16.4,SD1:19.0,SD2:22.1,SD3:25.9},
  51: { SD3neg:11.2,SD2neg:12.7,SD1neg:14.5,median:16.6,SD1:19.2,SD2:22.4,SD3:26.3},
  52: { SD3neg:11.3,SD2neg:12.8,SD1neg:14.6,median:16.8,SD1:19.4,SD2:22.6,SD3:26.6},
  53: { SD3neg:11.4,SD2neg:12.9,SD1neg:14.8,median:17.0,SD1:19.7,SD2:22.9,SD3:27.0},
  54: { SD3neg:11.5,SD2neg:13.0,SD1neg:14.9,median:17.2,SD1:19.9,SD2:23.2,SD3:27.4},
  55: { SD3neg:11.6,SD2neg:13.2,SD1neg:15.1,median:17.3,SD1:20.1,SD2:23.5,SD3:27.7},
  56: { SD3neg:11.7,SD2neg:13.3,SD1neg:15.2,median:17.5,SD1:20.3,SD2:23.8,SD3:28.1},
  57: { SD3neg:11.8,SD2neg:13.4,SD1neg:15.3,median:17.7,SD1:20.6,SD2:24.1,SD3:28.5},
  58: { SD3neg:11.9,SD2neg:13.5,SD1neg:15.5,median:17.9,SD1:20.8,SD2:24.4,SD3:28.8},
  59: { SD3neg:12.0,SD2neg:13.6,SD1neg:15.6,median:18.0,SD1:21.0,SD2:24.6,SD3:29.2},
  60: { SD3neg:12.1,SD2neg:13.7,SD1neg:15.8,median:18.2,SD1:21.2,SD2:24.9,SD3:29.5}
};

const pbu_perempuan = {
  0:  { SD3neg:43.6,SD2neg:45.4,SD1neg:47.3,median:49.1,SD1:51.0,SD2:52.9,SD3:54.7},
  1:  { SD3neg:47.8,SD2neg:49.8,SD1neg:51.7,median:53.7,SD1:55.6,SD2:57.6,SD3:59.5},
  2:  { SD3neg:51.0,SD2neg:53.0,SD1neg:55.0,median:57.1,SD1:59.1,SD2:61.1,SD3:63.2},
  3:  { SD3neg:53.5,SD2neg:55.6,SD1neg:57.7,median:59.8,SD1:61.9,SD2:64.0,SD3:66.1},
  4:  { SD3neg:55.6,SD2neg:57.8,SD1neg:59.9,median:62.1,SD1:64.3,SD2:66.4,SD3:68.6},
  5:  { SD3neg:57.4,SD2neg:59.6,SD1neg:61.8,median:64.0,SD1:66.2,SD2:68.5,SD3:70.7},
  6:  { SD3neg:58.9,SD2neg:61.2,SD1neg:63.5,median:65.7,SD1:68.0,SD2:70.3,SD3:72.5},
  7:  { SD3neg:60.3,SD2neg:62.7,SD1neg:65.0,median:67.3,SD1:69.6,SD2:71.9,SD3:74.2},
  8:  { SD3neg:61.7,SD2neg:64.0,SD1neg:66.4,median:68.7,SD1:71.1,SD2:73.5,SD3:75.8},
  9:  { SD3neg:62.9,SD2neg:65.3,SD1neg:67.7,median:70.1,SD1:72.6,SD2:75.0,SD3:77.4},
  10: { SD3neg:64.1,SD2neg:66.5,SD1neg:69.0,median:71.5,SD1:73.9,SD2:76.4,SD3:78.9},
  11: { SD3neg:65.2,SD2neg:67.7,SD1neg:70.3,median:72.8,SD1:75.3,SD2:77.8,SD3:80.3},
  12: { SD3neg:66.3,SD2neg:68.9,SD1neg:71.4,median:74.0,SD1:76.6,SD2:79.2,SD3:81.7},
  13: { SD3neg:67.3,SD2neg:70.0,SD1neg:72.6,median:75.2,SD1:77.8,SD2:80.5,SD3:83.1},
  14: { SD3neg:68.3,SD2neg:71.0,SD1neg:73.7,median:76.4,SD1:79.1,SD2:81.7,SD3:84.4},
  15: { SD3neg:69.3,SD2neg:72.0,SD1neg:74.8,median:77.5,SD1:80.2,SD2:83.0,SD3:85.7},
  16: { SD3neg:70.2,SD2neg:73.0,SD1neg:75.8,median:78.6,SD1:81.4,SD2:84.2,SD3:87.0},
  17: { SD3neg:71.1,SD2neg:74.0,SD1neg:76.8,median:79.7,SD1:82.5,SD2:85.4,SD3:88.2},
  18: { SD3neg:72.0,SD2neg:74.9,SD1neg:77.8,median:80.7,SD1:83.6,SD2:86.5,SD3:89.4},
  19: { SD3neg:72.8,SD2neg:75.8,SD1neg:78.8,median:81.7,SD1:84.7,SD2:87.6,SD3:90.6},
  20: { SD3neg:73.7,SD2neg:76.7,SD1neg:79.7,median:82.7,SD1:85.7,SD2:88.7,SD3:91.7},
  21: { SD3neg:74.5,SD2neg:77.5,SD1neg:80.6,median:83.7,SD1:86.7,SD2:89.8,SD3:92.9},
  22: { SD3neg:75.2,SD2neg:78.4,SD1neg:81.5,median:84.6,SD1:87.7,SD2:90.8,SD3:94.0},
  23: { SD3neg:76.0,SD2neg:79.2,SD1neg:82.3,median:85.5,SD1:88.7,SD2:91.9,SD3:95.0},
  24: { SD3neg:76.7,SD2neg:80.0,SD1neg:83.2,median:86.4,SD1:89.6,SD2:92.9,SD3:96.1}
};

const tbu_perempuan = {
  24: { SD3neg:76.0,SD2neg:79.3,SD1neg:82.5,median:85.7,SD1:88.9,SD2:92.2,SD3:95.4},
  25: { SD3neg:76.8,SD2neg:80.0,SD1neg:83.3,median:86.6,SD1:89.9,SD2:93.1,SD3:96.4},
  26: { SD3neg:77.5,SD2neg:80.8,SD1neg:84.1,median:87.4,SD1:90.8,SD2:94.1,SD3:97.4},
  27: { SD3neg:78.1,SD2neg:81.5,SD1neg:84.9,median:88.3,SD1:91.7,SD2:95.0,SD3:98.4},
  28: { SD3neg:78.8,SD2neg:82.2,SD1neg:85.7,median:89.1,SD1:92.5,SD2:96.0,SD3:99.4},
  29: { SD3neg:79.5,SD2neg:82.9,SD1neg:86.4,median:89.9,SD1:93.4,SD2:96.9,SD3:100.3},
  30: { SD3neg:80.1,SD2neg:83.6,SD1neg:87.1,median:90.7,SD1:94.2,SD2:97.7,SD3:101.3},
  31: { SD3neg:80.7,SD2neg:84.3,SD1neg:87.9,median:91.4,SD1:95.0,SD2:98.6,SD3:102.2},
  32: { SD3neg:81.3,SD2neg:84.9,SD1neg:88.6,median:92.2,SD1:95.8,SD2:99.4,SD3:103.1},
  33: { SD3neg:81.9,SD2neg:85.6,SD1neg:89.3,median:92.9,SD1:96.6,SD2:100.3,SD3:103.9},
  34: { SD3neg:82.5,SD2neg:86.2,SD1neg:89.9,median:93.6,SD1:97.4,SD2:101.1,SD3:104.8},
  35: { SD3neg:83.1,SD2neg:86.8,SD1neg:90.6,median:94.4,SD1:98.1,SD2:101.9,SD3:105.6},
  36: { SD3neg:83.6,SD2neg:87.4,SD1neg:91.2,median:95.1,SD1:98.9,SD2:102.7,SD3:106.5},
  37: { SD3neg:84.2,SD2neg:88.0,SD1neg:91.9,median:95.7,SD1:99.6,SD2:103.4,SD3:107.3},
  38: { SD3neg:84.7,SD2neg:88.6,SD1neg:92.5,median:96.4,SD1:100.3,SD2:104.2,SD3:108.1},
  39: { SD3neg:85.3,SD2neg:89.2,SD1neg:93.1,median:97.1,SD1:101.0,SD2:105.0,SD3:108.9},
  40: { SD3neg:85.8,SD2neg:89.8,SD1neg:93.8,median:97.7,SD1:101.7,SD2:105.7,SD3:109.7},
  41: { SD3neg:86.3,SD2neg:90.4,SD1neg:94.4,median:98.4,SD1:102.4,SD2:106.4,SD3:110.5},
  42: { SD3neg:86.8,SD2neg:90.9,SD1neg:95.0,median:99.0,SD1:103.1,SD2:107.2,SD3:111.2},
  43: { SD3neg:87.4,SD2neg:91.5,SD1neg:95.6,median:99.7,SD1:103.8,SD2:107.9,SD3:112.0},
  44: { SD3neg:87.9,SD2neg:92.0,SD1neg:96.2,median:100.3,SD1:104.5,SD2:108.6,SD3:112.7},
  45: { SD3neg:88.4,SD2neg:92.5,SD1neg:96.7,median:100.9,SD1:105.1,SD2:109.3,SD3:113.5},
  46: { SD3neg:88.9,SD2neg:93.1,SD1neg:97.3,median:101.5,SD1:105.8,SD2:110.0,SD3:114.2},
  47: { SD3neg:89.3,SD2neg:93.6,SD1neg:97.9,median:102.1,SD1:106.4,SD2:110.7,SD3:114.9},
  48: { SD3neg:89.8,SD2neg:94.1,SD1neg:98.4,median:102.7,SD1:107.0,SD2:111.3,SD3:115.7},
  49: { SD3neg:90.3,SD2neg:94.6,SD1neg:99.0,median:103.3,SD1:107.7,SD2:112.0,SD3:116.4},
  50: { SD3neg:90.7,SD2neg:95.1,SD1neg:99.5,median:103.9,SD1:108.3,SD2:112.7,SD3:117.1},
  51: { SD3neg:91.2,SD2neg:95.6,SD1neg:100.1,median:104.5,SD1:108.9,SD2:113.3,SD3:117.7},
  52: { SD3neg:91.7,SD2neg:96.1,SD1neg:100.6,median:105.0,SD1:109.5,SD2:114.0,SD3:118.4},
  53: { SD3neg:92.1,SD2neg:96.6,SD1neg:101.1,median:105.6,SD1:110.1,SD2:114.6,SD3:119.1},
  54: { SD3neg:92.6,SD2neg:97.1,SD1neg:101.6,median:106.2,SD1:110.7,SD2:115.2,SD3:119.8},
  55: { SD3neg:93.0,SD2neg:97.6,SD1neg:102.2,median:106.7,SD1:111.3,SD2:115.9,SD3:120.4},
  56: { SD3neg:93.4,SD2neg:98.1,SD1neg:102.7,median:107.3,SD1:111.9,SD2:116.5,SD3:121.1},
  57: { SD3neg:93.9,SD2neg:98.5,SD1neg:103.2,median:107.8,SD1:112.5,SD2:117.1,SD3:121.8},
  58: { SD3neg:94.3,SD2neg:99.0,SD1neg:103.7,median:108.4,SD1:113.0,SD2:117.7,SD3:122.4},
  59: { SD3neg:94.7,SD2neg:99.5,SD1neg:104.2,median:108.9,SD1:113.6,SD2:118.3,SD3:123.1},
  60: { SD3neg:95.2,SD2neg:99.9,SD1neg:104.7,median:109.4,SD1:114.2,SD2:118.9,SD3:123.7}
};

const bbpb_perempuan = {
  "45.0": { SD3neg:1.9, SD2neg:2.1, SD1neg:2.3, median:2.5, SD1:2.7, SD2:3.0, SD3:3.3 },
  "45.5": { SD3neg:2.0, SD2neg:2.1, SD1neg:2.3, median:2.5, SD1:2.8, SD2:3.1, SD3:3.4 },
  "46.0": { SD3neg:2.0, SD2neg:2.2, SD1neg:2.4, median:2.6, SD1:2.9, SD2:3.2, SD3:3.5 },
  "46.5": { SD3neg:2.1, SD2neg:2.3, SD1neg:2.5, median:2.7, SD1:3.0, SD2:3.3, SD3:3.6 },
  "47.0": { SD3neg:2.2, SD2neg:2.4, SD1neg:2.6, median:2.8, SD1:3.1, SD2:3.4, SD3:3.7 },
  "47.5": { SD3neg:2.2, SD2neg:2.4, SD1neg:2.6, median:2.9, SD1:3.2, SD2:3.5, SD3:3.8 },
  "48.0": { SD3neg:2.3, SD2neg:2.5, SD1neg:2.7, median:3.0, SD1:3.3, SD2:3.6, SD3:4.0 },
  "48.5": { SD3neg:2.4, SD2neg:2.6, SD1neg:2.8, median:3.1, SD1:3.4, SD2:3.7, SD3:4.1 },
  "49.0": { SD3neg:2.4, SD2neg:2.6, SD1neg:2.9, median:3.2, SD1:3.5, SD2:3.8, SD3:4.2 },
  "49.5": { SD3neg:2.5, SD2neg:2.7, SD1neg:3.0, median:3.3, SD1:3.6, SD2:3.9, SD3:4.3 },
  "50.0": { SD3neg:2.6, SD2neg:2.8, SD1neg:3.1, median:3.4, SD1:3.7, SD2:4.0, SD3:4.5 },
  "50.5": { SD3neg:2.7, SD2neg:2.9, SD1neg:3.2, median:3.5, SD1:3.8, SD2:4.2, SD3:4.6 },
  "51.0": { SD3neg:2.8, SD2neg:3.0, SD1neg:3.3, median:3.6, SD1:3.9, SD2:4.3, SD3:4.8 },
  "51.5": { SD3neg:2.8, SD2neg:3.1, SD1neg:3.4, median:3.7, SD1:4.0, SD2:4.4, SD3:4.9 },
  "52.0": { SD3neg:2.9, SD2neg:3.2, SD1neg:3.5, median:3.8, SD1:4.2, SD2:4.6, SD3:5.1 },
  "52.5": { SD3neg:3.0, SD2neg:3.3, SD1neg:3.6, median:3.9, SD1:4.3, SD2:4.7, SD3:5.2 },
  "53.0": { SD3neg:3.1, SD2neg:3.4, SD1neg:3.7, median:4.0, SD1:4.4, SD2:4.9, SD3:5.4 },
  "53.5": { SD3neg:3.2, SD2neg:3.5, SD1neg:3.8, median:4.2, SD1:4.6, SD2:5.0, SD3:5.5 },
  "54.0": { SD3neg:3.3, SD2neg:3.6, SD1neg:3.9, median:4.3, SD1:4.7, SD2:5.2, SD3:5.7 },
  "54.5": { SD3neg:3.4, SD2neg:3.7, SD1neg:4.0, median:4.4, SD1:4.8, SD2:5.3, SD3:5.9 },
  "55.0": { SD3neg:3.5, SD2neg:3.8, SD1neg:4.2, median:4.5, SD1:5.0, SD2:5.5, SD3:6.1 },
  "55.5": { SD3neg:3.6, SD2neg:3.9, SD1neg:4.3, median:4.7, SD1:5.1, SD2:5.7, SD3:6.3 },
  "56.0": { SD3neg:3.7, SD2neg:4.0, SD1neg:4.4, median:4.8, SD1:5.3, SD2:5.8, SD3:6.4 },
  "56.5": { SD3neg:3.8, SD2neg:4.1, SD1neg:4.5, median:5.0, SD1:5.4, SD2:6.0, SD3:6.6 },
  "57.0": { SD3neg:3.9, SD2neg:4.3, SD1neg:4.6, median:5.1, SD1:5.6, SD2:6.1, SD3:6.8 },
  "57.5": { SD3neg:4.0, SD2neg:4.4, SD1neg:4.8, median:5.2, SD1:5.7, SD2:6.3, SD3:7.0 },
  "58.0": { SD3neg:4.1, SD2neg:4.5, SD1neg:4.9, median:5.4, SD1:5.9, SD2:6.5, SD3:7.1 },
  "58.5": { SD3neg:4.2, SD2neg:4.6, SD1neg:5.0, median:5.5, SD1:6.0, SD2:6.6, SD3:7.3 },
  "59.0": { SD3neg:4.3, SD2neg:4.7, SD1neg:5.1, median:5.6, SD1:6.2, SD2:6.8, SD3:7.5 },
  "59.5": { SD3neg:4.4, SD2neg:4.8, SD1neg:5.3, median:5.7, SD1:6.3, SD2:6.9, SD3:7.7 },
  "60.0": { SD3neg:4.5, SD2neg:4.9, SD1neg:5.4, median:5.9, SD1:6.4, SD2:7.1, SD3:7.8 },
  "60.5": { SD3neg:4.6, SD2neg:5.0, SD1neg:5.5, median:6.0, SD1:6.6, SD2:7.3, SD3:8.0 },
  "61.0": { SD3neg:4.7, SD2neg:5.1, SD1neg:5.6, median:6.1, SD1:6.7, SD2:7.4, SD3:8.2 },
  "61.5": { SD3neg:4.8, SD2neg:5.2, SD1neg:5.7, median:6.3, SD1:6.9, SD2:7.6, SD3:8.4 },
  "62.0": { SD3neg:4.9, SD2neg:5.3, SD1neg:5.8, median:6.4, SD1:7.0, SD2:7.7, SD3:8.5 },
  "62.5": { SD3neg:5.0, SD2neg:5.4, SD1neg:5.9, median:6.5, SD1:7.1, SD2:7.8, SD3:8.7 },
  "63.0": { SD3neg:5.1, SD2neg:5.5, SD1neg:6.0, median:6.6, SD1:7.3, SD2:8.0, SD3:8.8 },
  "63.5": { SD3neg:5.2, SD2neg:5.6, SD1neg:6.2, median:6.7, SD1:7.4, SD2:8.1, SD3:9.0 },
  "64.0": { SD3neg:5.3, SD2neg:5.7, SD1neg:6.3, median:6.9, SD1:7.5, SD2:8.3, SD3:9.1 },
  "64.5": { SD3neg:5.4, SD2neg:5.8, SD1neg:6.4, median:7.0, SD1:7.6, SD2:8.4, SD3:9.3 },
  "65.0": { SD3neg:5.5, SD2neg:5.9, SD1neg:6.5, median:7.1, SD1:7.8, SD2:8.6, SD3:9.5 },
  "65.5": { SD3neg:5.5, SD2neg:6.0, SD1neg:6.6, median:7.2, SD1:7.9, SD2:8.7, SD3:9.6 },
  "66.0": { SD3neg:5.6, SD2neg:6.1, SD1neg:6.7, median:7.3, SD1:8.0, SD2:8.8, SD3:9.8 },
  "66.5": { SD3neg:5.7, SD2neg:6.2, SD1neg:6.8, median:7.4, SD1:8.1, SD2:9.0, SD3:9.9 },
  "67.0": { SD3neg:5.8, SD2neg:6.3, SD1neg:6.9, median:7.5, SD1:8.3, SD2:9.1, SD3:10.0},
  "67.5": { SD3neg:5.9, SD2neg:6.4, SD1neg:7.0, median:7.6, SD1:8.4, SD2:9.2, SD3:10.2},
  "68.0": { SD3neg:6.0, SD2neg:6.5, SD1neg:7.1, median:7.7, SD1:8.5, SD2:9.4, SD3:10.3},
  "68.5": { SD3neg:6.1, SD2neg:6.6, SD1neg:7.2, median:7.9, SD1:8.6, SD2:9.5, SD3:10.5},
  "69.0": { SD3neg:6.1, SD2neg:6.7, SD1neg:7.3, median:8.0, SD1:8.7, SD2:9.6, SD3:10.6},
  "69.5": { SD3neg:6.2, SD2neg:6.8, SD1neg:7.4, median:8.1, SD1:8.8, SD2:9.7, SD3:10.7},
  "70.0": { SD3neg:6.3, SD2neg:6.9, SD1neg:7.5, median:8.2, SD1:9.0, SD2:9.9, SD3:10.9},
  "70.5": { SD3neg:6.4, SD2neg:6.9, SD1neg:7.6, median:8.3, SD1:9.1, SD2:10.0,SD3:11.0},
  "71.0": { SD3neg:6.5, SD2neg:7.0, SD1neg:7.7, median:8.4, SD1:9.2, SD2:10.1,SD3:11.1},
  "71.5": { SD3neg:6.5, SD2neg:7.1, SD1neg:7.7, median:8.5, SD1:9.3, SD2:10.2,SD3:11.3},
  "72.0": { SD3neg:6.6, SD2neg:7.2, SD1neg:7.8, median:8.6, SD1:9.4, SD2:10.3,SD3:11.4},
  "72.5": { SD3neg:6.7, SD2neg:7.3, SD1neg:7.9, median:8.7, SD1:9.5, SD2:10.5,SD3:11.5},
  "73.0": { SD3neg:6.8, SD2neg:7.4, SD1neg:8.0, median:8.8, SD1:9.6, SD2:10.6,SD3:11.7},
  "73.5": { SD3neg:6.9, SD2neg:7.4, SD1neg:8.1, median:8.9, SD1:9.7, SD2:10.7,SD3:11.8},
  "74.0": { SD3neg:6.9, SD2neg:7.5, SD1neg:8.2, median:9.0, SD1:9.8, SD2:10.8,SD3:11.9},
  "74.5": { SD3neg:7.0, SD2neg:7.6, SD1neg:8.3, median:9.1, SD1:9.9, SD2:10.9,SD3:12.0},
  "75.0": { SD3neg:7.1, SD2neg:7.7, SD1neg:8.4, median:9.1, SD1:10.0,SD2:11.0,SD3:12.2},
  "75.5": { SD3neg:7.1, SD2neg:7.8, SD1neg:8.5, median:9.2, SD1:10.1,SD2:11.1,SD3:12.3},
  "76.0": { SD3neg:7.2, SD2neg:7.8, SD1neg:8.5, median:9.3, SD1:10.2,SD2:11.2,SD3:12.4},
  "76.5": { SD3neg:7.3, SD2neg:7.9, SD1neg:8.6, median:9.4, SD1:10.3,SD2:11.4,SD3:12.5},
  "77.0": { SD3neg:7.4, SD2neg:8.0, SD1neg:8.7, median:9.5, SD1:10.4,SD2:11.5,SD3:12.6},
  "77.5": { SD3neg:7.4, SD2neg:8.1, SD1neg:8.8, median:9.6, SD1:10.5,SD2:11.6,SD3:12.8},
  "78.0": { SD3neg:7.5, SD2neg:8.2, SD1neg:8.9, median:9.7, SD1:10.6,SD2:11.7,SD3:12.9},
  "78.5": { SD3neg:7.6, SD2neg:8.2, SD1neg:9.0, median:9.8, SD1:10.7,SD2:11.8,SD3:13.0},
  "79.0": { SD3neg:7.7, SD2neg:8.3, SD1neg:9.1, median:9.9, SD1:10.8,SD2:11.9,SD3:13.1},
  "79.5": { SD3neg:7.7, SD2neg:8.4, SD1neg:9.1, median:10.0,SD1:10.9,SD2:12.0,SD3:13.3},
  "80.0": { SD3neg:7.8, SD2neg:8.5, SD1neg:9.2, median:10.1,SD1:11.0,SD2:12.1,SD3:13.4},
  "80.5": { SD3neg:7.9, SD2neg:8.6, SD1neg:9.3, median:10.2,SD1:11.2,SD2:12.3,SD3:13.5},
  "81.0": { SD3neg:8.0, SD2neg:8.7, SD1neg:9.4, median:10.3,SD1:11.3,SD2:12.4,SD3:13.7},
  "81.5": { SD3neg:8.1, SD2neg:8.8, SD1neg:9.5, median:10.4,SD1:11.4,SD2:12.5,SD3:13.8},
  "82.0": { SD3neg:8.1, SD2neg:8.8, SD1neg:9.6, median:10.5,SD1:11.5,SD2:12.6,SD3:13.9},
  "82.5": { SD3neg:8.2, SD2neg:8.9, SD1neg:9.7, median:10.6,SD1:11.6,SD2:12.8,SD3:14.1},
  "83.0": { SD3neg:8.3, SD2neg:9.0, SD1neg:9.8, median:10.7,SD1:11.8,SD2:12.9,SD3:14.2},
  "83.5": { SD3neg:8.4, SD2neg:9.1, SD1neg:9.9, median:10.9,SD1:11.9,SD2:13.1,SD3:14.4},
  "84.0": { SD3neg:8.5, SD2neg:9.2, SD1neg:10.1,median:11.0,SD1:12.0,SD2:13.2,SD3:14.5},
  "84.5": { SD3neg:8.6, SD2neg:9.3, SD1neg:10.2,median:11.1,SD1:12.1,SD2:13.3,SD3:14.7},
  "85.0": { SD3neg:8.7, SD2neg:9.4, SD1neg:10.3,median:11.2,SD1:12.3,SD2:13.5,SD3:14.9},
  "85.5": { SD3neg:8.8, SD2neg:9.5, SD1neg:10.4,median:11.3,SD1:12.4,SD2:13.6,SD3:15.0},
  "86.0": { SD3neg:8.9, SD2neg:9.7, SD1neg:10.5,median:11.5,SD1:12.6,SD2:13.8,SD3:15.2},
  "86.5": { SD3neg:9.0, SD2neg:9.8, SD1neg:10.6,median:11.6,SD1:12.7,SD2:13.9,SD3:15.4},
  "87.0": { SD3neg:9.1, SD2neg:9.9, SD1neg:10.7,median:11.7,SD1:12.8,SD2:14.1,SD3:15.5},
  "87.5": { SD3neg:9.2, SD2neg:10.0,SD1neg:10.9,median:11.8,SD1:13.0,SD2:14.2,SD3:15.7},
  "88.0": { SD3neg:9.3, SD2neg:10.1,SD1neg:11.0,median:12.0,SD1:13.1,SD2:14.4,SD3:15.9},
  "88.5": { SD3neg:9.4, SD2neg:10.2,SD1neg:11.1,median:12.1,SD1:13.2,SD2:14.5,SD3:16.0},
  "89.0": { SD3neg:9.5, SD2neg:10.3,SD1neg:11.2,median:12.2,SD1:13.4,SD2:14.7,SD3:16.2},
  "89.5": { SD3neg:9.6, SD2neg:10.4,SD1neg:11.3,median:12.3,SD1:13.5,SD2:14.8,SD3:16.4},
  "90.0": { SD3neg:9.7, SD2neg:10.5,SD1neg:11.4,median:12.5,SD1:13.7,SD2:15.0,SD3:16.5},
  "90.5": { SD3neg:9.8, SD2neg:10.6,SD1neg:11.5,median:12.6,SD1:13.8,SD2:15.1,SD3:16.7},
  "91.0": { SD3neg:9.9, SD2neg:10.9,SD1neg:11.8,median:12.9,SD1:14.1,SD2:15.5,SD3:17.1},
  "91.5": { SD3neg:10.0,SD2neg:11.0,SD1neg:11.9,median:13.0,SD1:14.2,SD2:15.6,SD3:17.2},
  "92.0": { SD3neg:10.1,SD2neg:11.1,SD1neg:12.0,median:13.1,SD1:14.4,SD2:15.8,SD3:17.4},
  "92.5": { SD3neg:10.2,SD2neg:11.2,SD1neg:12.1,median:13.3,SD1:14.5,SD2:15.9,SD3:17.5},
  "93.0": { SD3neg:10.3,SD2neg:11.3,SD1neg:12.2,median:13.4,SD1:14.7,SD2:16.1,SD3:17.7},
  "93.5": { SD3neg:10.4,SD2neg:11.4,SD1neg:12.4,median:13.5,SD1:14.8,SD2:16.2,SD3:17.8},
  "94.0": { SD3neg:10.5,SD2neg:11.5,SD1neg:12.5,median:13.6,SD1:14.9,SD2:16.4,SD3:18.0},
  "94.5": { SD3neg:10.6,SD2neg:11.6,SD1neg:12.6,median:13.8,SD1:15.1,SD2:16.5,SD3:18.1},
  "95.0": { SD3neg:10.7,SD2neg:11.7,SD1neg:12.7,median:13.9,SD1:15.2,SD2:16.7,SD3:18.3},
  "95.5": { SD3neg:10.8,SD2neg:11.8,SD1neg:12.8,median:14.0,SD1:15.4,SD2:16.8,SD3:18.5},
  "96.0": { SD3neg:10.9,SD2neg:11.9,SD1neg:12.9,median:14.2,SD1:15.5,SD2:17.0,SD3:18.6},
  "96.5": { SD3neg:11.0,SD2neg:12.0,SD1neg:13.0,median:14.3,SD1:15.6,SD2:17.1,SD3:18.8},
  "97.0": { SD3neg:11.1,SD2neg:12.1,SD1neg:13.1,median:14.4,SD1:15.8,SD2:17.3,SD3:18.9},
  "97.5": { SD3neg:11.2,SD2neg:12.2,SD1neg:13.3,median:14.5,SD1:15.9,SD2:17.4,SD3:19.1},
  "98.0": { SD3neg:11.3,SD2neg:12.3,SD1neg:13.4,median:14.7,SD1:16.1,SD2:17.6,SD3:19.3},
  "98.5": { SD3neg:11.4,SD2neg:12.4,SD1neg:13.5,median:14.8,SD1:16.2,SD2:17.7,SD3:19.4},
  "99.0": { SD3neg:11.5,SD2neg:12.5,SD1neg:13.6,median:14.9,SD1:16.4,SD2:17.9,SD3:19.6},
  "99.5": { SD3neg:11.6,SD2neg:12.6,SD1neg:13.7,median:15.1,SD1:16.5,SD2:18.1,SD3:19.8},
  "100.0":{ SD3neg:11.7,SD2neg:12.7,SD1neg:13.8,median:15.2,SD1:16.7,SD2:18.2,SD3:20.0},
  "100.5":{ SD3neg:11.8,SD2neg:12.8,SD1neg:14.0,median:15.3,SD1:16.8,SD2:18.4,SD3:20.1},
  "101.0":{ SD3neg:11.9,SD2neg:12.9,SD1neg:14.1,median:15.4,SD1:16.9,SD2:18.5,SD3:20.3},
  "101.5":{ SD3neg:12.0,SD2neg:13.0,SD1neg:14.2,median:15.6,SD1:17.1,SD2:18.7,SD3:20.5},
  "102.0":{ SD3neg:12.1,SD2neg:13.1,SD1neg:14.3,median:15.7,SD1:17.2,SD2:18.8,SD3:20.6},
  "102.5":{ SD3neg:12.2,SD2neg:13.2,SD1neg:14.4,median:15.8,SD1:17.4,SD2:19.0,SD3:20.8},
  "103.0":{ SD3neg:12.3,SD2neg:13.4,SD1neg:14.5,median:16.0,SD1:17.5,SD2:19.2,SD3:21.0},
  "103.5":{ SD3neg:12.4,SD2neg:13.5,SD1neg:14.6,median:16.1,SD1:17.6,SD2:19.3,SD3:21.2},
  "104.0":{ SD3neg:12.5,SD2neg:13.6,SD1neg:14.8,median:16.2,SD1:17.8,SD2:19.5,SD3:21.4},
  "104.5":{ SD3neg:12.6,SD2neg:13.7,SD1neg:14.9,median:16.4,SD1:17.9,SD2:19.6,SD3:21.5},
  "105.0":{ SD3neg:12.7,SD2neg:13.8,SD1neg:15.0,median:16.5,SD1:18.1,SD2:19.8,SD3:21.7},
  "105.5":{ SD3neg:12.8,SD2neg:13.9,SD1neg:15.1,median:16.6,SD1:18.2,SD2:20.0,SD3:21.9},
  "106.0":{ SD3neg:12.9,SD2neg:14.0,SD1neg:15.2,median:16.8,SD1:18.4,SD2:20.1,SD3:22.1},
  "106.5":{ SD3neg:13.0,SD2neg:14.1,SD1neg:15.3,median:16.9,SD1:18.5,SD2:20.3,SD3:22.3},
  "107.0":{ SD3neg:13.1,SD2neg:14.2,SD1neg:15.5,median:17.0,SD1:18.6,SD2:20.4,SD3:22.5},
  "107.5":{ SD3neg:13.2,SD2neg:14.3,SD1neg:15.6,median:17.2,SD1:18.8,SD2:20.6,SD3:22.6},
  "108.0":{ SD3neg:13.3,SD2neg:14.4,SD1neg:15.7,median:17.3,SD1:18.9,SD2:20.8,SD3:22.8},
  "108.5":{ SD3neg:13.4,SD2neg:14.6,SD1neg:15.8,median:17.4,SD1:19.1,SD2:20.9,SD3:23.0},
  "109.0":{ SD3neg:13.5,SD2neg:14.7,SD1neg:15.9,median:17.6,SD1:19.2,SD2:21.1,SD3:23.2},
  "109.5":{ SD3neg:13.6,SD2neg:14.8,SD1neg:16.1,median:17.7,SD1:19.4,SD2:21.2,SD3:23.4},
  "110.0":{ SD3neg:13.7,SD2neg:14.9,SD1neg:16.2,median:17.8,SD1:19.5,SD2:21.4,SD3:23.6}
};

const bbtb_perempuan = {
  "65.0": { SD3neg:5.6, SD2neg:6.1, SD1neg:6.6, median:7.2, SD1:7.9, SD2:8.7, SD3:9.7 },
  "65.5": { SD3neg:5.7, SD2neg:6.2, SD1neg:6.7, median:7.4, SD1:8.1, SD2:8.9, SD3:9.8 },
  "66.0": { SD3neg:5.8, SD2neg:6.3, SD1neg:6.8, median:7.5, SD1:8.2, SD2:9.0, SD3:9.9 },
  "66.5": { SD3neg:5.9, SD2neg:6.4, SD1neg:6.9, median:7.6, SD1:8.4, SD2:9.2, SD3:10.1},
  "67.0": { SD3neg:6.0, SD2neg:6.5, SD1neg:7.0, median:7.7, SD1:8.5, SD2:9.3, SD3:10.3},
  "67.5": { SD3neg:6.0, SD2neg:6.6, SD1neg:7.1, median:7.8, SD1:8.6, SD2:9.5, SD3:10.4},
  "68.0": { SD3neg:6.1, SD2neg:6.7, SD1neg:7.2, median:8.0, SD1:8.7, SD2:9.6, SD3:10.6},
  "68.5": { SD3neg:6.2, SD2neg:6.8, SD1neg:7.3, median:8.1, SD1:8.9, SD2:9.7, SD3:10.8},
  "69.0": { SD3neg:6.3, SD2neg:6.9, SD1neg:7.4, median:8.2, SD1:9.0, SD2:9.9, SD3:10.9},
  "69.5": { SD3neg:6.4, SD2neg:7.0, SD1neg:7.5, median:8.3, SD1:9.1, SD2:10.0,SD3:11.1},
  "70.0": { SD3neg:6.5, SD2neg:7.1, SD1neg:7.6, median:8.4, SD1:9.2, SD2:10.2,SD3:11.2},
  "70.5": { SD3neg:6.6, SD2neg:7.2, SD1neg:7.8, median:8.5, SD1:9.4, SD2:10.3,SD3:11.4},
  "71.0": { SD3neg:6.7, SD2neg:7.3, SD1neg:7.9, median:8.6, SD1:9.5, SD2:10.5,SD3:11.6},
  "71.5": { SD3neg:6.7, SD2neg:7.3, SD1neg:8.0, median:8.8, SD1:9.6, SD2:10.6,SD3:11.7},
  "72.0": { SD3neg:6.8, SD2neg:7.4, SD1neg:8.1, median:8.9, SD1:9.7, SD2:10.7,SD3:11.9},
  "72.5": { SD3neg:6.9, SD2neg:7.5, SD1neg:8.2, median:9.0, SD1:9.9, SD2:10.9,SD3:12.0},
  "73.0": { SD3neg:7.0, SD2neg:7.6, SD1neg:8.3, median:9.1, SD1:10.0,SD2:11.0,SD3:12.2},
  "73.5": { SD3neg:7.1, SD2neg:7.7, SD1neg:8.4, median:9.2, SD1:10.1,SD2:11.1,SD3:12.3},
  "74.0": { SD3neg:7.2, SD2neg:7.8, SD1neg:8.5, median:9.3, SD1:10.2,SD2:11.3,SD3:12.5},
  "74.5": { SD3neg:7.2, SD2neg:7.9, SD1neg:8.6, median:9.4, SD1:10.3,SD2:11.4,SD3:12.6},
  "75.0": { SD3neg:7.3, SD2neg:8.0, SD1neg:8.7, median:9.5, SD1:10.5,SD2:11.5,SD3:12.8},
  "75.5": { SD3neg:7.4, SD2neg:8.0, SD1neg:8.8, median:9.6, SD1:10.6,SD2:11.7,SD3:12.9},
  "76.0": { SD3neg:7.5, SD2neg:8.1, SD1neg:8.9, median:9.7, SD1:10.7,SD2:11.8,SD3:13.1},
  "76.5": { SD3neg:7.6, SD2neg:8.2, SD1neg:9.0, median:9.9, SD1:10.8,SD2:11.9,SD3:13.2},
  "77.0": { SD3neg:7.6, SD2neg:8.3, SD1neg:9.1, median:10.0,SD1:10.9,SD2:12.0,SD3:13.3},
  "77.5": { SD3neg:7.7, SD2neg:8.4, SD1neg:9.2, median:10.1,SD1:11.0,SD2:12.2,SD3:13.5},
  "78.0": { SD3neg:7.8, SD2neg:8.5, SD1neg:9.2, median:10.2,SD1:11.1,SD2:12.3,SD3:13.6},
  "78.5": { SD3neg:7.9, SD2neg:8.6, SD1neg:9.3, median:10.3,SD1:11.3,SD2:12.4,SD3:13.8},
  "79.0": { SD3neg:8.0, SD2neg:8.6, SD1neg:9.4, median:10.4,SD1:11.4,SD2:12.5,SD3:13.9},
  "79.5": { SD3neg:8.1, SD2neg:8.7, SD1neg:9.5, median:10.5,SD1:11.5,SD2:12.7,SD3:14.0},
  "80.0": { SD3neg:8.1, SD2neg:8.8, SD1neg:9.6, median:10.6,SD1:11.6,SD2:12.8,SD3:14.2},
  "80.5": { SD3neg:8.2, SD2neg:8.9, SD1neg:9.7, median:10.7,SD1:11.7,SD2:12.9,SD3:14.3},
  "81.0": { SD3neg:8.3, SD2neg:9.0, SD1neg:9.8, median:10.8,SD1:11.8,SD2:13.0,SD3:14.5},
  "81.5": { SD3neg:8.4, SD2neg:9.1, SD1neg:9.9, median:10.9,SD1:11.9,SD2:13.1,SD3:14.6},
  "82.0": { SD3neg:8.5, SD2neg:9.2, SD1neg:10.0,median:11.0,SD1:12.0,SD2:13.3,SD3:14.7},
  "82.5": { SD3neg:8.6, SD2neg:9.2, SD1neg:10.1,median:11.1,SD1:12.2,SD2:13.4,SD3:14.9},
  "83.0": { SD3neg:8.6, SD2neg:9.3, SD1neg:10.2,median:11.2,SD1:12.3,SD2:13.5,SD3:15.0},
  "83.5": { SD3neg:8.7, SD2neg:9.4, SD1neg:10.3,median:11.3,SD1:12.4,SD2:13.6,SD3:15.1},
  "84.0": { SD3neg:8.8, SD2neg:9.5, SD1neg:10.4,median:11.4,SD1:12.5,SD2:13.8,SD3:15.3},
  "84.5": { SD3neg:8.9, SD2neg:9.6, SD1neg:10.5,median:11.5,SD1:12.6,SD2:13.9,SD3:15.4},
  "85.0": { SD3neg:9.0, SD2neg:9.7, SD1neg:10.6,median:11.6,SD1:12.8,SD2:14.0,SD3:15.6},
  "85.5": { SD3neg:9.1, SD2neg:9.8, SD1neg:10.7,median:11.8,SD1:12.9,SD2:14.1,SD3:15.7},
  "86.0": { SD3neg:9.2, SD2neg:9.9, SD1neg:10.8,median:11.9,SD1:13.0,SD2:14.3,SD3:15.8},
  "86.5": { SD3neg:9.3, SD2neg:10.0,SD1neg:10.9,median:12.0,SD1:13.1,SD2:14.4,SD3:16.0},
  "87.0": { SD3neg:9.4, SD2neg:10.1,SD1neg:11.0,median:12.1,SD1:13.2,SD2:14.5,SD3:16.1},
  "87.5": { SD3neg:9.5, SD2neg:10.2,SD1neg:11.1,median:12.2,SD1:13.4,SD2:14.7,SD3:16.3},
  "88.0": { SD3neg:9.5, SD2neg:10.3,SD1neg:11.2,median:12.3,SD1:13.5,SD2:14.8,SD3:16.4},
  "88.5": { SD3neg:9.6, SD2neg:10.4,SD1neg:11.3,median:12.4,SD1:13.6,SD2:14.9,SD3:16.6},
  "89.0": { SD3neg:9.7, SD2neg:10.5,SD1neg:11.4,median:12.5,SD1:13.7,SD2:15.1,SD3:16.7},
  "89.5": { SD3neg:9.8, SD2neg:10.6,SD1neg:11.5,median:12.7,SD1:13.9,SD2:15.2,SD3:16.9},
  "90.0": { SD3neg:9.9, SD2neg:10.7,SD1neg:11.6,median:12.8,SD1:14.0,SD2:15.3,SD3:17.0},
  "90.5": { SD3neg:10.0,SD2neg:10.8,SD1neg:11.7,median:12.9,SD1:14.1,SD2:15.5,SD3:17.2},
  "91.0": { SD3neg:10.1,SD2neg:10.9,SD1neg:11.8,median:13.0,SD1:14.2,SD2:15.6,SD3:17.3},
  "91.5": { SD3neg:10.2,SD2neg:11.0,SD1neg:11.9,median:13.1,SD1:14.4,SD2:15.8,SD3:17.5},
  "92.0": { SD3neg:10.3,SD2neg:11.1,SD1neg:12.0,median:13.2,SD1:14.5,SD2:15.9,SD3:17.6},
  "92.5": { SD3neg:10.4,SD2neg:11.2,SD1neg:12.1,median:13.3,SD1:14.6,SD2:16.0,SD3:17.8},
  "93.0": { SD3neg:10.5,SD2neg:11.3,SD1neg:12.2,median:13.4,SD1:14.7,SD2:16.2,SD3:17.9},
  "93.5": { SD3neg:10.6,SD2neg:11.4,SD1neg:12.3,median:13.5,SD1:14.8,SD2:16.3,SD3:18.1},
  "94.0": { SD3neg:10.7,SD2neg:11.5,SD1neg:12.4,median:13.7,SD1:15.0,SD2:16.5,SD3:18.2},
  "94.5": { SD3neg:10.8,SD2neg:11.6,SD1neg:12.5,median:13.8,SD1:15.1,SD2:16.6,SD3:18.4},
  "95.0": { SD3neg:10.9,SD2neg:11.7,SD1neg:12.7,median:13.9,SD1:15.2,SD2:16.7,SD3:18.6},
  "95.5": { SD3neg:10.9,SD2neg:11.8,SD1neg:12.8,median:14.0,SD1:15.3,SD2:16.9,SD3:18.7},
  "96.0": { SD3neg:11.0,SD2neg:11.9,SD1neg:12.9,median:14.1,SD1:15.5,SD2:17.0,SD3:18.9},
  "96.5": { SD3neg:11.1,SD2neg:12.0,SD1neg:13.0,median:14.2,SD1:15.6,SD2:17.2,SD3:19.0},
  "97.0": { SD3neg:11.2,SD2neg:12.1,SD1neg:13.1,median:14.4,SD1:15.7,SD2:17.3,SD3:19.2},
  "97.5": { SD3neg:11.3,SD2neg:12.2,SD1neg:13.2,median:14.5,SD1:15.9,SD2:17.5,SD3:19.3},
  "98.0": { SD3neg:11.4,SD2neg:12.3,SD1neg:13.3,median:14.6,SD1:16.0,SD2:17.6,SD3:19.5},
  "98.5": { SD3neg:11.5,SD2neg:12.4,SD1neg:13.4,median:14.7,SD1:16.1,SD2:17.7,SD3:19.7},
  "99.0": { SD3neg:11.6,SD2neg:12.5,SD1neg:13.5,median:14.8,SD1:16.3,SD2:17.9,SD3:19.8},
  "99.5": { SD3neg:11.7,SD2neg:12.6,SD1neg:13.7,median:15.0,SD1:16.4,SD2:18.0,SD3:20.0},
  "100.0":{ SD3neg:11.8,SD2neg:12.7,SD1neg:13.8,median:15.1,SD1:16.5,SD2:18.2,SD3:20.1},
  "100.5":{ SD3neg:11.9,SD2neg:12.8,SD1neg:13.9,median:15.2,SD1:16.7,SD2:18.3,SD3:20.3},
  "101.0":{ SD3neg:12.0,SD2neg:13.0,SD1neg:14.0,median:15.3,SD1:16.8,SD2:18.5,SD3:20.5},
  "101.5":{ SD3neg:12.1,SD2neg:13.1,SD1neg:14.1,median:15.5,SD1:16.9,SD2:18.6,SD3:20.6},
  "102.0":{ SD3neg:12.2,SD2neg:13.2,SD1neg:14.3,median:15.6,SD1:17.1,SD2:18.8,SD3:20.8},
  "102.5":{ SD3neg:12.3,SD2neg:13.3,SD1neg:14.4,median:15.7,SD1:17.2,SD2:18.9,SD3:21.0},
  "103.0":{ SD3neg:12.4,SD2neg:13.4,SD1neg:14.5,median:15.8,SD1:17.4,SD2:19.1,SD3:21.1},
  "103.5":{ SD3neg:12.5,SD2neg:13.5,SD1neg:14.6,median:16.0,SD1:17.5,SD2:19.3,SD3:21.3},
  "104.0":{ SD3neg:12.6,SD2neg:13.6,SD1neg:14.8,median:16.1,SD1:17.6,SD2:19.4,SD3:21.5},
  "104.5":{ SD3neg:12.7,SD2neg:13.7,SD1neg:14.9,median:16.3,SD1:17.8,SD2:19.6,SD3:21.7},
  "105.0":{ SD3neg:12.8,SD2neg:13.9,SD1neg:15.0,median:16.4,SD1:17.9,SD2:19.7,SD3:21.9},
  "105.5":{ SD3neg:12.9,SD2neg:14.0,SD1neg:15.1,median:16.5,SD1:18.1,SD2:19.9,SD3:22.0},
  "106.0":{ SD3neg:13.0,SD2neg:14.1,SD1neg:15.3,median:16.7,SD1:18.2,SD2:20.1,SD3:22.2},
  "106.5":{ SD3neg:13.1,SD2neg:14.2,SD1neg:15.4,median:16.8,SD1:18.4,SD2:20.2,SD3:22.4},
  "107.0":{ SD3neg:13.2,SD2neg:14.3,SD1neg:15.5,median:16.9,SD1:18.5,SD2:20.4,SD3:22.6},
  "107.5":{ SD3neg:13.3,SD2neg:14.4,SD1neg:15.7,median:17.1,SD1:18.7,SD2:20.6,SD3:22.8},
  "108.0":{ SD3neg:13.4,SD2neg:14.6,SD1neg:15.8,median:17.2,SD1:18.8,SD2:20.7,SD3:23.0},
  "108.5":{ SD3neg:13.5,SD2neg:14.7,SD1neg:15.9,median:17.4,SD1:19.0,SD2:20.9,SD3:23.1},
  "109.0":{ SD3neg:13.6,SD2neg:14.8,SD1neg:16.1,median:17.5,SD1:19.1,SD2:21.1,SD3:23.3},
  "109.5":{ SD3neg:13.7,SD2neg:14.9,SD1neg:16.2,median:17.7,SD1:19.3,SD2:21.3,SD3:23.5},
  "110.0":{ SD3neg:13.9,SD2neg:15.0,SD1neg:16.3,median:17.8,SD1:19.5,SD2:21.4,SD3:23.7},
  "110.5":{ SD3neg:14.0,SD2neg:15.2,SD1neg:16.5,median:18.0,SD1:19.6,SD2:21.6,SD3:23.9},
  "111.0":{ SD3neg:14.1,SD2neg:15.3,SD1neg:16.6,median:18.1,SD1:19.8,SD2:21.8,SD3:24.1},
  "111.5":{ SD3neg:14.2,SD2neg:15.4,SD1neg:16.8,median:18.3,SD1:20.0,SD2:22.0,SD3:24.3},
  "112.0":{ SD3neg:14.3,SD2neg:15.5,SD1neg:16.9,median:18.4,SD1:20.1,SD2:22.2,SD3:24.5},
  "112.5":{ SD3neg:14.4,SD2neg:15.7,SD1neg:17.0,median:18.6,SD1:20.3,SD2:22.4,SD3:24.8},
  "113.0":{ SD3neg:14.5,SD2neg:15.8,SD1neg:17.2,median:18.7,SD1:20.5,SD2:22.6,SD3:25.0},
  "113.5":{ SD3neg:14.6,SD2neg:15.9,SD1neg:17.3,median:18.9,SD1:20.6,SD2:22.8,SD3:25.2},
  "114.0":{ SD3neg:14.8,SD2neg:16.0,SD1neg:17.5,median:19.1,SD1:20.8,SD2:23.0,SD3:25.4},
  "114.5":{ SD3neg:14.9,SD2neg:16.2,SD1neg:17.6,median:19.2,SD1:21.0,SD2:23.2,SD3:25.6},
  "115.0":{ SD3neg:15.0,SD2neg:16.3,SD1neg:17.8,median:19.4,SD1:21.2,SD2:23.4,SD3:25.9},
  "115.5":{ SD3neg:15.1,SD2neg:16.4,SD1neg:17.9,median:19.5,SD1:21.4,SD2:23.6,SD3:26.1},
  "116.0":{ SD3neg:15.2,SD2neg:16.6,SD1neg:18.1,median:19.7,SD1:21.5,SD2:23.8,SD3:26.3},
  "116.5":{ SD3neg:15.3,SD2neg:16.7,SD1neg:18.2,median:19.9,SD1:21.7,SD2:24.0,SD3:26.5},
  "117.0":{ SD3neg:15.4,SD2neg:16.8,SD1neg:18.4,median:20.0,SD1:21.9,SD2:24.2,SD3:26.8},
  "117.5":{ SD3neg:15.6,SD2neg:17.0,SD1neg:18.5,median:20.2,SD1:22.1,SD2:24.4,SD3:27.0},
  "118.0":{ SD3neg:15.7,SD2neg:17.1,SD1neg:18.7,median:20.4,SD1:22.3,SD2:24.6,SD3:27.2},
  "118.5":{ SD3neg:15.8,SD2neg:17.2,SD1neg:18.8,median:20.5,SD1:22.5,SD2:24.8,SD3:27.5},
  "119.0":{ SD3neg:15.9,SD2neg:17.4,SD1neg:19.0,median:20.7,SD1:22.7,SD2:25.0,SD3:27.7},
  "119.5":{ SD3neg:16.0,SD2neg:17.5,SD1neg:19.1,median:20.9,SD1:22.9,SD2:25.3,SD3:27.9},
  "120.0":{ SD3neg:16.2,SD2neg:17.6,SD1neg:19.3,median:21.1,SD1:23.1,SD2:25.5,SD3:28.2}
};

const imtu_perempuan_0_24 = {
  0:  { SD3neg:10.1,SD2neg:11.1,SD1neg:12.2,median:13.3,SD1:14.6,SD2:16.1,SD3:17.7},
  1:  { SD3neg:10.8,SD2neg:12.0,SD1neg:13.2,median:14.6,SD1:16.0,SD2:17.5,SD3:19.1},
  2:  { SD3neg:11.8,SD2neg:13.0,SD1neg:14.3,median:15.8,SD1:17.3,SD2:19.0,SD3:20.7},
  3:  { SD3neg:12.4,SD2neg:13.6,SD1neg:14.9,median:16.4,SD1:17.9,SD2:19.7,SD3:21.5},
  4:  { SD3neg:12.7,SD2neg:13.9,SD1neg:15.2,median:16.7,SD1:18.3,SD2:20.0,SD3:22.0},
  5:  { SD3neg:12.9,SD2neg:14.1,SD1neg:15.4,median:16.8,SD1:18.4,SD2:20.2,SD3:22.2},
  6:  { SD3neg:13.0,SD2neg:14.1,SD1neg:15.5,median:16.9,SD1:18.5,SD2:20.3,SD3:22.3},
  7:  { SD3neg:13.0,SD2neg:14.2,SD1neg:15.5,median:16.9,SD1:18.5,SD2:20.3,SD3:22.3},
  8:  { SD3neg:13.0,SD2neg:14.1,SD1neg:15.4,median:16.8,SD1:18.4,SD2:20.2,SD3:22.2},
  9:  { SD3neg:12.9,SD2neg:14.1,SD1neg:15.3,median:16.7,SD1:18.3,SD2:20.1,SD3:22.1},
  10: { SD3neg:12.9,SD2neg:14.0,SD1neg:15.2,median:16.6,SD1:18.2,SD2:19.9,SD3:21.9},
  11: { SD3neg:12.8,SD2neg:13.9,SD1neg:15.1,median:16.5,SD1:18.0,SD2:19.8,SD3:21.8},
  12: { SD3neg:12.7,SD2neg:13.8,SD1neg:15.0,median:16.4,SD1:17.9,SD2:19.6,SD3:21.6},
  13: { SD3neg:12.6,SD2neg:13.7,SD1neg:14.9,median:16.2,SD1:17.7,SD2:19.5,SD3:21.4},
  14: { SD3neg:12.6,SD2neg:13.6,SD1neg:14.8,median:16.1,SD1:17.6,SD2:19.3,SD3:21.3},
  15: { SD3neg:12.5,SD2neg:13.5,SD1neg:14.7,median:16.0,SD1:17.5,SD2:19.2,SD3:21.1},
  16: { SD3neg:12.4,SD2neg:13.5,SD1neg:14.6,median:15.9,SD1:17.4,SD2:19.1,SD3:21.0},
  17: { SD3neg:12.4,SD2neg:13.4,SD1neg:14.5,median:15.8,SD1:17.3,SD2:18.9,SD3:20.9},
  18: { SD3neg:12.3,SD2neg:13.3,SD1neg:14.4,median:15.7,SD1:17.2,SD2:18.8,SD3:20.8},
  19: { SD3neg:12.3,SD2neg:13.3,SD1neg:14.4,median:15.7,SD1:17.1,SD2:18.8,SD3:20.7},
  20: { SD3neg:12.2,SD2neg:13.2,SD1neg:14.3,median:15.6,SD1:17.0,SD2:18.7,SD3:20.6},
  21: { SD3neg:12.2,SD2neg:13.2,SD1neg:14.3,median:15.5,SD1:17.0,SD2:18.6,SD3:20.5},
  22: { SD3neg:12.2,SD2neg:13.1,SD1neg:14.2,median:15.5,SD1:16.9,SD2:18.5,SD3:20.4},
  23: { SD3neg:12.2,SD2neg:13.1,SD1neg:14.2,median:15.4,SD1:16.9,SD2:18.5,SD3:20.4},
  24: { SD3neg:12.1,SD2neg:13.1,SD1neg:14.2,median:15.4,SD1:16.8,SD2:18.4,SD3:20.3}
};

const imtu_perempuan_24_60 = {
  24: { SD3neg:12.4,SD2neg:13.3,SD1neg:14.4,median:15.7,SD1:17.1,SD2:18.7,SD3:20.6},
  25: { SD3neg:12.4,SD2neg:13.3,SD1neg:14.4,median:15.7,SD1:17.1,SD2:18.7,SD3:20.6},
  26: { SD3neg:12.3,SD2neg:13.3,SD1neg:14.4,median:15.6,SD1:17.0,SD2:18.7,SD3:20.6},
  27: { SD3neg:12.3,SD2neg:13.3,SD1neg:14.4,median:15.6,SD1:17.0,SD2:18.6,SD3:20.5},
  28: { SD3neg:12.3,SD2neg:13.3,SD1neg:14.3,median:15.6,SD1:17.0,SD2:18.6,SD3:20.5},
  29: { SD3neg:12.3,SD2neg:13.2,SD1neg:14.3,median:15.6,SD1:17.0,SD2:18.6,SD3:20.4},
  30: { SD3neg:12.3,SD2neg:13.2,SD1neg:14.3,median:15.5,SD1:16.9,SD2:18.5,SD3:20.4},
  31: { SD3neg:12.2,SD2neg:13.2,SD1neg:14.3,median:15.5,SD1:16.9,SD2:18.5,SD3:20.4},
  32: { SD3neg:12.2,SD2neg:13.2,SD1neg:14.3,median:15.5,SD1:16.9,SD2:18.5,SD3:20.4},
  33: { SD3neg:12.2,SD2neg:13.1,SD1neg:14.2,median:15.5,SD1:16.9,SD2:18.5,SD3:20.3},
  34: { SD3neg:12.2,SD2neg:13.1,SD1neg:14.2,median:15.4,SD1:16.8,SD2:18.5,SD3:20.3},
  35: { SD3neg:12.1,SD2neg:13.1,SD1neg:14.2,median:15.4,SD1:16.8,SD2:18.4,SD3:20.3},
  36: { SD3neg:12.1,SD2neg:13.1,SD1neg:14.2,median:15.4,SD1:16.8,SD2:18.4,SD3:20.3},
  37: { SD3neg:12.1,SD2neg:13.1,SD1neg:14.1,median:15.4,SD1:16.8,SD2:18.4,SD3:20.3},
  38: { SD3neg:12.1,SD2neg:13.0,SD1neg:14.1,median:15.4,SD1:16.8,SD2:18.4,SD3:20.3},
  39: { SD3neg:12.0,SD2neg:13.0,SD1neg:14.1,median:15.3,SD1:16.8,SD2:18.4,SD3:20.3},
  40: { SD3neg:12.0,SD2neg:13.0,SD1neg:14.1,median:15.3,SD1:16.8,SD2:18.4,SD3:20.3},
  41: { SD3neg:12.0,SD2neg:13.0,SD1neg:14.1,median:15.3,SD1:16.8,SD2:18.4,SD3:20.4},
  42: { SD3neg:12.0,SD2neg:12.9,SD1neg:14.0,median:15.3,SD1:16.8,SD2:18.4,SD3:20.4},
  43: { SD3neg:11.9,SD2neg:12.9,SD1neg:14.0,median:15.3,SD1:16.8,SD2:18.4,SD3:20.4},
  44: { SD3neg:11.9,SD2neg:12.9,SD1neg:14.0,median:15.3,SD1:16.8,SD2:18.5,SD3:20.4},
  45: { SD3neg:11.9,SD2neg:12.9,SD1neg:14.0,median:15.3,SD1:16.8,SD2:18.5,SD3:20.5},
  46: { SD3neg:11.9,SD2neg:12.9,SD1neg:14.0,median:15.3,SD1:16.8,SD2:18.5,SD3:20.5},
  47: { SD3neg:11.8,SD2neg:12.8,SD1neg:14.0,median:15.3,SD1:16.8,SD2:18.5,SD3:20.5},
  48: { SD3neg:11.8,SD2neg:12.8,SD1neg:14.0,median:15.3,SD1:16.8,SD2:18.5,SD3:20.6},
  49: { SD3neg:11.8,SD2neg:12.8,SD1neg:13.9,median:15.3,SD1:16.8,SD2:18.5,SD3:20.6},
  50: { SD3neg:11.8,SD2neg:12.8,SD1neg:13.9,median:15.3,SD1:16.8,SD2:18.6,SD3:20.7},
  51: { SD3neg:11.8,SD2neg:12.8,SD1neg:13.9,median:15.3,SD1:16.8,SD2:18.6,SD3:20.7},
  52: { SD3neg:11.7,SD2neg:12.8,SD1neg:13.9,median:15.2,SD1:16.8,SD2:18.6,SD3:20.7},
  53: { SD3neg:11.7,SD2neg:12.7,SD1neg:13.9,median:15.3,SD1:16.8,SD2:18.6,SD3:20.8},
  54: { SD3neg:11.7,SD2neg:12.7,SD1neg:13.9,median:15.3,SD1:16.8,SD2:18.7,SD3:20.8},
  55: { SD3neg:11.7,SD2neg:12.7,SD1neg:13.9,median:15.3,SD1:16.8,SD2:18.7,SD3:20.9},
  56: { SD3neg:11.7,SD2neg:12.7,SD1neg:13.9,median:15.3,SD1:16.8,SD2:18.7,SD3:20.9},
  57: { SD3neg:11.7,SD2neg:12.7,SD1neg:13.9,median:15.3,SD1:16.9,SD2:18.7,SD3:21.0},
  58: { SD3neg:11.7,SD2neg:12.7,SD1neg:13.9,median:15.3,SD1:16.9,SD2:18.8,SD3:21.0},
  59: { SD3neg:11.6,SD2neg:12.7,SD1neg:13.9,median:15.3,SD1:16.9,SD2:18.8,SD3:21.0},
  60: { SD3neg:11.6,SD2neg:12.7,SD1neg:13.9,median:15.3,SD1:16.9,SD2:18.8,SD3:21.1}
};

// ─── 3. CONSTANTS & CONFIG ──────────────────────────────
const CONFIG = {
  // Masukkan URL logo Anda di bawah ini (contoh: 'https://domain.com/logo.png').
  // Jika dibiarkan kosong (''), sistem akan otomatis menggunakan Ikon Baby bawaan.
  LOGO_URL: 'https://img.sanishtech.com/u/4533435f511c6dbe1b9ef85f5427a6e8.png', 
};

const THEME = {
  primary: 'bg-teal-600',
  primaryText: 'text-teal-600',
  secondary: 'bg-cyan-500',
  bgMain: 'bg-sky-50 dark:bg-slate-900',
  cardBg: 'bg-white dark:bg-slate-800',
  textMain: 'text-slate-800 dark:text-slate-100',
  textMuted: 'text-slate-500 dark:text-slate-400',
  border: 'border-slate-200 dark:border-slate-700',
  colors: {
    normal: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', border: 'border-emerald-500' },
    warning: { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', border: 'border-amber-500' },
    danger: { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-500' },
    info: { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-500' }
  }
};

const VALIDASI = {
  beratBadan: {
    min: 0.5,  max: 150,
    error: (v) => (!v) ? "Wajib diisi" 
                : v <= 0 ? "Berat harus > 0 kg"
                : v > 150 ? "Tidak realistis (>150 kg)"
                : null
  },
  panjangTinggi: {
    min: 30, max: 200,
    error: (v) => (!v) ? "Wajib diisi"
                : v < 30  ? "Minimum 30 cm"
                : v > 200 ? "Tidak realistis (>200 cm)"
                : null
  },
  usia: {
    error: (bulan, sisa) => bulan < 0   ? "Tanggal lahir tidak valid"
                          : bulan > 60  ? "Maksimal usia 60 bulan"
                          : null
  }
};

// ─── 4. HELPER FUNCTIONS ────────────────────────────────
/**
 * Menghitung usia dalam bulan penuh dan sisa hari
 */
function hitungUsia(tanggalLahir, tanggalUkur) {
  if (!tanggalLahir || !tanggalUkur) return { bulanPenuh: -1, sisaHari: 0, display: "" };
  
  const lahir = new Date(tanggalLahir);
  const ukur = new Date(tanggalUkur);
  
  if (lahir > ukur) return { bulanPenuh: -1, sisaHari: 0, display: "Tanggal lahir tidak valid" };

  let bulan = (ukur.getFullYear() - lahir.getFullYear()) * 12 + (ukur.getMonth() - lahir.getMonth());
  if (ukur.getDate() < lahir.getDate()) bulan--;

  const tempDate = new Date(lahir);
  tempDate.setMonth(tempDate.getMonth() + Math.max(0, bulan));
  const sisaHari = Math.floor((ukur - tempDate) / (1000 * 60 * 60 * 24));

  return { 
    bulanPenuh: bulan, 
    sisaHari, 
    display: `${bulan} bulan ${sisaHari} hari` 
  };
}

/**
 * Koreksi PB/TB sesuai standar Permenkes
 */
function koreksiPengukuran(panjangTinggi, posisi, usiaBulan) {
  let nilai = parseFloat(panjangTinggi);
  if (isNaN(nilai)) return { nilaiKoreksi: 0, pesanKoreksi: null };

  let pesan = null;
  if (usiaBulan < 24 && posisi === 'berdiri') {
    nilai += 0.7;
    pesan = `Koreksi +0.7 cm (Diukur berdiri untuk anak < 24 bln)`;
  } else if (usiaBulan >= 24 && posisi === 'terlentang') {
    nilai -= 0.7;
    pesan = `Koreksi -0.7 cm (Diukur terlentang untuk anak ≥ 24 bln)`;
  }
  return { nilaiKoreksi: nilai, pesanKoreksi: pesan };
}

/**
 * Interpolasi linear antara dua referensi
 */
function interpolasiRef(ref1, ref2, fraction) {
  const result = {};
  ['SD3neg','SD2neg','SD1neg','median','SD1','SD2','SD3'].forEach(k => {
    result[k] = ref1[k] + (ref2[k] - ref1[k]) * fraction;
  });
  return result;
}

/**
 * Mendapatkan referensi dengan interpolasi jika perlu
 */
function getReference(value, tableObj) {
  const originalKeys = Object.keys(tableObj);
  const numKeys = originalKeys.map(Number).sort((a,b) => a-b);
  
  if (numKeys.length === 0) return null;

  // Helper untuk mengambil data dengan aman (mengatasi key "45" vs "45.0")
  const getVal = (num) => {
    if (tableObj[num]) return tableObj[num];
    const exactKey = originalKeys.find(k => Number(k) === num);
    return exactKey ? tableObj[exactKey] : null;
  };
  
  if (value <= numKeys[0]) return getVal(numKeys[0]);
  if (value >= numKeys[numKeys.length-1]) return getVal(numKeys[numKeys.length-1]);

  for (let i = 0; i < numKeys.length - 1; i++) {
    if (value >= numKeys[i] && value <= numKeys[i+1]) {
      const lowerVal = getVal(numKeys[i]);
      const upperVal = getVal(numKeys[i+1]);
      
      if (value === numKeys[i]) return lowerVal;
      if (value === numKeys[i+1]) return upperVal;
      
      if (!lowerVal || !upperVal) return null;
      
      const fraction = (value - numKeys[i]) / (numKeys[i+1] - numKeys[i]);
      return interpolasiRef(lowerVal, upperVal, fraction);
    }
  }
  return null;
}

// ─── 5. Z-SCORE ENGINE ──────────────────────────────────
/**
 * Menghitung Z-score berdasarkan standar WHO
 */
function hitungZScore(nilai, ref) {
  if (!ref || isNaN(nilai) || nilai === null) return null;
  const { SD3neg, SD2neg, SD1neg, median, SD1, SD2, SD3 } = ref;
  let z;

  if (nilai === median) z = 0;
  else if (nilai > median) {
    if (nilai <= SD1) z = (nilai - median) / (SD1 - median);
    else if (nilai <= SD2) z = 1 + (nilai - SD1) / (SD2 - SD1);
    else if (nilai <= SD3) z = 2 + (nilai - SD2) / (SD3 - SD2);
    else z = 3 + (nilai - SD3) / (SD3 - SD2);
  } else {
    if (nilai >= SD1neg) z = (nilai - median) / (median - SD1neg);
    else if (nilai >= SD2neg) z = -1 + (nilai - SD1neg) / (SD1neg - SD2neg);
    else if (nilai >= SD3neg) z = -2 + (nilai - SD2neg) / (SD2neg - SD3neg);
    else z = -3 + (nilai - SD3neg) / (SD2neg - SD3neg);
  }
  
  // KUNCI DIBUKA: Mengembalikan nilai mentah (akurat) 2 desimal tanpa pembatasan Math.max/min
  return Number(z.toFixed(2));
}

// ─── 6. CLASSIFICATION ENGINE ───────────────────────────
const defaultTheme = {
  text: 'text-slate-500 dark:text-slate-400',
  bg: 'bg-slate-100 dark:bg-slate-800',
  border: 'border-slate-300 dark:border-slate-600'
};

function klasifikasiBBU(z) {
  if (z === null || isNaN(z)) return { label: "N/A", theme: defaultTheme, desc: "Data tidak tersedia atau di luar rentang ukur." };
  if (z < -3) return { label: "Berat Badan Sangat Kurang", theme: THEME.colors.danger, desc: "Berat badan anak sangat kurang dibanding standar usianya. Segera konsultasikan ke tenaga kesehatan." };
  if (z < -2) return { label: "Berat Badan Kurang", theme: THEME.colors.warning, desc: "Berat badan anak kurang. Perlu perbaikan asupan nutrisi padat kalori dan pemantauan." };
  if (z <= 1) return { label: "Berat Badan Normal", theme: THEME.colors.normal, desc: "Berat badan anak tergolong normal dan sesuai dengan usianya." };
  return { label: "Risiko Berat Badan Lebih", theme: THEME.colors.warning, desc: "Anak memiliki risiko berat badan lebih. Pantau terus tren pertumbuhannya." };
}

function klasifikasiTBU(z) {
  if (z === null || isNaN(z)) return { label: "N/A", theme: defaultTheme, desc: "Data tidak tersedia atau di luar rentang ukur." };
  if (z < -3) return { label: "Sangat Pendek", theme: THEME.colors.danger, desc: "Anak terindikasi sangat pendek (severely stunted). Membutuhkan intervensi medis dan gizi segera." };
  if (z < -2) return { label: "Pendek", theme: THEME.colors.warning, desc: "Anak terindikasi pendek (stunted) akibat kurang gizi kronis. Perlu evaluasi asupan gizi jangka panjang." };
  if (z <= 3) return { label: "Normal", theme: THEME.colors.normal, desc: "Tinggi/panjang badan anak normal dan sesuai dengan standar usianya." };
  return { label: "Tinggi", theme: THEME.colors.info, desc: "Anak tergolong tinggi untuk usianya. Hal ini umumnya normal dan baik." };
}

function klasifikasiBBTB(z) {
  if (z === null || isNaN(z)) return { label: "N/A", theme: defaultTheme, desc: "Data tidak tersedia atau di luar rentang ukur." };
  if (z < -3) return { label: "Gizi Buruk", theme: THEME.colors.danger, desc: "Anak mengalami gizi buruk (severely wasted). Segera bawa ke fasilitas pelayanan kesehatan terdekat." };
  if (z < -2) return { label: "Gizi Kurang", theme: THEME.colors.danger, desc: "Anak mengalami gizi kurang (wasted). Perlu peningkatan asupan kalori dan nutrisi." };
  if (z <= 1) return { label: "Gizi Baik", theme: THEME.colors.normal, desc: "Status gizi anak baik, proporsi berat terhadap tinggi badannya ideal." };
  if (z <= 2) return { label: "Risiko Gizi Lebih", theme: THEME.colors.warning, desc: "Anak berisiko gizi lebih. Cermati asupan kalori dan pastikan anak aktif bergerak." };
  if (z <= 3) return { label: "Gizi Lebih", theme: THEME.colors.warning, desc: "Anak mengalami gizi lebih (overweight). Perlu penyesuaian pola makan dan peningkatan aktivitas fisik." };
  return { label: "Obesitas", theme: THEME.colors.danger, desc: "Anak mengalami obesitas. Segera konsultasikan ke dokter anak untuk manajemen berat badan." };
}

// ─── 7. SUB-COMPONENTS ──────────────────────────────────
const StatusBadge = ({ status }) => {
  if (!status) return null;
  return (
    <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${status.theme?.bg || 'bg-slate-100'} ${status.theme?.text || 'text-slate-500'} border ${status.theme?.border || 'border-slate-300'}`}>
      {status.label}
    </span>
  );
};

const ZScoreBar = ({ zScore, status }) => {
  if (zScore === null || isNaN(zScore)) return null;
  
  // Membatasi visual bar agar mentok di skala -4 sampai +4 (tidak merusak UI)
  const percentage = Math.max(0, Math.min(100, ((zScore + 4) / 8) * 100));
  
  // Kalkulasi geseran Tooltip (X-Shift) agar tidak terpotong tepi layar/card
  // Jika 0% (kiri mentok) -> geser 42.5% ke kanan. 
  // Jika 100% (kanan mentok) -> geser -42.5% ke kiri.
  const tooltipShiftX = (50 - percentage) * 0.85;
  
  // Menyesuaikan warna komponen interaktif dengan status Gizi
  const colorTextClass = status?.theme?.text || '';
  let barBgClass = 'bg-slate-400';
  let dotBorderColor = '#94a3b8';

  if (colorTextClass.includes('red')) { barBgClass = 'bg-red-500'; dotBorderColor = '#ef4444'; }
  else if (colorTextClass.includes('amber')) { barBgClass = 'bg-amber-500'; dotBorderColor = '#f59e0b'; }
  else if (colorTextClass.includes('emerald')) { barBgClass = 'bg-emerald-500'; dotBorderColor = '#10b981'; }
  else if (colorTextClass.includes('blue')) { barBgClass = 'bg-blue-500'; dotBorderColor = '#3b82f6'; }
  
  return (
    <div className="w-full mt-6 mb-3 group cursor-pointer">
      
      {/* Tooltip Float (Interactive Detail) */}
      <div className="relative w-full h-0">
        <div
          className="absolute bottom-3 flex flex-col items-center transition-all duration-[1200ms] ease-out z-[60]"
          style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
        >
          <div className="flex flex-col items-center opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 ease-out pointer-events-none">
            {/* Box Teks yang dapat bergeser dinamis */}
            <div 
               className={`px-3 py-1.5 rounded-lg text-[11px] font-bold text-white shadow-md ${barBgClass} whitespace-nowrap`}
               style={{ transform: `translateX(${tooltipShiftX}%)` }}
            >
              Z-Score: {zScore > 0 ? '+' : ''}{zScore}
            </div>
            {/* Segitiga pointer yang tetap akurat di posisinya */}
            <div className={`w-2 h-2 rotate-45 ${barBgClass} -mt-1`}></div>
          </div>
        </div>
      </div>

      <div className="relative w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 shadow-inner">
        {/* Ticks (Garis presisi pembatas WHO) */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
           <div className="absolute top-0 bottom-0 left-[12.5%] w-px bg-slate-300 dark:bg-slate-600/80"></div>
           <div className="absolute top-0 bottom-0 left-[25%] w-px bg-slate-300 dark:bg-slate-600/80"></div>
           <div className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-slate-400 dark:bg-slate-500"></div>
           <div className="absolute top-0 bottom-0 left-[75%] w-px bg-slate-300 dark:bg-slate-600/80"></div>
           <div className="absolute top-0 bottom-0 left-[87.5%] w-px bg-slate-300 dark:bg-slate-600/80"></div>

           {/* Fill Progress menggunakan Transform (Akselerasi GPU, Smooth 60fps) */}
           <div
              className={`absolute top-0 bottom-0 left-0 w-full origin-left transition-transform duration-[1200ms] ease-out ${barBgClass}`}
              style={{ transform: `scaleX(${percentage / 100})` }}
           >
              {/* Efek kilap 3D (Gloss) */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent"></div>
           </div>
        </div>

        {/* Floating Dot Thumb */}
        <div
           className="absolute top-1/2 w-4 h-4 bg-white border-[3px] rounded-full z-20 shadow-md transition-all duration-[1200ms] ease-out group-hover:scale-[1.4] group-hover:shadow-lg"
           style={{
             left: `${percentage}%`,
             transform: 'translate(-50%, -50%)',
             borderColor: dotBorderColor
           }}
        >
           {/* Efek Ping (Gelombang Pulse) saat area di-hover */}
           <div className={`absolute -inset-2 rounded-full animate-ping opacity-0 group-hover:opacity-30 ${barBgClass} transition-opacity duration-300 pointer-events-none`}></div>
        </div>
      </div>

      {/* Sumbu X Teks (Ditempatkan secara absolut agar presisi tinggi) */}
      <div className="relative w-full h-4 text-[9px] font-semibold mt-2 pointer-events-none">
        <span className="absolute top-0 left-[0%] text-slate-400 dark:text-slate-500">-4</span>
        <span className="absolute top-0 left-[12.5%] -translate-x-1/2 text-red-500/80 dark:text-red-400/80">-3</span>
        <span className="absolute top-0 left-[25%] -translate-x-1/2 text-amber-500/80 dark:text-amber-400/80">-2</span>
        <span className="absolute top-0 left-[50%] -translate-x-1/2 text-emerald-600/80 dark:text-emerald-500/80">0</span>
        <span className="absolute top-0 left-[75%] -translate-x-1/2 text-amber-500/80 dark:text-amber-400/80">+2</span>
        <span className="absolute top-0 left-[87.5%] -translate-x-1/2 text-red-500/80 dark:text-red-400/80">+3</span>
        <span className="absolute top-0 right-[0%] text-slate-400 dark:text-slate-500">+4</span>
      </div>
    </div>
  );
};

const ResultCard = ({ title, icon: Icon, value, unit, zScore, status, message, index = 0 }) => (
  <div 
    className={`relative p-4 rounded-2xl shadow-sm border ${THEME.cardBg} border-t-4 ${status?.theme?.border || 'border-slate-200'} print-break animate-slide-up hover:-translate-y-1 hover:shadow-md hover:z-50 transition-all duration-300`}
    style={{ animationDelay: `${index * 120}ms` }}
  >
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
        <Icon className="w-5 h-5 text-teal-500" />
        <h3 className="font-heading font-semibold text-sm">{title}</h3>
      </div>
      <div className="text-right">
        <span className="font-bold text-lg text-slate-800 dark:text-slate-100">{value}</span>
        <span className="text-xs text-slate-500 ml-1">{unit}</span>
      </div>
    </div>
    
    <div className="flex items-center justify-between mt-3 mb-2">
      <span className="text-sm text-slate-500 dark:text-slate-400">Z-Score</span>
      <div className="flex items-center gap-2">
        {zScore !== null && Math.abs(zScore) > 6 && (
          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 rounded uppercase tracking-wider" title="Nilai di luar kewajaran biologis">
            Ekstrem
          </span>
        )}
        <span className={`font-bold font-mono text-base ${zScore === null || isNaN(zScore) ? 'text-slate-400' : (status?.theme?.text || 'text-slate-500')}`}>
          {zScore !== null && !isNaN(zScore) ? (zScore > 0 ? `+${zScore}` : zScore) : '-'}
        </span>
      </div>
    </div>
    
    <ZScoreBar zScore={zScore} themeColor={status?.theme?.text || 'text-slate-500'} />
    
    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex flex-col gap-2">
      <div className="self-start">
        <StatusBadge status={status} />
      </div>
      {message && <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{message}</p>}
    </div>
  </div>
);

// ─── 8. CHART COMPONENT ─────────────────────────────────
const GrowthChart = ({ type, data, isDark, resultData }) => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    
    // Format Data menggunakan original keys agar key seperti "45.0" tidak terpotong menjadi 45
    const originalKeys = Object.keys(data).sort((a, b) => Number(a) - Number(b));
    const labels = originalKeys.map(Number);
    
    const d3n = originalKeys.map(k => data[k].SD3neg);
    const d2n = originalKeys.map(k => data[k].SD2neg);
    const d1n = originalKeys.map(k => data[k].SD1neg);
    const med = originalKeys.map(k => data[k].median);
    const d1  = originalKeys.map(k => data[k].SD1);
    const d2  = originalKeys.map(k => data[k].SD2);
    const d3  = originalKeys.map(k => data[k].SD3);

    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    // Current point
    let pointData = [];
    if (resultData && resultData.x !== null && resultData.y !== null) {
       pointData = [{x: resultData.x, y: resultData.y}];
    }

    const chartConfig = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          { label: 'Anak', data: pointData, backgroundColor: isDark?'#fff':'#0f172a', borderColor: isDark?'#fff':'#0f172a', pointRadius: 6, pointHoverRadius: 8, showLine: false, order: 0 },
          { label: '+3 SD', data: d3, borderColor: '#ef4444', borderDash: [5, 5], borderWidth: 1.5, pointRadius: 0, fill: false, tension: 0.4 },
          { label: '+2 SD', data: d2, borderColor: '#f59e0b', borderWidth: 1.5, pointRadius: 0, fill: false, tension: 0.4 },
          { label: '+1 SD', data: d1, borderColor: '#eab308', borderWidth: 1, pointRadius: 0, fill: false, tension: 0.4 },
          { label: 'Median', data: med, borderColor: '#10b981', borderWidth: 2, pointRadius: 0, fill: false, tension: 0.4 },
          { label: '-1 SD', data: d1n, borderColor: '#eab308', borderWidth: 1, pointRadius: 0, fill: false, tension: 0.4 },
          { label: '-2 SD', data: d2n, borderColor: '#f59e0b', borderWidth: 1.5, pointRadius: 0, fill: false, tension: 0.4 },
          { label: '-3 SD', data: d3n, borderColor: '#ef4444', borderDash: [5, 5], borderWidth: 1.5, pointRadius: 0, fill: false, tension: 0.4 },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { 
            position: 'bottom',
            labels: { boxWidth: 12, usePointStyle: true, color: textColor, font: { family: 'Inter', size: 11 } }
          },
          tooltip: {
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            titleColor: isDark ? '#f1f5f9' : '#0f172a',
            bodyColor: isDark ? '#cbd5e1' : '#475569',
            borderColor: gridColor,
            borderWidth: 1,
            padding: 10,
            boxPadding: 4,
            usePointStyle: true,
          }
        },
        scales: {
          x: {
            title: { display: true, text: resultData?.xLabel || 'Sumbu X', color: textColor, font: { family: 'Inter', size: 12 } },
            grid: { color: gridColor, drawBorder: false },
            ticks: { color: textColor, font: { family: 'Inter', size: 10 } }
          },
          y: {
            title: { display: true, text: resultData?.yLabel || 'Sumbu Y', color: textColor, font: { family: 'Inter', size: 12 } },
            grid: { color: gridColor, drawBorder: false },
            ticks: { color: textColor, font: { family: 'Inter', size: 10 } }
          }
        }
      }
    };

    chartRef.current = new Chart(ctx, chartConfig);

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [data, isDark, resultData]);

  return (
    <div className="w-full h-[300px] md:h-[400px] relative">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

// ─── 9. MAIN APP COMPONENT ──────────────────────────────
export default function App() {
  addFonts();
  
  // State
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState('bbu');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // State untuk Custom Confirm Box
  const [confirmBox, setConfirmBox] = useState({ isOpen: false, message: '', action: null });
  
  const [form, setForm] = useState({
    nama: '',
    jk: 'L',
    tglLahir: '',
    tglUkur: new Date().toISOString().split('T')[0],
    posisi: 'terlentang',
    bb: '',
    pb: ''
  });

  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  // Initialize Dark Mode & History
  useEffect(() => {
    const savedTheme = localStorage.getItem('nutricare-theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
    
    const savedHistory = localStorage.getItem('nutricare-history');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch(e){}
    }

    // Listener untuk efek Glassmorphism Navbar saat di-scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nutricare-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nutricare-theme', 'light');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { bulanPenuh, sisaHari } = hitungUsia(form.tglLahir, form.tglUkur);
    
    if (!form.nama) newErrors.nama = "Nama wajib diisi";
    if (!form.tglLahir) newErrors.tglLahir = "Tanggal lahir wajib diisi";
    
    const usiaErr = VALIDASI.usia.error(bulanPenuh, sisaHari);
    if (usiaErr) newErrors.tglLahir = usiaErr;
    
    const bbErr = VALIDASI.beratBadan.error(parseFloat(form.bb));
    if (bbErr) newErrors.bb = bbErr;
    
    const pbErr = VALIDASI.panjangTinggi.error(parseFloat(form.pb));
    if (pbErr) newErrors.pb = pbErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculate = () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate slight processing delay for UX
    setTimeout(() => {
      const { bulanPenuh, display: displayUsia } = hitungUsia(form.tglLahir, form.tglUkur);
      const bb = parseFloat(form.bb);
      const pbRaw = parseFloat(form.pb);
      const { nilaiKoreksi: pbKoreksi, pesanKoreksi } = koreksiPengukuran(pbRaw, form.posisi, bulanPenuh);
      
      // Hitung IMT
      const tinggiMeter = pbKoreksi / 100;
      const imt = bb / (tinggiMeter * tinggiMeter);

      // Pilih Dataset sesuai Jenis Kelamin
      const dsBbu = form.jk === 'L' ? bbu_laki : bbu_perempuan;
      const dsPbu = form.jk === 'L' ? pbu_laki : pbu_perempuan;
      const dsTbu = form.jk === 'L' ? tbu_laki : tbu_perempuan;
      const dsBbpb = form.jk === 'L' ? bbpb_laki : bbpb_perempuan;
      const dsBbtb = form.jk === 'L' ? bbtb_laki : bbtb_perempuan;
      const dsImtu024 = form.jk === 'L' ? imtu_laki_0_24 : imtu_perempuan_0_24;
      const dsImtu2460 = form.jk === 'L' ? imtu_laki_24_60 : imtu_perempuan_24_60;

      // 1. Hitung BB/U
      const refBbu = getReference(bulanPenuh, dsBbu);
      const zBbu = hitungZScore(bb, refBbu);
      
      // 2. Hitung PB/U atau TB/U
      let zPbuTbu = null;
      let jenisTinggi = bulanPenuh < 24 ? 'pb' : 'tb';
      if (jenisTinggi === 'pb') {
        const refPbu = getReference(bulanPenuh, dsPbu);
        zPbuTbu = hitungZScore(pbKoreksi, refPbu);
      } else {
        const refTbu = getReference(bulanPenuh, dsTbu);
        zPbuTbu = hitungZScore(pbKoreksi, refTbu);
      }

      // 3. Hitung BB/PB atau BB/TB (pembulatan panjang ke 0.5 terdekat)
      const roundedPanjang = Math.round(pbKoreksi * 2) / 2;
      let zBbTinggi = null;
      let jenisBbtb = bulanPenuh < 24 ? 'bbpb' : 'bbtb';
      
      if (jenisBbtb === 'bbpb') {
        const refBbpb = getReference(roundedPanjang, dsBbpb);
        zBbTinggi = hitungZScore(bb, refBbpb);
      } else {
        const refBbtb = getReference(roundedPanjang, dsBbtb);
        zBbTinggi = hitungZScore(bb, refBbtb);
      }

      // 4. Hitung IMT/U
      let zImtu = null;
      if (bulanPenuh < 24) {
        const refImtu = getReference(bulanPenuh, dsImtu024);
        zImtu = hitungZScore(imt, refImtu);
      } else {
        const refImtu = getReference(bulanPenuh, dsImtu2460);
        zImtu = hitungZScore(imt, refImtu);
      }

      const calcResult = {
        timestamp: new Date().getTime(),
        input: { ...form, usiaBulan: bulanPenuh, usiaDisplay: displayUsia, pbKoreksi, imt, pesanKoreksi },
        zScores: {
          bbu: zBbu,
          pbutbu: zPbuTbu,
          bbtb: zBbTinggi,
          imtu: zImtu
        },
        status: {
          bbu: klasifikasiBBU(zBbu),
          pbutbu: klasifikasiTBU(zPbuTbu),
          bbtb: klasifikasiBBTB(zBbTinggi),
          imtu: klasifikasiBBTB(zImtu) // klasifikasi sama
        }
      };

      setResult(calcResult);
      
      // Save History
      const newHistory = [calcResult, ...history.filter(h => h.input.nama !== calcResult.input.nama)].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem('nutricare-history', JSON.stringify(newHistory));

      setIsLoading(false);
      
      // Scroll to result
      setTimeout(() => {
        const resultElement = document.getElementById('result-section');
        if (resultElement) {
          // Menggunakan getBoundingClientRect agar scroll absolut dan tidak meleset ke hero section
          const y = resultElement.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);

    }, 600);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    
    // Auto adjust Posisi based on Age if dob changes
    if (name === 'tglLahir' && value) {
        const { bulanPenuh } = hitungUsia(value, form.tglUkur);
        if (bulanPenuh >= 0) {
            setForm(prev => ({...prev, posisi: bulanPenuh < 24 ? 'terlentang' : 'berdiri'}));
        }
    }
  };

  const resetForm = () => {
    setForm({
      nama: '', jk: 'L', tglLahir: '', tglUkur: new Date().toISOString().split('T')[0], posisi: 'terlentang', bb: '', pb: ''
    });
    setErrors({});
    setResult(null);
  };

  const triggerReset = () => {
    if (result) {
      setConfirmBox({ isOpen: true, message: "Hapus data yang sedang ditampilkan?", action: resetForm });
    } else {
      resetForm();
    }
  };

  const deleteHistory = (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    localStorage.setItem('nutricare-history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('nutricare-history');
  };

  const triggerClearHistory = () => {
    setConfirmBox({ isOpen: true, message: "Hapus semua riwayat?", action: clearHistory });
  };

  // Render Tabs Data
  const renderChartData = (type) => {
    if (!result) return null;
    const { input } = result;
    const isMale = input.jk === 'L';
    let refData, xValue, yValue, xLabel, yLabel;

    switch (type) {
      case 'bbu':
        refData = isMale ? bbu_laki : bbu_perempuan;
        xValue = input.usiaBulan;
        yValue = input.bb;
        xLabel = 'Usia (Bulan)';
        yLabel = 'Berat Badan (kg)';
        break;
      case 'tbu':
        refData = input.usiaBulan < 24 ? (isMale ? pbu_laki : pbu_perempuan) : (isMale ? tbu_laki : tbu_perempuan);
        xValue = input.usiaBulan;
        yValue = input.pbKoreksi;
        xLabel = 'Usia (Bulan)';
        yLabel = 'Panjang/Tinggi Badan (cm)';
        break;
      case 'bbtb':
        const roundedP = Math.round(input.pbKoreksi * 2) / 2;
        refData = input.usiaBulan < 24 ? (isMale ? bbpb_laki : bbpb_perempuan) : (isMale ? bbtb_laki : bbtb_perempuan);
        xValue = roundedP;
        yValue = input.bb;
        xLabel = 'Panjang/Tinggi Badan (cm)';
        yLabel = 'Berat Badan (kg)';
        break;
      case 'imtu':
        refData = input.usiaBulan < 24 ? (isMale ? imtu_laki_0_24 : imtu_perempuan_0_24) : (isMale ? imtu_laki_24_60 : imtu_perempuan_24_60);
        xValue = input.usiaBulan;
        yValue = input.imt;
        xLabel = 'Usia (Bulan)';
        yLabel = 'IMT';
        break;
      default: return null;
    }
    return { data: refData, resultData: { x: xValue, y: yValue, xLabel, yLabel } };
  };

  const chartDataObj = renderChartData(activeTab);

  return (
    <div className={`min-h-screen font-body transition-colors duration-300 ${THEME.bgMain} ${THEME.textMain}`}>
      {/* HEADER NAVBAR */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm py-2' : 'bg-transparent border-b border-transparent py-4'}`}>
        <div className="max-w-6xl mx-auto px-4 lg:px-8 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {CONFIG.LOGO_URL ? (
              <img src={CONFIG.LOGO_URL} alt="Logo" className={`object-contain transition-all duration-300 ${isScrolled ? 'h-10' : 'h-14'}`} />
            ) : (
              <Baby className={`text-teal-600 dark:text-teal-400 transition-all duration-300 ${isScrolled ? 'w-8 h-8' : 'w-10 h-10'}`} />
            )}
            
            {/* Saran: Teks disembunyikan jika menggunakan logo eksternal (seperti Kemenkes) agar lebih bersih */}
            {!CONFIG.LOGO_URL && (
              <h1 className={`font-heading font-bold tracking-tight hidden sm:block transition-all duration-300 ${isScrolled ? 'text-xl' : 'text-2xl'}`}>
                <span className="text-teal-600 dark:text-teal-400">NutriCare</span>
                <span className="text-slate-800 dark:text-white">Calc</span>
              </h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2.5 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors" title="Toggle Tema">
              {isDark ? <Sun className="w-5 h-5 text-slate-200" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <button onClick={triggerReset} className="p-2.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors hidden sm:block" title="Reset Data">
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION / HALAMAN AWAL */}
      <section className="relative w-full min-h-[95vh] flex items-center justify-center overflow-hidden px-4 pt-20 no-print">
        {/* Latar Belakang Gelembung Cahaya (Glassmorphism Glow) */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-[80px] md:blur-[120px] animate-blob pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-[80px] md:blur-[120px] animate-blob pointer-events-none" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center animate-slide-up">
          <div className="px-4 py-2 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-sm mb-6 inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            <span className="text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-300 tracking-wide uppercase">Standar Kemenkes RI & WHO</span>
          </div>
          
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-slate-800 dark:text-white leading-[1.1] mb-6 tracking-tight">
            Pantau Tumbuh Kembang Anak <br className="hidden md:block" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">
              Akurat, Cepat & Cerdas
            </span>
          </h1>
          
          <p className="text-slate-600 dark:text-slate-400 text-base md:text-xl mb-10 max-w-2xl leading-relaxed">
            Aplikasi analisis status gizi untuk balita (0-60 bulan) yang dirancang untuk orang tua dan tenaga kesehatan. Dapatkan grafik pertumbuhan dan interpretasi Z-Score seketika.
          </p>
          
          <button 
            onClick={() => {
              const element = document.getElementById('kalkulator-section');
              const headerOffset = 80; // Sesuaikan dengan tinggi navbar
              const elementPosition = element.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.scrollY - headerOffset;
              window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }}
            className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-bold text-lg shadow-[0_0_40px_-10px_rgba(13,148,136,0.6)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_50px_-10px_rgba(13,148,136,0.8)] active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Mulai Kalkulasi
              <ArrowDownCircle className="w-5 h-5 group-hover:animate-bounce" />
            </span>
            {/* Efek kilap menyapu saat di-hover */}
            <div className="absolute inset-0 h-full w-full -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </button>
        </div>
      </section>

      {/* KALKULATOR SECTION (Tujuan Scroll) */}
      <main id="kalkulator-section" className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 print-container relative z-10">
        
        {/* LEFT COLUMN: FORM */}
        <div className="lg:col-span-4 space-y-6 no-print">
          <div className={`${THEME.cardBg} rounded-2xl shadow-sm border ${THEME.border} p-5`}>
            <h2 className="font-heading font-semibold text-lg flex items-center gap-2 mb-5">
              <ClipboardList className="w-5 h-5 text-teal-500" /> Data Anak
            </h2>
            
            <div className="space-y-4">
              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Anak</label>
                <input type="text" name="nama" value={form.nama} onChange={handleInputChange} maxLength="50"
                  className={`w-full px-3 py-2 rounded-xl border ${errors.nama ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-teal-500'} bg-transparent dark:text-white focus:outline-none focus:ring-2`}
                  placeholder="Masukkan nama..." />
                {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
              </div>

              {/* Jenis Kelamin */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jenis Kelamin</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center gap-2 py-2 border rounded-xl cursor-pointer transition-colors ${form.jk === 'L' ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'border-slate-200 dark:border-slate-700'}`}>
                    <input type="radio" name="jk" value="L" checked={form.jk === 'L'} onChange={handleInputChange} className="hidden" />
                    <User className="w-4 h-4" />
                    <span className="font-medium text-sm">Laki-laki</span>
                  </label>
                  <label className={`flex items-center justify-center gap-2 py-2 border rounded-xl cursor-pointer transition-colors ${form.jk === 'P' ? 'bg-pink-50 border-pink-500 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' : 'border-slate-200 dark:border-slate-700'}`}>
                    <input type="radio" name="jk" value="P" checked={form.jk === 'P'} onChange={handleInputChange} className="hidden" />
                    <User className="w-4 h-4" />
                    <span className="font-medium text-sm">Perempuan</span>
                  </label>
                </div>
              </div>

              {/* Tanggal */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tgl Lahir</label>
                  <input type="date" name="tglLahir" value={form.tglLahir} onChange={handleInputChange} max={form.tglUkur}
                    className={`w-full px-3 py-2 rounded-xl border ${errors.tglLahir ? 'border-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-teal-500'} bg-transparent dark:text-white focus:outline-none focus:ring-2 text-sm`} />
                  {errors.tglLahir && <p className="text-red-500 text-xs mt-1">{errors.tglLahir}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tgl Ukur</label>
                  <input type="date" name="tglUkur" value={form.tglUkur} onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-teal-500 bg-transparent dark:text-white focus:outline-none focus:ring-2 text-sm" />
                </div>
              </div>

              {/* Tampilan Usia Otomatis */}
              {form.tglLahir && form.tglUkur && hitungUsia(form.tglLahir, form.tglUkur).bulanPenuh >= 0 && (
                <div className="bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 p-3 rounded-xl text-sm flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>Usia Anak: <strong>{hitungUsia(form.tglLahir, form.tglUkur).display}</strong></p>
                </div>
              )}

              {/* Berat & Panjang/Tinggi */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Berat (kg)</label>
                  <input type="number" inputMode="decimal" step="0.1" name="bb" value={form.bb} onChange={handleInputChange} placeholder="0.0"
                    className={`w-full px-3 py-2 rounded-xl border ${errors.bb ? 'border-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-teal-500'} bg-transparent dark:text-white focus:outline-none focus:ring-2`} />
                  {errors.bb && <p className="text-red-500 text-xs mt-1">{errors.bb}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {form.tglLahir && hitungUsia(form.tglLahir, form.tglUkur).bulanPenuh >= 24 ? 'Tinggi (cm)' : 'Panjang (cm)'}
                  </label>
                  <input type="number" inputMode="decimal" step="0.1" name="pb" value={form.pb} onChange={handleInputChange} placeholder="0.0"
                    className={`w-full px-3 py-2 rounded-xl border ${errors.pb ? 'border-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-teal-500'} bg-transparent dark:text-white focus:outline-none focus:ring-2`} />
                  {errors.pb && <p className="text-red-500 text-xs mt-1">{errors.pb}</p>}
                </div>
              </div>

              {/* Posisi Ukur */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Posisi Pengukuran</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center gap-2 py-2 border rounded-xl cursor-pointer transition-colors ${form.posisi === 'terlentang' ? 'bg-teal-50 border-teal-500 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' : 'border-slate-200 dark:border-slate-700'}`}>
                    <input type="radio" name="posisi" value="terlentang" checked={form.posisi === 'terlentang'} onChange={handleInputChange} className="hidden" />
                    <Bed className="w-4 h-4" />
                    <span className="font-medium text-sm">Terlentang</span>
                  </label>
                  <label className={`flex items-center justify-center gap-2 py-2 border rounded-xl cursor-pointer transition-colors ${form.posisi === 'berdiri' ? 'bg-teal-50 border-teal-500 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' : 'border-slate-200 dark:border-slate-700'}`}>
                    <input type="radio" name="posisi" value="berdiri" checked={form.posisi === 'berdiri'} onChange={handleInputChange} className="hidden" />
                    <PersonStanding className="w-4 h-4" />
                    <span className="font-medium text-sm">Berdiri</span>
                  </label>
                </div>
              </div>
              
              <button 
                onClick={calculate} 
                disabled={isLoading}
                className="w-full py-3.5 mt-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold shadow-lg shadow-teal-500/30 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <><span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span> Menghitung...</>
                ) : (
                  <><LineChart className="w-5 h-5" /> Hitung Status Gizi</>
                )}
              </button>
            </div>
          </div>

          {/* HISTORY PANEL */}
          {history.length > 0 && (
            <div className={`${THEME.cardBg} rounded-2xl shadow-sm border ${THEME.border} p-5 overflow-hidden`}>
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-heading font-semibold text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-500" /> Riwayat Pemeriksaan
                  </h3>
                  <button onClick={triggerClearHistory} className="text-xs text-red-500 hover:text-red-600">Hapus Semua</button>
               </div>
               <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                 {history.map((h, i) => (
                   <div key={i} className="flex justify-between items-center p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 hover:border-teal-200 transition-colors group cursor-pointer"
                        onClick={() => { 
                          setForm(h.input); 
                          setResult(h); 
                          const resultElement = document.getElementById('result-section');
                          if (resultElement) {
                            window.scrollTo({ top: resultElement.offsetTop - 20, behavior: 'smooth' }); 
                          }
                        }}>
                     <div>
                       <p className="font-semibold text-sm">{h.input.nama} <span className="text-slate-400 font-normal ml-1">({h.input.usiaDisplay})</span></p>
                       <p className="text-xs text-slate-500 mt-0.5">{new Date(h.timestamp).toLocaleDateString('id-ID')}</p>
                     </div>
                     <button onClick={(e) => { e.stopPropagation(); deleteHistory(i); }} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: RESULTS */}
        <div className="lg:col-span-8 min-h-[500px]" id="result-section">
          {!result && !isLoading && (
            <div className={`h-full flex flex-col items-center justify-center text-center p-8 rounded-2xl border-2 border-dashed ${THEME.border} opacity-60 no-print`}>
              <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4">
                <Baby className="w-10 h-10 text-teal-500" />
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-700 dark:text-slate-200 mb-2">Belum Ada Data</h3>
              <p className="text-slate-500 max-w-sm">Silakan isi formulir data anak di samping dan klik "Hitung Status Gizi" untuk melihat hasil analisis, Z-score, dan grafik pertumbuhan WHO.</p>
            </div>
          )}

          {result && !isLoading && (
            <div className="space-y-6 animate-slide-up">
              
              {/* Header Print */}
              <div className="hidden print-only text-center border-b pb-6 mb-6">
                 <h1 className="font-heading font-bold text-2xl">Hasil Analisis Status Gizi Anak</h1>
                 <p className="text-slate-500">Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
              </div>

              {/* Summary Profile */}
              <div 
                className={`${THEME.cardBg} rounded-2xl shadow-sm border ${THEME.border} p-6 flex flex-col md:flex-row gap-6 items-center md:items-start animate-slide-up hover:shadow-md transition-shadow duration-300`}
                style={{ animationDelay: '50ms' }}
              >
                <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl font-bold text-teal-600">{result.input.nama.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="font-heading font-bold text-2xl text-slate-800 dark:text-slate-100 mb-1">{result.input.nama}</h2>
                  <p className="text-slate-500 mb-4">{result.input.jk === 'L' ? 'Laki-laki' : 'Perempuan'} • Usia {result.input.usiaDisplay}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                     <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                        <p className="text-xs text-slate-500 mb-1">Berat Badan</p>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{result.input.bb} <span className="font-normal text-xs">kg</span></p>
                     </div>
                     <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-center relative group">
                        <p className="text-xs text-slate-500 mb-1">Panjang/Tinggi</p>
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                          {result.input.pbKoreksi.toFixed(1)} <span className="font-normal text-xs">cm</span>
                          {result.input.pesanKoreksi && <span className="text-amber-500 ml-1 cursor-help">*</span>}
                        </p>
                        {result.input.pesanKoreksi && (
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-xl">
                            {result.input.pesanKoreksi}
                          </div>
                        )}
                     </div>
                     <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                        <p className="text-xs text-slate-500 mb-1">IMT</p>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{result.input.imt.toFixed(1)}</p>
                     </div>
                     <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                        <p className="text-xs text-slate-500 mb-1">Status Utama</p>
                        <p className={`font-bold ${result.status.bbtb.theme.text} text-sm line-clamp-1`}>{result.status.bbtb.label}</p>
                     </div>
                  </div>
                </div>
              </div>

              {/* Hasil Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ResultCard 
                  index={1}
                  title="Berat Badan / Umur" icon={Scale} 
                  value={result.input.bb} unit="kg" 
                  zScore={result.zScores.bbu} status={result.status.bbu}
                  message={result.status.bbu.desc}
                />
                <ResultCard 
                  index={2}
                  title="Tinggi Badan / Umur" icon={Ruler} 
                  value={result.input.pbKoreksi.toFixed(1)} unit="cm" 
                  zScore={result.zScores.pbutbu} status={result.status.pbutbu}
                  message={result.status.pbutbu.desc}
                />
                <ResultCard 
                  index={3}
                  title="Berat Badan / Tinggi Badan" icon={Baby} 
                  value={`${result.input.bb}kg / ${result.input.pbKoreksi.toFixed(1)}cm`} unit="" 
                  zScore={result.zScores.bbtb} status={result.status.bbtb}
                  message={result.status.bbtb.desc}
                />
                <ResultCard 
                  index={4}
                  title="Indeks Massa Tubuh / Umur" icon={HeartPulse} 
                  value={result.input.imt.toFixed(1)} unit="IMT" 
                  zScore={result.zScores.imtu} status={result.status.imtu}
                  message={result.status.imtu.desc}
                />
              </div>

              {/* Grafik Section */}
              <div 
                className={`${THEME.cardBg} rounded-2xl shadow-sm border ${THEME.border} p-1 md:p-5 overflow-hidden print-break animate-slide-up`}
                style={{ animationDelay: '600ms' }}
              >
                 <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-700 px-2 pt-2 mb-4 gap-2 no-print">
                    {[
                      {id: 'bbu', label: 'Grafik BB/U'},
                      {id: 'tbu', label: 'Grafik TB/U'},
                      {id: 'bbtb', label: 'Grafik BB/TB'},
                      {id: 'imtu', label: 'Grafik IMT/U'}
                    ].map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                 </div>
                 
                 <div className="p-2 print:p-0">
                    <h3 className="font-heading font-semibold text-center mb-6 hidden print:block text-slate-800">
                       {activeTab === 'bbu' ? 'Grafik Berat Badan / Umur' :
                        activeTab === 'tbu' ? 'Grafik Panjang/Tinggi Badan / Umur' :
                        activeTab === 'bbtb' ? 'Grafik Berat Badan / Panjang/Tinggi Badan' : 'Grafik Indeks Massa Tubuh / Umur'}
                    </h3>
                    
                    {chartDataObj && (
                      <GrowthChart 
                        type={activeTab} 
                        data={chartDataObj.data} 
                        isDark={isDark} 
                        resultData={chartDataObj.resultData} 
                      />
                    )}
                 </div>
              </div>

            </div>
          )}
        </div>
      </main>

      {/* Modal Konfirmasi Dialog */}
      {confirmBox.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 no-print">
          <div className={`${THEME.cardBg} w-full max-w-sm rounded-2xl shadow-xl border ${THEME.border} p-6 animate-in zoom-in-95 duration-200`}>
            <div className="flex items-center gap-3 text-amber-500 mb-3">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-heading font-bold text-lg text-slate-800 dark:text-slate-100">Konfirmasi</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm leading-relaxed">{confirmBox.message}</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmBox({ isOpen: false, message: '', action: null })}
                className="px-4 py-2 text-sm rounded-xl font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  if(confirmBox.action) confirmBox.action();
                  setConfirmBox({ isOpen: false, message: '', action: null });
                }}
                className="px-4 py-2 text-sm rounded-xl font-medium text-white bg-red-500 hover:bg-red-600 shadow-sm transition-colors"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ─── 10. EXPORT ─────────────────────────────────────────
// Exported implicitly as default App