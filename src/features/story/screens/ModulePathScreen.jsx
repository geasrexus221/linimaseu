import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronLeft, Lock, Star, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { useNavigationStore } from '../../../store/useNavigationStore';
import { useStore } from '../../../store/useStore';
import { useRegisterRightPanel } from '../../../hooks/useRegisterRightPanel';
import { getModulePathData } from '../../../data/modules/sifat-cahaya';
import ModuleInfoPanel from '../components/ModuleInfoPanel';
import { soundManager } from '../../../utils/SoundManager';
import CharacterMelambai from '../../../assets/UI/Character/melambai1.svg';
import CharacterDuduk from '../../../assets/UI/Character/duduk2.svg';
import Bush1 from '../../../assets/UI/element/bush1.svg';
import BgSvg from '../../../assets/UI BG/bg.svg';
import BushSvg from '../../../assets/UI BG/bush.svg';

const RepeatingRoad = ({ numLoops, totalHeight }) => {
  return (
    <svg
      viewBox={`0 0 201.68 ${totalHeight}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    >
      {Array.from({ length: numLoops }).map((_, i) => (
        <g key={i} transform={`translate(0, ${i * 772.4})`}>
          <path fill="#efcb90" d="M44.32,458.12c.2,2.41.22,5,.07,7.79,2.09,5.31,12.17,26.08,15.52,29.35,1.77,1.73,3.54,2.56,5.95,2.01,11.27-5.91,22.54-11.18,33.79-15.83,1.74-3.37,3.6-4.42,5.58-3.15-.15,4.58-.97,4.59-4.59,6.9s-32.88,16.43-35.77,16.72c-1.66.17-3.22-.67-4.86-.72-2.52-2.29-9.34-14.05-11.07-17.41-2.94-5.69-9.17-18.17-7.25-24.17.54-1.67,2.06-1.12,2.64-1.48Z" />
          <path fill="#efcb90" d="M80.31,168.59c-1.42,6.17-6.52,17.12-9.65,22.94-1.43,2.66-2.75,5.1-5.8,6.14-14.2-.46-30.09,1.45-44.1.28-2.12-.18-5.98-.97-7.81-1.87-.27-.13-.58-.66-.92-.92-1.82-3.09-.28-5.18,0-7.33,1.38,2.82,3.87,4.67,7.48,5.55l43.09.72c5.97-4.83,10.02-11.52,12.17-20.04,1.23-3.91,3.08-5.74,5.55-5.47Z" />
          <path fill="#efcb90" d="M125.52,428.8c.19,0,3.06.74,3.69.92l2.2,1.44c7.09,10.75,13.43,21.88,19.02,33.38.63,3.65,2,8.19.05,11.54-.38.65-1.66.95-1.9,1.29-9.52,1.38-21.36,2.96-30.93,1.85-2.58-.3-3.79-.84-5.48-2.81-2.64-3.07-10.37-16.24-12.66-20.42s-4.82-8.13-1.74-13.04c2.44-3.89,19.05-9.44,23.12-13.23,1.52-.37,3.01-.95,4.61-.92Z" />
          <path fill="#efcb90" d="M129.21,121.86c4.4.7,5.23,5.51,4.41,9.41-.61,2.89-11.58,23.38-13.76,26.65-.98,1.46-2.35,2.17-3.56,3.34-.3.03-.62-.01-.92,0-5.88.21-20.03-.95-25.43-2.7-9.17-2.96-42.56-21.78-51.43-27.72-7.36-4.93-6.72-9.83-2.49-17.23l1.51,1.52c-1.6,4.56-2.53,9.14,2.26,11.97,9.79,5.77,21.38,12.07,31.49,17.42,14.73,7.79,47.05,24.8,51.5-1.28,4.22-4.94,6.92-10.21,8.12-15.8-2.81-2.29-3.38-4.15-1.69-5.59Z" />
          <path fill="#efcb90" d="M149.51,459.95c.56,1.48.65,3.04.92,4.58l-21.22-34.82c1.05.29,1.89-.38,3.22.9.59.57,6.21,9.71,7.12,11.28,3.51,6.08,6.02,11.77,9.96,18.05Z" />
          <path fill="#efcb90" d="M129.21,121.86c.26,2.06,3.15,3.79,3.56,5.25,1.29,4.63-6.22,13.18-8.36,17.01-1.64,2.94-2.13,7.23-4.43,10.26-3.93,5.17-9.23,4.49-15.2,4.12-23.09-1.42-45.06-20.75-65.92-29.83-6.52-5.03-4.62-8.03-2.83-15.05.14-.54-.15-1.33,0-1.83,1.52-5.18,8.56-20.15,15.11-19.21l78.08,29.29Z" />
          <path fill="#efcb90" d="M136.59,69.63c-3.11,11.79-16.54,25.1-25.76,33.48-2.67,2.43-5.26,3.18-8.79,2.41-2.9-.63-5.8-1.49-8.63-2.44-5.86-1.96-35.87-12.63-38.26-15.28s-2.36-4.91-1.6-8.09c1.83-6.42,11.15-24.52,18.05-25.6s44.25-1.1,50.49.15c5.15,1.04,13.66,10.46,14.51,15.37Z" />
          <path fill="#efcb90" d="M147.42,74.42c7.19-1.47,12.44,2.93,11.94,10.21-.2,2.95-12.22,26.1-14.63,29.27-1.95,2.58-4.24,5.02-7.76,5.15-2.7.1-14.77-4.3-16.47-6.41-2.19-2.71-1.97-8.25-.4-11.28,6.6-5.34,19.69-25.38,27.32-26.94Z" />
          <path fill="#efcb90" d="M53.55,79.71c-.67,4.21.66,6.91,4.37,8.95,13.68,2.86,30.3,13.03,43.36,15.57,3.07.6,6.59.6,9.03-1.6,8.08-11.39,21.86-19.52,26.28-33,.48,2.78-.28,6.34-1.84,8.71-2.88,4.39-20.18,22.79-24.44,26.13-5,3.92-5.76,2.87-11.51,1.31-7.37-2-36.68-12.31-42.22-15.8-4.75-2.99-4.39-5.52-3.03-10.27Z" />
          <path fill="#efcb90" d="M149.51,481.94c4.21,0,8.95.95,11.5,4.62,1.58,2.28,11.22,24.12,11.57,26.53l-1.43,7.74c-2.19,5.11-25.51,18.54-31.04,19.39-18.48-.88-36.89-1.99-55.23-3.33-5.68-1.51-6.58-3.07-9.18-8.23-4.51-5.51-11.85-18.27-4.58-24.24l42.35-20.25c11.78-.14,24.39-2.23,36.04-2.24Z" />
          <path fill="#efcb90" d="M193.8,754.98c-.28-.06-.62.04-.92,0-2.42,4.01-3.39,4.62-7.51,6.6-6.09,2.91-36.07,10.3-41.96,9.32-6.66-1.11-34.75-20.39-39.06-25.16-1.21-1.34-2.28-2.75-2.82-4.5-.04-1.62.69-3.71.92-5.5.83-6.26,3.46-22.57,5.78-27.71.92-2.05,2.91-3.48,5.02-4.19,26.27,4.47,52.38,10.27,78.29,16.28,10.97,5.48.89,25.21,2.27,34.86Z" />
          <path fill="#efcb90" d="M185.5,636.79c.74,8.58-14.02,11.58-20.89,12.15-6.38.52-11.64-.39-17.81-2.14l-35.08-9.95c-2.11-1.65-3.67-2.89-4.65-3.72-.32-1.62.21-3.86-.12-5.83-.89-5.34-4.57-21.08-1.8-24.94s29.63-7.02,35.53-9.49l36.08,11.82c1.15.93,1.54,2.17,2.04,3.48,1.71,4.52,6.15,23.74,6.7,28.62Z" />
          <path fill="#efcb90" d="M170.49,530.71c3.19-.66,6.3-.48,8.43,2.21,2.63,3.31,6.64,19.15,7.98,24.15,2.12,7.91,8.98,33.66,6.22,40.09-2.03,4.72-9,4.36-13.39,3.68-5.38-.84-25.16-7.64-30.47-10.06-3.08-1.41-4.97-2.64-5.8-6.15-2.49-10.45.93-26.5,1.22-37.4.36-.84,1-1.42,1.61-2.06,1.79-1.86,21.95-13.99,24.21-14.45Z" />
          <path fill="#efcb90" d="M159.66,695.43c-.42,5.32-1.38,7.93-6.91,9.57-3.16.94-28.48-4.15-32.59-5.44-10.64-3.33-10.86-4.48-11.25-16.04.04-1.38.93-3.12.96-4.99.14-7.91-1.4-23.37.16-30.09,1.1-4.74,6.11-4.74,10.19-4.1,5.42.86,25.44,6.87,30.46,9.14,7.02,3.17,6.32,8.95,7.12,15.84.9,7.78,1.66,18.42,1.85,26.11Z" />
          <path fill="#efcb90" d="M192.66,647.05c4.18-.58,7.79,1.43,8.47,5.83,1.18,7.63.11,15.33.02,22.81-.13,10.09.66,22.03-1.1,31.89-.42,2.32-2.72,6.22-5.05,6.9-4.36,1.26-22.46-2.05-26.07-4.89-3.18-2.5-3.3-8.71-3.72-12.8-.91-8.93-2.11-23.37-1.92-32.06.08-3.69.91-8.53,4.34-10.4,2.63-1.44,21.67-6.81,25.03-7.27Z" />
          <path fill="#efcb90" d="M136.59,547.91c1.54,3.3,1.43,28.46.96,33.48-.46,4.95-1.39,7.43-6.27,9.35-3.26,1.28-22.69,5.89-25.4,5.54-7.06-.9-8.72-15.51-10.8-21.36-2.49-7.02-9.95-20.87-6.72-27.71,1.08-2.3,3.82-2.69,5.78-3.88,14.04,1.2,29.13-.09,42.44,4.58Z" />
          <path fill="#efcb90" d="M94.6,750.13c1.14-1.55-1.03-6.65.74-6.24,3.09.71,21.13,15.2,23.41,18.2,2.43,3.2,1.86,7.48-2.7,7.76-4.01.24-25.56-14.83-27.63-18.71-.69-1.29,5.36.11,6.18-1.01Z" />
          <path fill="#efcb90" d="M140.29,541.5c-3.22.44-7.62-.06-11.07,0-.17.82-.48.79-.92,0l-15.23-1.82c-6.58-.41-30.49.09-34.09-3.72-1.37-1.45-2.67-5.26-3.27-7.29.64.78,4.6,5.18,5.04,5.53,4.04,3.28,24.47,2.36,30.47,2.72,8.97.54,21.72,3.41,30.42,1.79,1.41-.26,22.81-12.18,24.96-13.7,5.45-3.85,3.03-6.97,5.99-11.92.88,6-.21,10.06-5.08,13.74-2.76,2.09-24.76,14.33-27.22,14.66Z" />
          <path fill="#efcb90" d="M185.5,636.79c.17,1.54.25,4.37-.18,5.77-.96,3.15-15.61,7.06-19.15,7.56-16.1,2.25-38.59-10.07-55.01-12.35-1.87-.5-3.73-2.84-4.09-4.65,2.71-2.17,1.49,1.43,4.38,2.53,6.83,2.59,42.53,12.38,48.66,12.56,2.53.08,20.16-4.03,22.03-5.15,2.45-1.48.96-4.8,3.37-6.28Z" />
          <path fill="#efcb90" d="M159.66,695.43c.13,5.4-.5,10.5-6.93,11.04-4.21.35-32.42-5.31-37.39-6.89-7.72-2.45-6.62-9.21-6.43-16.06,2.09,5.07-.83,9.4,5.05,12.85,2.84,1.66,18.07,4.45,22.44,5.2,9.12,1.58,21.3,6.26,23.26-6.14Z" />
          <path fill="#efcb90" d="M2.8,234.56c4.44-10.49-1.36-31.21,14.3-32.99s33.08,2.32,48.69,1.13c3.36.62,27.06,14.54,29.51,17.17,2.05,2.2,2.83,5.34,2.54,8.27l-3.23,5.08c-19.86,7.84-40.15,14.79-60.86,20.85-11.36-1.72-21.37-5.78-30.03-12.18-1.11-3.06-.93-4.06-.92-7.33Z" />
          <path fill="#efcb90" d="M78.46,324.35c.24,3.45,1.14,4.12,0,7.33-1.65,2.28-3.71,4.33-6.51,5.15-20.68,1.13-41.76.83-62.47.28-2.73-.66-4.5-2.02-5.76-4.52-1.25-4.2-2.32-17.91-1.89-22.49.67-7.16,3.86-6.9,10-8.39,9.61-2.32,28-5.94,37.57-6.67,5.19-.39,7.75-.53,11.56,3.15,4.8,4.65,12.8,19.47,17.5,26.15Z" />
          <path fill="#efcb90" d="M84.72,243.03c9.49-1.16,11.83,7.79,7.18,14.49-2.49,3.58-25.12,25.75-28.81,28.2-8.89,5.89-19.77,6.94-23.63-4.63-2.65-7.96-5.41-18.39,2.98-23.21,4.48-2.58,37.45-14.26,42.29-14.85Z" />
          <path fill="#efcb90" d="M2.8,296.86c-3.91-11.35-2.96-21.29-1.73-33.32.79-7.74,1.3-11.84,10.27-10.43,2.05.32,15.43,5.23,16.73,6.29s1.21,1.52,1.77,2.82c1.65,3.83,4.91,21.97,4.27,25.89-.68,4.16-3.46,5.58-7.13,6.65-6.1,1.77-18.23,3.73-24.18,2.1Z" />
          <path fill="#efcb90" d="M92.3,266.63c.26,10.22-.32,20.51-.03,30.73.16,5.67,3.88,20.18-.89,23.78-1.62,1.22-3.96,1.73-5.94,1.39-3.76-.63-13.87-16.9-16.01-20.81-3.3-6.03-4.71-9.26-.18-15.39,2.08-2.81,17.17-17.6,19.77-18.85,1.12-.54,1.89-1.17,3.29-.85Z" />
          <path fill="#efcb90" d="M96,233.64c-17.5,9.84-43.58,14.03-62.49,21.79-7.97-2.78-26.84-5.4-29.78-13.54,8.95,4.85,19.9,9.08,29.9,10.97,18.1-7.46,40.71-11.26,58.28-19.16,3.23-1.45,3.44-3.69,5.94-5.56-.19,1.96-1.64,3.54-1.85,5.5Z" />
          <path fill="#efcb90" d="M9.26,338.09c-3.94-1.86-4.02-.39-5.54-5.5,2.48,1.87,3.59,3.29,6.9,3.68,7.9.95,55.31,1.14,61.31-.55,2.15-.6,4.65-2.79,6.53-4.05-1.17,3.3-3.46,5.62-6.97,6.36l-62.23.05Z" />
          <path fill="#efcb90" d="M192.88,754.98c-.09,3.57-2.18,5.76-5.27,7.14-6.21,2.77-31.8,9.18-38.8,10.03-4.35.53-6.05.3-9.94-1.57-7.19-3.47-26.46-16.39-32.65-21.63-2.73-2.31-4.6-3.85-4.69-7.71,4.55,5.2,10.02,9.31,15.75,13.23,4.03,2.76,22.91,14.7,26.32,15.15,5.89.78,32.14-6.43,39.13-8.68,1.62-.52,4.23-1.03,5.5-1.87,1.72-1.14,2.28-3.65,3.73-4.58,1.08-.7.63.47.93.5Z" />
          <path fill="#efcb90" d="M122.75,415.97c.13,3.04-.7,5.46-2.66,7.77-3.89,4.59-29.39,15.95-35.33,17.74-13.72,4.15-30.29,8.82-44.45,10.65-1.31.17-2.8-.07-4.02-.56-3.37-1.36-10.38-22.81-11.34-27.36-.4-4.43-1.07-4.97,3.38-8.09,17.42-7.14,35.2-20.16,52.56-26.6,5.85-2.17,19.36-1.97,25.66-.98,2.77.43,4.43,2.04,5.82,4.3,1.83,2.99,9.9,20.38,10.38,23.13Z" />
          <path fill="#efcb90" d="M78.46,379.32l-2.44,5.02c-15.14,9.43-31.64,18.45-48.17,25.23-7.19.94-11.23-3.64-12.13-13.76-2.99-8.37-10.09-34.5-10.22-42.61-.08-5.09,2.06-8.94,7.2-10.32,15.87.76,34.07-1.74,49.66-.26,5.52.52,7.12,1.76,8.98,6.66,2.37,6.25,7.4,23.91,7.12,30.03Z" />
          <path fill="#efcb90" d="M88.34,330.96c11.12-2.59,8.98,12.63,10.68,20.17,1.52,6.76,4.94,14.98,5.98,21.54,2.17,13.78-16.23,15.94-20.74,3.19-2.43-6.87-8.48-30.55-6.02-36.61.84-2.08,7.91-7.78,10.1-8.29Z" />
          <path fill="#efcb90" d="M118.14,426.97c-5.15,3.57-27.06,13.69-33.42,15.84-9.67,3.26-33.18,9.38-42.96,10.52-2.5.29-4.32.16-6.67-.71-4.46-6.5-9.45-20.65-10.15-28.4,1.58,4.1,9.12,24.73,11.99,26.12,1.02.49,2.06.62,3.18.5,13.8-3.64,29.09-5.82,42.64-9.99,7-2.15,16.92-7.08,23.59-10.48,6.94-3.54,15.28-5.92,16.41-14.4.88,5.06-.52,8.16-4.61,10.99Z" />
          <path fill="#efcb90" d="M15.72,395.82c.75,2.11,1.66,4.87,2.56,7.08,3.55,8.76,9.17,5.66,16.09,2.73,12.81-5.42,25.2-14.32,38.11-19.88,3.41-1.08,3.26-4.76,5.99-6.42-.19,4.17-.82,5.63-4.31,8.09-4.52,3.2-42.17,22.7-46.39,23.56-10.6,2.18-10.79-7.15-12.05-15.17Z" />
          <path fill="#efcb90" d="M12.03,187.83c1.63-12.68,7.37-31.53,11.75-43.76,2.6-7.27,3.2-12.79,12.92-9.59,10.32,8.28,32.05,14.74,41.06,23.1,4.02,3.73,3.6,6.45,2.55,11.01-7.18,8.2-6.56,22.21-17.29,27.26l-44.02-.74c-4.01-2.34-8.38-1.38-6.97-7.28Z" />
          <path fill="#efcb90" d="M104.3,202.49c-5.17,13.57-13.14,10.12-22.99,3.13-9.24-6.56-5.68-11.17-2.09-20.24,1.49-3.76,7.36-17.8,9.83-19.56,4.23-3.02,16.67-1.62,20.34,1.84,2.87,2.71,2.64,6.69,2.07,10.34-.72,4.57-5.39,19.86-7.16,24.5Z" />
          <path fill="#efcb90" d="M105.22,478.28c-2.55.99-3.14,3.92-5.28,5.3-1.97,1.27-5.45,1.54-7.55,2.58-8.63,4.27-17.17,8.74-25.9,12.82-3.9,1.02-6.95-.88-9.09-3.9-5.62-7.9-9.33-20.15-14.69-28.47-.68-3.04-.62-6.12,1.62-8.49,1.88-1.18,2.32-1.54,4.61-2.3,4.33-1.43,35.05-9.15,37.17-8.55,3.06.88,8.67,10.27,10.65,13.31,2.91,4.47,8.64,12.73,8.48,17.7Z" />
          <path fill="#efcb90" d="M128.29,541.5c.31,0,.62,0,.92,0,.09,5.44-9.7,1.95-7.38,0,2.14-.05,4.31.05,6.45,0Z" />
          <path fill="#efcb90" d="M136.45,2.14c12.73,4.2,2.68,26.46-1.19,35.04-.77,3.51-2.22,5.27-4.34,5.27-3.1,5.16-4.11,6.67-10.22,8.07-4.82,1.11-38.34,1-41.23-.92-2.11-1.4-2.73-3.87-2.99-6.24-.6-.32-1.06-.59-1.03-.69,4.1-11.74,9.03-24.7,13.9-36.15.17-2.76,11.17-6.36,12.87-6.53l34.23,2.14Z" />
          <path fill="#efcb90" d="M183.51,16.8c.54,1.59.4,3.05.17,4.67-.85,6.13-12.19,38.67-15.47,43.49-5.06,7.46-21.48,9.34-27.78,2.75l-6.75-9.68c-.12-.43-.91-.9-1-2.24-.33-4.7,8.44-23.79,10.66-29.87,1.54-4.22,3.96-17.1,7.6-19.26,2.5-1.49,19.86-1.2,23.4-.46,6.27,1.31,8.01,4.89,9.18,10.59Z" />
        </g>
      ))}
    </svg>
  );
};

export default function ModulePathScreen({ moduleId = 'cahaya' }) {
  const { setCurrentView, setActiveChapter } = useNavigationStore();
  const { unlockedNodes = [], claimedRewards = [], claimReward, addStars, theme } = useStore();
  const pathData = getModulePathData(moduleId);

  useRegisterRightPanel(ModuleInfoPanel, `module-${moduleId}-info`);

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardInfo, setRewardInfo] = useState(null);
  const containerRef = useRef(null);

  const scaleYVal = useMotionValue(1);
  const scaleXVal = useMotionValue(1);

  const handleCharacter1Click = () => {
    soundManager.play('squash');
    animate(scaleYVal, [1, 0.75, 1.25, 0.9, 1.05, 1], { duration: 0.6, ease: "easeOut" });
    animate(scaleXVal, [1, 1.25, 0.8, 1.1, 0.95, 1], { duration: 0.6, ease: "easeOut" });
  };

  const handleDrag = (event, info) => {
    // 1. Tidak bisa di-stretch ke bawah (dragDistance >= 0)
    const dragDistance = Math.max(0, -info.offset.y);

    // 2. Ujung stretch mengikuti posisi kursor (tinggi karakter = 200px)
    const newScaleY = 1 + dragDistance / 200;
    const newScaleX = Math.max(0.45, 1 - (newScaleY - 1) * 0.45);

    scaleYVal.set(newScaleY);
    scaleXVal.set(newScaleX);
  };

  const handleDragEnd = () => {
    animate(scaleYVal, 1, { type: "spring", stiffness: 450, damping: 10 });
    animate(scaleXVal, 1, { type: "spring", stiffness: 450, damping: 10 });
  };

  const isDark = theme === 'dark';

  // Space nodes vertically across loops of path.svg (each loop is 772.4px high)
  const numLoops = 2;
  const totalHeight = useMemo(() => {
    if (!pathData.length) return 772.4 * numLoops;
    const lastNodeY = 80 + (pathData.length - 1) * 110;
    const bottomPadding = 90; // Ruang bernafas di bawah node terakhir
    return lastNodeY + bottomPadding;
  }, [pathData]);

  const nodePositions = useMemo(() => {
    return pathData.map((node, index) => {
      // Space nodes vertically closer (110 units spacing instead of 135)
      const y = 80 + index * 110;
      const yMod = y % 772.4;

      // Follow the road path coordinates from path.svg
      let x = 100;
      if (yMod < 80) {
        x = 136 - (yMod / 80) * 26; // 136 -> 110
      } else if (yMod < 200) {
        x = 110 - ((yMod - 80) / 120) * 70; // 110 -> 40
      } else if (yMod < 320) {
        x = 40 + ((yMod - 200) / 120) * 15; // 40 -> 55
      } else if (yMod < 450) {
        x = 55 + ((yMod - 320) / 130) * 65; // 55 -> 120
      } else if (yMod < 580) {
        x = 120 + ((yMod - 450) / 130) * 30; // 120 -> 150
      } else if (yMod < 720) {
        x = 150 + ((yMod - 580) / 140) * 25; // 150 -> 175
      } else {
        x = 175 + ((yMod - 720) / 52.4) * 15; // 175 -> 190
      }
      return { x, y };
    });
  }, [pathData]);

  const handleNodeClick = (node) => {
    const isUnlocked = node.isUnlockedByDefault || unlockedNodes.includes(node.id);
    if (!isUnlocked) {
      alert("Selesaikan node sebelumnya untuk membuka ini!");
      return;
    }

    if (node.type === 'reward' && claimedRewards?.includes(node.id)) {
      return;
    }

    if (selectedNodeId === node.id) {
      setSelectedNodeId(null);
    } else {
      setSelectedNodeId(node.id);
    }
  };

  const handleStartNode = (node) => {
    if (node.type === 'reward') {
      setSelectedNodeId(null);
      setRewardInfo(node);
      setShowRewardModal(true);
      return;
    }

    setActiveChapter(node);
    if (node.type === 'material') {
      setCurrentView('material');
    } else if (node.type === 'quiz') {
      setCurrentView('quiz');
    }
  };

  const handleClaimReward = () => {
    if (rewardInfo) {
      addStars(rewardInfo.rewardAmount || 500);
      claimReward(rewardInfo.id);
      setShowRewardModal(false);
      setRewardInfo(null);
    }
  };

  return (
    <div className="module-path-screen light-theme">
      <header className="path-header">
        <button className="back-btn" onClick={() => setCurrentView('story')}>
          <ChevronLeft size={24} /> Kembali
        </button>
        <h2 className="path-title">Sifat Cahaya</h2>
      </header>

      <div className="path-scroll-content" style={{ padding: '270px 20px 100px 20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div
          className="path-container"
          ref={containerRef}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '280px',
            aspectRatio: `201.68 / ${totalHeight}`
          }}
        >
          {/* Draw Repeating Vector Road */}
          <RepeatingRoad numLoops={numLoops} totalHeight={totalHeight} />

          {pathData.map((node, index) => {
            const isUnlocked = node.isUnlockedByDefault || unlockedNodes.includes(node.id);
            const isSelected = selectedNodeId === node.id;
            const isClaimed = node.type === 'reward' && claimedRewards?.includes(node.id);

            const coords = nodePositions[index] || { x: 100, y: 120 };

            return (
              <div
                key={node.id}
                className="path-node-wrapper"
                style={{
                  position: 'absolute',
                  left: `${(coords.x / 201.68) * 100}%`,
                  top: `${(coords.y / totalHeight) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 3,
                  width: 'auto'
                }}
              >
                <motion.button
                  className={`path-node-btn ${isUnlocked ? 'unlocked' : 'locked'} ${node.type} ${isSelected ? 'active-node' : ''} ${isClaimed ? 'claimed' : ''}`}
                  onClick={() => handleNodeClick(node)}
                  whileHover={(isUnlocked && !isClaimed) ? { scale: 1.05 } : {}}
                  whileTap={(isUnlocked && !isClaimed) ? { scale: 0.95 } : {}}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="node-icon">
                    {node.type === 'reward'
                      ? (isClaimed ? '📦' : node.icon)
                      : (!isUnlocked ? <Lock size={36} color="#9CA3AF" /> : (node.type === 'quiz' ? <Star fill="white" size={36} /> : (node.type === 'material' ? <Lightbulb fill="white" size={32} color="white" /> : node.icon)))
                    }
                  </div>
                </motion.button>

                <div className="node-floating-label">
                  {node.type === 'material' ? 'Materi' : node.type === 'quiz' ? 'Kuis' : 'Hadiah'}
                </div>

                {/* Character standing next to Materi 2 */}
                {node.title === 'Sifat: Merambat Lurus' && (
                  <motion.div
                    className="npc-container"
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.4}
                    onDrag={handleDrag}
                    onDragEnd={handleDragEnd}
                    style={{
                      left: 'auto',
                      right: '-150px',
                      bottom: '10px',
                      cursor: 'grab',
                      transformOrigin: 'bottom center',
                      pointerEvents: 'auto',
                      scaleX: scaleXVal,
                      scaleY: scaleYVal,
                      y: 0
                    }}
                    onClick={handleCharacter1Click}
                  >
                    <div className="npc-shadow" style={{ width: '90px', bottom: '0px' }} />
                    <img
                      src={CharacterMelambai}
                      alt="NPC"
                      className="npc-character"
                      style={{ width: '200px', pointerEvents: 'none' }}
                    />
                  </motion.div>
                )}

                {/* Character sitting next to Reward Node */}
                {node.type === 'reward' && (
                  <div className="npc-container" style={{ right: '-140px', bottom: '20px' }}>
                    <img
                      src={CharacterDuduk}
                      alt="NPC Duduk"
                      className="npc-character-duduk"
                      style={{ width: '130px', transformOrigin: 'bottom center', animation: 'float-character 3s ease-in-out infinite' }}
                    />
                  </div>
                )}

                {/* Duolingo style popup card */}
                <AnimatePresence>
                  {isSelected && !isClaimed && (
                    <div className={`popup-positioner ${node.type}`}>
                      <motion.div
                        className="node-popup-card"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                      >
                        <div className="popup-tail" />
                        <div className="popup-title">{node.title}</div>
                        <div className="popup-subtitle">
                          {node.type === 'material' ? 'Materi Pembelajaran' : node.type === 'quiz' ? 'Kuis Evaluasi' : 'Hadiah Spesial'}
                        </div>
                        <button className="popup-start-btn" onClick={() => handleStartNode(node)}>
                          {node.type === 'reward' ? 'BUKA PETI' : 'MULAI'}
                        </button>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Bush Foreground Overlay placed inside the road container to scale and scroll with it */}
          <div className="bottom-bush-overlay">
            <img src={BushSvg} alt="Bush Foreground" />
          </div>

        </div>
      </div>

      {/* Reward Modal */}
      <AnimatePresence>
        {showRewardModal && rewardInfo && (
          <motion.div
            className="reward-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="reward-modal-content"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <div className="reward-icon-huge">🎁</div>
              <h2 className="reward-title">Harta Karun Terbuka!</h2>
              <p className="reward-desc">Kamu telah menyelesaikan seluruh rintangan dan menemukan harta karun ini.</p>

              <div className="reward-box">
                <Star size={32} fill="#FFD700" color="#FFD700" />
                <span className="reward-amount">+{rewardInfo.rewardAmount || 500} Bintang</span>
              </div>

              <button className="claim-btn" onClick={handleClaimReward}>
                KLAIM HADIAH
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .module-path-screen {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          overflow-x: hidden;
          height: 100%;
          padding-bottom: 100px;
          transition: background 0.3s ease;
          position: relative;
        }
        @media (min-width: 1024px) {
          .module-path-screen {
            max-width: 480px;
            margin: 0 auto;
            width: 100%;
            border-left: 2px solid var(--sidebar-border);
            border-right: 2px solid var(--sidebar-border);
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.08);
          }
        }

        .module-path-screen.light-theme {
          background-image: url(${BgSvg});
          background-size: 140%;
          background-position: -30px 20px;
          background-repeat: no-repeat;
          background-attachment: local;
          --bg-hill: #10B981;
          --path-main: #FBBF24; /* Sandy dirt road */
          --path-shadow: #D97706; /* Darker dirt edge */
        }

        .module-path-screen.dark-theme {
          background: linear-gradient(to bottom, #064E3B, #022C22);
          background-attachment: local;
          --bg-hill: #022C22;
          --path-main: #92400E;
          --path-shadow: #78350F;
        }

        .path-header {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 10;
          border-bottom: 2px solid rgba(0,0,0,0.05);
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #f3f4f6;
          border: 2px solid #e5e7eb;
          border-bottom: 4px solid #d1d5db;
          padding: 8px 16px;
          border-radius: 16px;
          color: #4b5563;
          font-weight: 900;
          font-size: 0.9rem;
          cursor: pointer;
          transition: transform 0.1s;
        }
        .back-btn:active { transform: translateY(2px); border-bottom-width: 2px; }

        .path-title {
          margin: 0 auto;
          font-weight: 900;
          font-size: 1.3rem;
          color: #F59E0B;
          text-shadow: 0 2px 0 rgba(0,0,0,0.05);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .path-container {
          position: relative;
          width: 100%;
          max-width: 280px;
          margin: 0 auto;
        }

        .path-node-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 3;
          width: 100%;
        }

        .npc-container {
          position: absolute;
          bottom: 20px;
          right: calc(50% + clamp(60px, 12vw, 90px));
          width: clamp(120px, 20vw, 160px);
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 0;
          pointer-events: none;
        }

        .npc-character {
          width: clamp(120px, 20vw, 160px);
          animation: float-character 3s ease-in-out infinite;
          transform-origin: bottom center;
        }

        .npc-shadow {
          position: absolute;
          bottom: 0px;
          width: clamp(70px, 12vw, 90px);
          height: 18px;
          background: rgba(0,0,0,0.25);
          border-radius: 50%;
          animation: shadow-pulse 3s ease-in-out infinite;
        }

        @keyframes float-character {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }

        @keyframes shadow-pulse {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          25%, 75% { transform: scale(0.95); opacity: 0.2; }
        }

        .path-node-btn {
          width: clamp(70px, 14vw, 85px);
          height: clamp(70px, 14vw, 85px);
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          cursor: pointer;
          color: white;
          transition: transform 0.1s, border-bottom-width 0.1s, box-shadow 0.1s;
        }

        .path-node-btn.material { 
          width: clamp(80px, 16vw, 95px); 
          height: clamp(80px, 16vw, 95px); 
        }
        .path-node-btn.quiz { 
          width: clamp(65px, 13vw, 75px); 
          height: clamp(65px, 13vw, 75px); 
        }
        .path-node-btn.reward { 
          width: clamp(90px, 18vw, 110px); 
          height: clamp(90px, 18vw, 110px); 
          font-size: clamp(3.5rem, 7vw, 4.5rem); 
          background: transparent; 
          border: none; 
          filter: drop-shadow(0 10px 15px rgba(0,0,0,0.2)); 
        }

        /* 3D Button Effects for Locked & Unlocked states */
        .path-node-btn.locked { 
          background: linear-gradient(135deg, #CFD8DC 0%, #90A4AE 100%); 
          border-bottom: 6px solid #546E7A; 
          color: #ECEFF1;
          box-shadow: inset 0 2px 0 rgba(255,255,255,0.4);
        }
        .path-node-btn.material.unlocked { 
          background: linear-gradient(135deg, #38B6FF 0%, #0070F3 100%); 
          border-bottom: 6px solid #0056B3; 
          box-shadow: inset 0 3px 0 rgba(255,255,255,0.4), 0 4px 10px rgba(0, 112, 243, 0.25);
        }
        .path-node-btn.quiz.unlocked { 
          background: linear-gradient(135deg, #78E08F 0%, #38A169 100%); 
          border-bottom: 6px solid #276749; 
          box-shadow: inset 0 3px 0 rgba(255,255,255,0.3), 0 4px 10px rgba(56, 161, 105, 0.3);
        }
        .path-node-btn.reward.unlocked { 
          background: transparent; 
          animation: bounce 2s infinite; 
          filter: drop-shadow(0 8px 12px rgba(255, 215, 0, 0.5));
        }

        .path-node-btn:active {
          transform: translateY(4px) !important;
          border-bottom-width: 2px !important;
        }

        /* Selected / Active Node Glow Effect */
        .path-node-btn.active-node { 
          box-shadow: 0 0 0 6px white, 0 0 20px rgba(255,255,255,0.8), inset 0 3px 0 rgba(255,255,255,0.4);
        }

        .path-node-btn.reward.claimed {
          background: transparent;
          animation: none;
          filter: grayscale(100%) opacity(0.5);
          cursor: default;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        .node-floating-label {
          margin-top: 12px;
          font-size: 0.72rem;
          font-weight: 900;
          color: #374151;
          background: #FFFFFF;
          border: 3px solid #E5E7EB;
          padding: 3px 12px;
          border-radius: 14px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.06);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .popup-positioner { position: absolute; left: 50%; transform: translateX(-50%); z-index: 100; }
        .popup-positioner.material { top: -165px; }
        .popup-positioner.quiz { top: -155px; }
        .popup-positioner.reward { top: -180px; }

        .node-popup-card { 
           background: white; 
           color: #374151; 
           padding: 20px 25px; 
           border-radius: 24px; 
           border: 3px solid #E5E7EB;
           border-bottom: 8px solid #D1D5DB;
           min-width: 260px; 
           box-shadow: 0 10px 25px rgba(0,0,0,0.1); 
           display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; 
        }
        
        .popup-tail { 
           position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%); 
           width: 0; height: 0; 
           border-left: 15px solid transparent; 
           border-right: 15px solid transparent; 
           border-top: 15px solid #D1D5DB; 
        }
        .popup-tail::after {
           content: ''; position: absolute; bottom: 8px; left: -15px;
           border-left: 15px solid transparent; border-right: 15px solid transparent; border-top: 15px solid white; 
        }
        
        .popup-title { font-weight: 900; font-size: 1.3rem; margin-bottom: 5px; color: #1CB0F6; }
        .popup-subtitle { font-size: 0.85rem; font-weight: 800; color: #9CA3AF; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
        
        .popup-start-btn { 
           width: 100%; padding: 15px; 
           border-radius: 16px; border: none; 
           background: #58CC02; color: white; 
           border-bottom: 5px solid #46A302;
           font-weight: 900; font-size: 1.1rem; letter-spacing: 1px;
           cursor: pointer; transition: transform 0.1s, border-bottom-width 0.1s; 
        }
        .popup-start-btn:active { transform: translateY(3px); border-bottom-width: 2px; }

        .reward-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; backdrop-filter: blur(5px); }
        .reward-modal-content { background: var(--card-bg); border-radius: 32px; padding: 40px 30px; text-align: center; width: 100%; max-width: 400px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); border: 6px solid #FFD700; border-bottom: 12px solid #D4AF37; }
        .reward-icon-huge { font-size: 6rem; animation: bounce 2s infinite; margin-bottom: 20px; filter: drop-shadow(0 10px 10px rgba(0,0,0,0.2)); }
        .reward-title { font-size: 2rem; font-weight: 900; color: var(--text-color); margin-bottom: 15px; }
        .reward-desc { color: var(--text-muted); font-weight: 700; font-size: 1.1rem; line-height: 1.6; margin-bottom: 30px; }
        .reward-box { background: rgba(255, 215, 0, 0.1); border: 3px solid #FFD700; padding: 15px 20px; border-radius: 20px; display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 30px; }
        .reward-amount { font-size: 1.8rem; font-weight: 900; color: #f4c265; }
        .claim-btn { width: 100%; padding: 18px; border-radius: 20px; background: #58CC02; color: white; font-size: 1.3rem; font-weight: 900; border: none; border-bottom: 6px solid #46A302; cursor: pointer; transition: all 0.1s; letter-spacing: 1px; }
        .claim-btn:active { transform: translateY(4px); border-bottom-width: 2px; }

        .bottom-bush-overlay {
          position: absolute;
          bottom: -100px; /* Diikat di ujung bawah kontainer jalan */
          left: 50%;
          transform: translateX(-50%);
          z-index: 2; /* Berada di atas jalan, tapi di bawah popup info */
          pointer-events: none; /* Klik tembus ke bawahnya */
          width: 140%; /* Sedikit lebih lebar dari jalan agar menutup seluruh ujung bawah */
        }
        .bottom-bush-overlay img {
          width: 100%;
          height: auto;
          display: block;
        }
      `}</style>
    </div>
  );
}
