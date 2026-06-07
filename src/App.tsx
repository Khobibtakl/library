import React, { useState, useEffect, useRef } from 'react';
import { 
  Book as BookIcon, 
  Search, 
  Download, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  X, 
  Plus, 
  Trash2, 
  Volume2, 
  VolumeX, 
  ZoomIn, 
  ZoomOut, 
  Settings, 
  Clock, 
  Award, 
  RotateCw, 
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  Send,
  Eye,
  SlidersHorizontal,
  BookmarkCheck,
  Check,
  HelpCircle,
  Maximize,
  Minimize,
  Sliders,
  Compass,
  FileText,
  User
} from 'lucide-react';
import { booksData as fallbackBooks, Book, BookPage } from './booksData';
import { exportBookToPublicStorage } from './exportService';
import { BookCover } from './components/BookCover';
import { App as CapApp } from '@capacitor/app';
import { Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

// Storage Key Prefix
const STORAGE_PREFIX = 'offline_library_v2_';
const KEYS = {
  THEME_ID: `${STORAGE_PREFIX}theme_id`,
  EXPORTED: `${STORAGE_PREFIX}exported`,
  BOOKMARKS: `${STORAGE_PREFIX}bookmarks`,
  ANNOTATIONS: `${STORAGE_PREFIX}annotations`,
  CURRENT_PAGES: `${STORAGE_PREFIX}current_pages`,
  READ_TIME: `${STORAGE_PREFIX}readtime`,
  USER_NAME: `${STORAGE_PREFIX}username`,
  SPEED_RATE: `${STORAGE_PREFIX}speed_rate`,
};

export interface AppTheme {
  id: string;
  name: string;
  isDark: boolean;
  bg: string;
  text: string;
  cardBg: string;
  border: string;
  accent: string;
  accentHover: string;
  accentText: string;
  headerBg: string;
  badgeBg: string;
}

export const APP_THEMES: AppTheme[] = [
  {
    id: 'slate-dark',
    name: 'سليټ ډبره (شپې موډ)',
    isDark: true,
    bg: 'bg-slate-950',
    text: 'text-slate-100',
    cardBg: 'bg-slate-900',
    border: 'border-slate-800',
    accent: 'bg-amber-500',
    accentHover: 'hover:bg-amber-400',
    accentText: 'text-slate-950',
    headerBg: 'bg-slate-900/90',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  },
  {
    id: 'ivory-day',
    name: 'پېښور سپینکوچ (رڼا موډ)',
    isDark: false,
    bg: 'bg-stone-50',
    text: 'text-stone-900',
    cardBg: 'bg-white',
    border: 'border-stone-200',
    accent: 'bg-amber-600',
    accentHover: 'hover:bg-amber-700',
    accentText: 'text-white',
    headerBg: 'bg-white/95',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    id: 'kabul-emerald',
    name: 'کابل زمرد (شین رنګ)',
    isDark: true,
    bg: 'bg-emerald-950',
    text: 'text-emerald-50',
    cardBg: 'bg-emerald-950/80',
    border: 'border-emerald-900/40',
    accent: 'bg-amber-500',
    accentHover: 'hover:bg-amber-400',
    accentText: 'text-emerald-950',
    headerBg: 'bg-emerald-900/95',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30'
  },
  {
    id: 'sufi-crimson',
    name: 'صوفي سري غزلونه',
    isDark: true,
    bg: 'bg-rose-950',
    text: 'text-rose-50',
    cardBg: 'bg-rose-900/60',
    border: 'border-rose-900/40',
    accent: 'bg-amber-500',
    accentHover: 'hover:bg-amber-400',
    accentText: 'text-rose-950',
    headerBg: 'bg-rose-900/90',
    badgeBg: 'bg-amber-400/15 text-amber-200 border-amber-400/20'
  },
  {
    id: 'lapis-blue',
    name: 'بدخشان لاجورد (شین تیاره)',
    isDark: true,
    bg: 'bg-blue-950',
    text: 'text-blue-50',
    cardBg: 'bg-blue-900/40',
    border: 'border-blue-900/20',
    accent: 'bg-amber-500',
    accentHover: 'hover:bg-amber-400',
    accentText: 'text-blue-950',
    headerBg: 'bg-blue-900/90',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30'
  },
  {
    id: 'sand-khaki',
    name: 'د رګستان هواد (ګرم خاکي)',
    isDark: false,
    bg: 'bg-[#f4efe2]',
    text: 'text-amber-950',
    cardBg: 'bg-[#faf6eb]',
    border: 'border-amber-200/60',
    accent: 'bg-amber-700',
    accentHover: 'hover:bg-amber-800',
    accentText: 'text-white',
    headerBg: 'bg-[#faf6eb]/95',
    badgeBg: 'bg-amber-200/20 text-amber-800 border-amber-200/50'
  },
  {
    id: 'ghazni-bronze',
    name: 'غزنوي برونز (تودوخه)',
    isDark: true,
    bg: 'bg-orange-950',
    text: 'text-orange-50',
    cardBg: 'bg-orange-900/40',
    border: 'border-orange-900/20',
    accent: 'bg-amber-500',
    accentHover: 'hover:bg-amber-400',
    accentText: 'text-orange-950',
    headerBg: 'bg-orange-900/90',
    badgeBg: 'bg-amber-500/10 text-amber-350 border-amber-500/20'
  },
  {
    id: 'spinghar-mint',
    name: 'سپین غره پودینه (تازه شین)',
    isDark: false,
    bg: 'bg-teal-50',
    text: 'text-teal-950',
    cardBg: 'bg-white',
    border: 'border-teal-100',
    accent: 'bg-teal-700',
    accentHover: 'hover:bg-teal-800',
    accentText: 'text-white',
    headerBg: 'bg-teal-50/80',
    badgeBg: 'bg-teal-100 text-teal-800'
  },
  {
    id: 'indigo-night',
    name: 'کيهاني ارغواني شپه',
    isDark: true,
    bg: 'bg-indigo-950',
    text: 'text-indigo-50',
    cardBg: 'bg-indigo-900/50',
    border: 'border-indigo-800/30',
    accent: 'bg-pink-500',
    accentHover: 'hover:bg-pink-400',
    accentText: 'text-indigo-950',
    headerBg: 'bg-indigo-900/90',
    badgeBg: 'bg-pink-500/15 text-pink-300'
  },
  {
    id: 'vintage-monochrome',
    name: 'ساده کلاسیکه ورځپاڼه',
    isDark: false,
    bg: 'bg-[#f4f4f4]',
    text: 'text-neutral-900',
    cardBg: 'bg-white',
    border: 'border-neutral-200',
    accent: 'bg-neutral-900',
    accentHover: 'hover:bg-neutral-800',
    accentText: 'text-white',
    headerBg: 'bg-[#f4f4f4]/95',
    badgeBg: 'bg-neutral-200 text-neutral-800'
  }
];

export default function App() {
  const [books, setBooks] = useState<Book[]>(fallbackBooks);
  
  // States
  const [selectedTheme, setSelectedTheme] = useState<AppTheme>(APP_THEMES[0]);
  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(true);
  const [splashProgress, setSplashProgress] = useState<number>(0);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  // App Filtering States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('title');

  // Core Storage
  const [bookmarks, setBookmarks] = useState<Record<string, number[]>>({}); // bookId -> pageNums[]
  const [annotations, setAnnotations] = useState<Record<string, Array<{ id: string; page: number; text: string; date: string }>>>({});
  const [currentPages, setCurrentPages] = useState<Record<string, number>>({}); // bookId -> pageNumber
  const [totalReadingTime, setTotalReadingTime] = useState<number>(145); // in minutes
  const [userName, setUserName] = useState<string>('ګران ملګری');
  const [ttsSpeed, setTtsSpeed] = useState<number>(0.95);

  // UI States
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [activeReadingBook, setActiveReadingBook] = useState<Book | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [readerPage, setReaderPage] = useState<number>(1);
  const [readerZoom, setReaderZoom] = useState<number>(100); 
  const [readerFit, setReaderFit] = useState<'width' | 'page' | 'custom'>('custom');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [brightnessLevel, setBrightnessLevel] = useState<number>(100); 

  // SCANNED PDF ENHANCEMENT CONTROLS
  const [rotationAngle, setRotationAngle] = useState<number>(0); // 0, 90, 180, 270 deg
  const [scannedContrast, setScannedContrast] = useState<number>(100); // percentage 100 - 180%
  const [inkBoldness, setInkBoldness] = useState<boolean>(false); // black ink enhancer
  const [cropMargins, setCropMargins] = useState<boolean>(false); // crop vintage margins
  const [invertedScan, setInvertedScan] = useState<boolean>(false); // Invert colors for eye safety

  // Forms and overlays
  const [newAnnotationText, setNewAnnotationText] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showContactDialog, setShowContactDialog] = useState<boolean>(false);
  const [showAuthorBioModal, setShowAuthorBioModal] = useState<boolean>(false);
  const [showStoragePermissionDialog, setShowStoragePermissionDialog] = useState<boolean>(false);
  const [bookToExport, setBookToExport] = useState<Book | null>(null);
  const [showExitDialog, setShowExitDialog] = useState<boolean>(false);
  const [readerMode, setReaderMode] = useState<'pdf' | 'text'>('pdf');

  // Audio / Speech
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const timerRef = useRef<any | null>(null);

  // Load books data dynamically from public/assets/books.json when app starts per user request #3
  // This resolves the issue where changed/updated books in assets did not show up in the application
  useEffect(() => {
    fetch('/assets/books.json')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Could not load /assets/books.json");
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setBooks(data);
          console.log("Loaded books dynamically from public/assets/books.json successfully!");
        }
      })
      .catch(err => {
        console.warn("Using fallback booksData as books.json loading failed:", err);
      });
  }, []);

  // Splash Timer (Automatically transition after exactly 4 seconds)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowSplashScreen(false);
      setSplashProgress(100);
    }, 4000);

    const interval = setInterval(() => {
      setSplashProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1; // Increment by 1 every 40ms = exactly 4000ms (4 seconds)
      });
    }, 40);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  // Synchronize Status Bar theme-color dynamically
  useEffect(() => {
    const meta = document.getElementById('status-bar-theme-color');
    if (meta) {
      const themeColors: Record<string, string> = {
        'slate-dark': '#030712',
        'ivory-day': '#fafaf9',
        'kabul-emerald': '#022c22',
        'sufi-crimson': '#4c0519',
        'lapis-blue': '#172554',
        'sand-khaki': '#faf6eb',
        'ghazni-bronze': '#431407',
        'spinghar-mint': '#f0fdfa',
        'indigo-night': '#1e1b4b',
      };
      const hex = themeColors[selectedTheme.id] || '#030712';
      meta.setAttribute('content', hex);
    }
  }, [selectedTheme]);

  // Listen to Capacitor Mobile Back Button to navigate backward safely instead of closing the app
  useEffect(() => {
    let activeHandler: any = null;
    
    const setupBackButton = async () => {
      try {
        activeHandler = await CapApp.addListener('backButton', () => {
          // If active reader is open, close it instead of exiting!
          if (activeReadingBook) {
            setActiveReadingBook(null);
          } else if (activeBook) {
            setActiveBook(null);
          } else if (showSettingsModal) {
            setShowSettingsModal(false);
          } else if (showContactDialog) {
            setShowContactDialog(false);
          } else if (showAuthorBioModal) {
            setShowAuthorBioModal(false);
          } else if (showExitDialog) {
            setShowExitDialog(false);
          } else {
            setShowExitDialog(true);
          }
        });
      } catch (e) {
        console.log("Capacitor backButton is not active inside this web environment.");
      }
    };

    setupBackButton();

    return () => {
      if (activeHandler && typeof activeHandler.remove === 'function') {
        activeHandler.remove();
      }
    };
  }, [activeReadingBook, activeBook, showSettingsModal, showContactDialog, showAuthorBioModal, showExitDialog]);

  // Carousel 10-Second Transition
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCarouselIndex(prev => (prev + 1 >= books.length ? 0 : prev + 1));
    }, 10000);
    return () => clearInterval(slideInterval);
  }, [books.length]);

  // Sync Storage
  useEffect(() => {
    try {
      const storedThemeId = localStorage.getItem(KEYS.THEME_ID);
      if (storedThemeId) {
        const found = APP_THEMES.find(t => t.id === storedThemeId);
        if (found) setSelectedTheme(found);
      }

      const storedBms = localStorage.getItem(KEYS.BOOKMARKS);
      if (storedBms) setBookmarks(JSON.parse(storedBms));

      const storedAnn = localStorage.getItem(KEYS.ANNOTATIONS);
      if (storedAnn) setAnnotations(JSON.parse(storedAnn));

      const storedPages = localStorage.getItem(KEYS.CURRENT_PAGES);
      if (storedPages) setCurrentPages(JSON.parse(storedPages));

      const storedTime = localStorage.getItem(KEYS.READ_TIME);
      if (storedTime) setTotalReadingTime(Number(storedTime));

      const storedName = localStorage.getItem(KEYS.USER_NAME);
      if (storedName) setUserName(storedName);

      const storedSpeed = localStorage.getItem(KEYS.SPEED_RATE);
      if (storedSpeed) setTtsSpeed(Number(storedSpeed));
    } catch (e) {
      console.warn("اوضاع ثبت کې تېروتنه:", e);
    }
  }, []);

  // Ticks Reading Timer
  useEffect(() => {
    if (activeReadingBook) {
      timerRef.current = setInterval(() => {
        setTotalReadingTime(prev => {
          const next = prev + 1;
          localStorage.setItem(KEYS.READ_TIME, String(next));
          return next;
        });
      }, 60000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeReadingBook]);

  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleStartReading = (book: Book) => {
    setActiveBook(null); 
    setActiveReadingBook(book);

    const savedResumePage = currentPages[book.id];
    if (savedResumePage && savedResumePage <= book.pages.length) {
      setReaderPage(savedResumePage);
      triggerToast(`لوستل ستاسو له پخوانۍ پاڼې ${savedResumePage} څخه پيل شول.`, 'success');
    } else {
      setReaderPage(1);
    }
    // reset image adjustments on opening new book
    setRotationAngle(0);
    setScannedContrast(100);
    setInkBoldness(false);
    setInvertedScan(false);
  };

  const handlePageChange = (pageNum: number) => {
    if (!activeReadingBook) return;
    const maxPages = activeReadingBook.pages.length;
    if (pageNum < 1 || pageNum > maxPages) return;

    if (isSpeaking) handleStopTTS();

    setReaderPage(pageNum);
    const nextPages = { ...currentPages, [activeReadingBook.id]: pageNum };
    setCurrentPages(nextPages);
    localStorage.setItem(KEYS.CURRENT_PAGES, JSON.stringify(nextPages));
  };

  // TTS Reader
  const handlePlayTTS = () => {
    if (!activeReadingBook) return;
    const pageObj = activeReadingBook.pages.find(p => p.pageNumber === readerPage);
    if (!pageObj) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `${pageObj.chapterTitle}. ${pageObj.content}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ps-AF'; 
      utterance.rate = ttsSpeed;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      triggerToast("ستاسو دغه ویب براوزر له غږ لوستونکي ملاتړ نه کوي.", "error");
    }
  };

  const handleStopTTS = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleExportBook = (book: Book) => {
    setBookToExport(book);
    setShowStoragePermissionDialog(true);
  };

  const confirmAndExportBook = async () => {
    if (!bookToExport) return;
    setShowStoragePermissionDialog(false);

    try {
      if (Capacitor.isNativePlatform()) {
        try {
          if (Filesystem && typeof Filesystem.checkPermissions === 'function') {
            const status = await Filesystem.checkPermissions();
            const perm = status.publicStorage || (status as any).storage;
            if (perm !== 'granted') {
              if (typeof Filesystem.requestPermissions === 'function') {
                const requestStatus = await Filesystem.requestPermissions();
                const reqPerm = requestStatus.publicStorage || (requestStatus as any).storage;
                if (reqPerm !== 'granted') {
                  console.warn("Permission denied by user natively, trying to save anyway");
                }
              }
            }
          }
        } catch (permerr) {
          console.warn("Native permission check failed or unsupported", permerr);
        }
      }

      triggerToast("د کتاب کښته کولو چمتووالی...", "info");
      const result = await exportBookToPublicStorage(bookToExport);
      if (result.success) {
        triggerToast(`«${bookToExport.pashtoTitle}» کتاب ډاونلوډ او په بریا سره ستاسو په آلې کې خوندي شو!`, 'success');
      }
    } catch (exportErr: any) {
      console.error("Failed book export", exportErr);
      triggerToast("د کتاب ډاونلوډ کولو کې تېروتنه: " + (exportErr?.message || "مهرباني وکړئ بیا هڅه وکړئ"), "error");
    } finally {
      setBookToExport(null);
    }
  };

  const handleToggleBookmarkCurrent = () => {
    if (!activeReadingBook) return;
    const currentList = bookmarks[activeReadingBook.id] || [];
    let nextList: number[];
    if (currentList.includes(readerPage)) {
      nextList = currentList.filter(p => p !== readerPage);
      triggerToast("بوکمارک لرې شو.", "info");
    } else {
      nextList = [...currentList, readerPage].sort((a,b)=>a-b);
      triggerToast("دا مخ بوکمارک شو!", "success");
    }
    const nextBms = { ...bookmarks, [activeReadingBook.id]: nextList };
    setBookmarks(nextBms);
    localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(nextBms));
  };

  const handleAddAnnotation = () => {
    if (!newAnnotationText.trim() || !activeReadingBook) return;
    const list = annotations[activeReadingBook.id] || [];
    const newAnn = {
      id: `ann_${Date.now()}`,
      page: readerPage,
      text: newAnnotationText.trim(),
      date: new Date().toLocaleDateString('ps-AF', { year:'numeric', month:'short', day:'numeric' })
    };
    const nextList = [...list, newAnn];
    const nextAnns = { ...annotations, [activeReadingBook.id]: nextList };
    setAnnotations(nextAnns);
    localStorage.setItem(KEYS.ANNOTATIONS, JSON.stringify(nextAnns));
    setNewAnnotationText('');
    triggerToast("ستاسو نظر په پایله کې خوندي شو!", "success");
  };

  const handleDeleteAnnotation = (bookId: string, id: string) => {
    const list = annotations[bookId] || [];
    const next = list.filter(a => a.id !== id);
    const nextAnns = { ...annotations, [bookId]: next };
    setAnnotations(nextAnns);
    localStorage.setItem(KEYS.ANNOTATIONS, JSON.stringify(nextAnns));
    triggerToast("یادښت حذف شو.", "info");
  };

  const handleResetSettings = () => {
    if (window.confirm("ایا غواړئ ټول تنظیمات او پرمختګونه صفر کړئ؟")) {
      localStorage.clear();
      setSelectedTheme(APP_THEMES[0]);
      setBookmarks({});
      setAnnotations({});
      setCurrentPages({});
      setTotalReadingTime(0);
      setUserName('محترم لوستونکی');
      setTtsSpeed(0.95);
      setShowSettingsModal(false);
      triggerToast("ټول معلومات له منځه لاړل.", "info");
    }
  };

  const toggleDayNight = () => {
    if (selectedTheme.isDark) {
      const lightTheme = APP_THEMES.find(t => t.id === 'ivory-day') || APP_THEMES[1];
      setSelectedTheme(lightTheme);
      localStorage.setItem(KEYS.THEME_ID, lightTheme.id);
      triggerToast("د رڼا (ورځې) حالت فعال شو", "success");
    } else {
      const darkTheme = APP_THEMES.find(t => t.id === 'slate-dark') || APP_THEMES[0];
      setSelectedTheme(darkTheme);
      localStorage.setItem(KEYS.THEME_ID, darkTheme.id);
      triggerToast("د شپې (تاریک) حالت فعال شو", "success");
    }
  };

  // Filtering
  const filteredBooks = books.filter(book => {
    return (
      book.pashtoTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }).sort((a, b) => a.pashtoTitle.localeCompare(b.pashtoTitle));

  // Calculate dynamic scan CSS styles based on new custom settings
  const getSimulatedReaderStyle = () => {
    let scaleVal = readerZoom / 100;
    if (readerFit === 'width') scaleVal = 1.35;
    if (readerFit === 'page') scaleVal = 0.95;

    return {
      transform: `scale(${scaleVal}) rotate(${rotationAngle}deg)`,
      transformOrigin: 'top center',
      maxWidth: '100%',
      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      filter: `brightness(${brightnessLevel}%) contrast(${scannedContrast}%) ${invertedScan ? 'invert(1) grayscale(1)' : ''} ${inkBoldness ? 'contrast(1.8) brightness(0.9) grayscale(1)' : ''}`,
    };
  };

  return (
    <div className={`min-h-screen ${selectedTheme.bg} ${selectedTheme.text} flex flex-col font-sans transition-all duration-300 antialiased selection:bg-amber-500 selection:text-black`} id="main_wrapper">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-3 left-3 z-[100] px-4 py-2 bg-slate-900 border border-amber-500/30 text-white rounded-lg text-xs shadow-xl flex items-center gap-2 animate-slow-fade-in">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <p>{toast.message}</p>
        </div>
      )}

      {/* 1. PROFESSIONAL COMPACT SPLASH SCREEN */}
      {showSplashScreen && (
        <div className="fixed inset-0 z-50 bg-[#070d19] text-white flex flex-col items-center justify-between p-6 text-center animate-slow-fade-in" id="splash_screen_viewport">
          <div className="absolute inset-3 border border-amber-500/10 pointer-events-none rounded-lg"></div>
          <div></div>

          <div className="flex flex-col items-center gap-4 max-w-sm">
            <div className="relative w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500/20 to-transparent border border-amber-500/30 shadow-xl animate-pulse">
              <BookIcon className="w-8 h-8 text-amber-400" />
              <Sparkles className="w-4 h-4 text-sky-400 absolute -top-1 -right-1" />
            </div>

            <div className="space-y-1 text-center">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                المکتبة المدنیة الشیخ المهاجر المدني
              </h1>
              <p className="text-[10px] text-amber-500/60 font-semibold uppercase tracking-widest">
                ۲۲ د آنلاین او آفلاین تصویري لوستلو بې‌ساري کتابونه
              </p>
            </div>

            {/* Micro loading progress */}
            <div className="w-48 bg-slate-950/80 rounded-full h-1 p-0.5 border border-slate-900 relative overflow-hidden mt-1">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${splashProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 z-10 w-full max-w-xs">
            <div className="bg-slate-950/60 px-4 py-2.5 rounded-lg border border-slate-900 w-full text-center space-y-1.5">
              <div>
                <span className="text-[8px] text-amber-500 tracking-wider block font-bold">خپرونکی او ترتیب کوونکی:</span>
                <p className="text-xs font-bold text-slate-100">مفتي ولي الرحمن متوکل</p>
              </div>
              <div className="border-t border-slate-900 pt-1">
                <span className="text-[7.5px] text-slate-400 block">کاريال جوړونکی : خبيب تکل</span>
              </div>
            </div>

            <div className="text-amber-500/80 text-[10.5px] py-2 animate-pulse font-medium font-sans">
              د المکتبة المدنیة د بشپړ افلاین منځپانګې د بارولو بهیر...
            </div>
          </div>
        </div>
      )}

      {/* 2. ULTRALIGHT COMPACT HEADER */}
      <header className={`${selectedTheme.headerBg} border-b ${selectedTheme.border} sticky top-0 z-40 transition-all`} id="app_header">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="p-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 shrink-0">
              <BookIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-500" />
            </div>
            <div className="text-right">
              <h1 className="text-[10px] sm:text-xs md:text-sm font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent truncate max-w-[155px] sm:max-w-none">
                المکتبة المدنیة الشیخ المهاجر المدني
              </h1>
              <p className="text-[7.5px] sm:text-[9px] opacity-60">کاريال جوړونکی: خبيب تکل</p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Day/Night toggle button */}
            <button
              onClick={toggleDayNight}
              className={`p-1 sm:p-1.5 rounded border ${selectedTheme.border} ${selectedTheme.cardBg} hover:opacity-95 text-[10px] font-bold transition flex items-center justify-center cursor-pointer`}
              title="د شپې او ورځې بدلون"
              id="day_night_toggle_btn"
            >
              {selectedTheme.isDark ? (
                <span className="text-amber-400 font-bold text-[9px] sm:text-[10px] flex items-center gap-0.5 animate-slow-fade-in">
                  <span>☀️</span>
                  <span className="hidden sm:inline pr-0.5">د ورځې رڼا</span>
                </span>
              ) : (
                <span className="text-indigo-600 font-bold text-[9px] sm:text-[10px] flex items-center gap-0.5 animate-slow-fade-in">
                  <span>🌙</span>
                  <span className="hidden sm:inline pr-0.5">د شپې تیاره</span>
                </span>
              )}
            </button>

            {/* Quick Author Biography button */}
            <button 
              onClick={() => setShowAuthorBioModal(true)}
              className="p-1 sm:px-2.5 sm:py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[9px] sm:text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1"
              id="about_author_btn"
              title="د لیکوال مبارک ژوند او تالیفات"
            >
              <User className="w-3.5 h-3.5" /> 
              <span className="hidden sm:inline">د لیکوال په اړه</span>
            </button>

            {/* Quick Contact button */}
            <button 
              onClick={() => setShowContactDialog(true)}
              className="p-1 sm:px-2.5 sm:py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[9px] sm:text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1"
              id="contact_us_btn"
              title="اړیکه موږ سره"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">اړیکه موږ سره</span>
            </button>

            {/* Settings trigger */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className={`p-1.5 rounded border ${selectedTheme.border} ${selectedTheme.cardBg} hover:opacity-80 flex items-center justify-center`}
              title="ترتیبات"
              id="header_settings_btn"
            >
              <Settings className="w-3.5 h-3.5 text-amber-500" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. MAIN COMPACT EXPLORE SECTION - EXQUISITE AND TIGHT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-4 space-y-4" id="main_content_area">
        
        {/* COMPACT HERO CAROUSEL - MINIMIZED & COMPACTED */}
        <div className={`p-2.5 rounded-xl border ${selectedTheme.border} ${selectedTheme.cardBg} relative overflow-hidden shadow-sm`} id="featured_books_carousel">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-row items-center gap-3 text-right">
            
            {/* Book Beautiful Custom Cover */}
            <div className="shrink-0 shadow-sm">
              {books[carouselIndex] && <BookCover book={books[carouselIndex]} size="sm" />}
            </div>

            {/* Carousel mini Info */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/10 text-[8px] px-1.5 py-0.2 rounded font-bold">
                  وړاندیز شوی اثر
                </span>
                <span className="text-[8px] text-current opacity-60">
                  لیکوال: {books[carouselIndex]?.author} • اندازه: {books[carouselIndex]?.size}
                </span>
              </div>
              
              <h3 className="text-[11.5px] font-bold text-current">
                {books[carouselIndex]?.pashtoTitle}
              </h3>
              
              <p className="text-[10px] text-current opacity-70 line-clamp-1 leading-normal">
                {books[carouselIndex]?.description}
              </p>

              <div className="flex gap-2 justify-end items-center pt-0.5">
                {/* Dots indicator */}
                <div className="flex gap-0.5 ml-auto">
                  {books.slice(0, 5).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCarouselIndex(idx)}
                      className={`h-1 rounded-full transition-all cursor-pointer ${carouselIndex === idx ? 'w-2 bg-amber-500' : 'w-1 bg-current opacity-20'}`}
                    />
                  ))}
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => setActiveBook(books[carouselIndex])}
                    className={`px-2 py-0.5 border ${selectedTheme.border} text-xs text-current font-bold h-max hover:opacity-85 text-[9px] rounded-md transition`}
                  >
                    تفصیل
                  </button>
                  <button
                    onClick={() => handleStartReading(books[carouselIndex])}
                    className="px-2 py-0.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[9px] font-bold rounded-md flex items-center gap-0.5 h-max cursor-pointer"
                  >
                    <BookOpen className="w-3 h-3" /> لوستل
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* DEDICATED ARRANGER & COMPILER CARD */}
        <div className={`p-3 rounded-xl border ${selectedTheme.border} bg-gradient-to-l from-amber-500/5 to-transparent relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-3`} id="compiler_dedicated_sec">
          <div className="absolute top-0 left-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="flex items-center gap-2.5 text-right w-full sm:w-auto">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 shrink-0">
              <Award className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[8px] uppercase tracking-wider text-amber-500 font-bold block">د کاريال د کتابونو او تالیفاتو تنظیم کوونکی</span>
              <h4 className="text-xs font-bold text-current">د علمي بورډ مشر او خپرونکی: مفتي ولي الرحمن متوکل</h4>
              <p className="text-[9.5px] opacity-70 mt-0.5">الحاج ګل الرحمن حقاني «الهماجر المدني» د اثارو او خپرونو د علمي کتنې او بیا کتنې مشر او ترتیب کوونکی.</p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 w-full sm:w-auto justify-end">
            <button 
              onClick={() => setShowAuthorBioModal(true)}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[9.5px] transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
            >
              کامل پېژندلیک او تالیفات
            </button>
          </div>
        </div>

        {/* TIGHT FILTERS CONTROL DECK */}
        <div className={`p-2 rounded-xl border ${selectedTheme.border} ${selectedTheme.cardBg} space-y-2`} id="filters_control_bar">
          <div className="flex flex-col sm:flex-row gap-2 items-center justify-between w-full" id="filters_control_bar_inside">
            
            {/* Search query INPUT */}
            <div className="relative w-full sm:flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 opacity-50 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="کتاب نوم یا لیکوال وپلټئ..."
                className={`w-full pl-8 pr-3 py-1 bg-slate-900 border ${selectedTheme.border} rounded text-right text-xs focus:outline-none focus:border-amber-500 text-current`}
              />
            </div>

            {/* List and Grid view toggler buttons */}
            <div className="flex gap-1 shrink-0 w-full sm:w-auto justify-end">
              <button
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 rounded-md border text-[9.5px] font-bold transition flex items-center gap-0.5 cursor-pointer ${
                  viewMode === 'list' 
                  ? 'bg-amber-500 border-amber-500 text-slate-950' 
                  : `${selectedTheme.border} bg-slate-950/20 text-current opacity-70 hover:opacity-100`
                }`}
                id="list_view_btn"
              >
                لیست بڼه
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-md border text-[9.5px] font-bold transition flex items-center gap-0.5 cursor-pointer ${
                  viewMode === 'grid' 
                  ? 'bg-amber-500 border-amber-500 text-slate-950' 
                  : `${selectedTheme.border} bg-slate-950/20 text-current opacity-70 hover:opacity-100`
                }`}
                id="grid_view_btn"
              >
                ګریډ بڼه
              </button>
            </div>

          </div>
        </div>

        {/* ULTRA-COMPACT BOOKS LIST/GRID CARD ROW */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-10 space-y-1">
            <p className="text-xs text-slate-500">ستاسو د لټون اړوند هیڅ کتاب ونه موندل شو.</p>
            <button onClick={() => setSearchQuery('')} className="text-xs text-amber-500 underline">لټون پاکول</button>
          </div>
        ) : viewMode === 'list' ? (
          /* NEW OPTIMIZED HORIZONTAL COMPACT LIST VIEW */
          <div className="flex flex-col gap-2">
            {filteredBooks.map((book) => {
              const savedProgress = currentPages[book.id];
              return (
                <div
                  key={book.id}
                  className={`rounded-lg border ${selectedTheme.border} ${selectedTheme.cardBg} p-2 flex items-center justify-between gap-3 group transition-all`}
                >
                  <div className="flex items-center gap-3 text-right">
                    <div className="shrink-0 shadow-xs">
                      <BookCover book={book} size="sm" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[7.5px] bg-emerald-500/10 text-emerald-400 px-1 py-0.2 rounded font-bold">
                        {book.categoryLabel}
                      </span>
                      <h3 className="text-xs font-bold text-current line-clamp-1 group-hover:text-amber-500 transition-colors">
                        {book.pashtoTitle}
                      </h3>
                      <p className="text-[10px] text-current opacity-60 line-clamp-1">
                        {book.author} • {book.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {savedProgress && (
                      <span className="text-[8.5px] border border-amber-500/15 bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded">
                        مخ {savedProgress} / {book.pages.length}
                      </span>
                    )}
                    
                    <button
                      onClick={() => setActiveBook(book)}
                      className={`px-2 py-1 border ${selectedTheme.border} rounded text-[9px] text-current hover:opacity-85 transition`}
                    >
                      تفصیل
                    </button>

                    {/* Download section removed per user request */}

                    <button
                      onClick={() => handleStartReading(book)}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[9px] font-bold rounded flex items-center gap-0.5 cursor-pointer"
                    >
                      لوستل
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* HIGHLY POLISHED COMPACT GRID VIEW */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredBooks.map((book) => {
              const savedProgress = currentPages[book.id];
              return (
                <div
                  key={book.id}
                  className={`rounded-lg border ${selectedTheme.border} ${selectedTheme.cardBg} overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-1 group`}
                >
                  
                  {/* Minimized Scanned book Cover preview */}
                  <div className="shrink-0 select-none border-b border-amber-500/5">
                    <BookCover book={book} size="md" />
                  </div>

                  {/* Details section */}
                  <div className="p-2 flex-1 flex flex-col justify-between space-y-1.5 text-right">
                    <div className="space-y-0.5 text-right">
                      <span className="text-[7.5px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                        {book.categoryLabel}
                      </span>
                      <h3 className="text-[10.5px] font-bold text-current line-clamp-1 group-hover:text-amber-500 transition-colors">
                        {book.pashtoTitle}
                      </h3>
                      <p className="text-[9.5px] text-current opacity-60 line-clamp-2 leading-normal">
                        {book.description}
                      </p>
                    </div>

                    {/* Progress indicator */}
                    {savedProgress && (
                      <div className="bg-slate-950/20 p-1 rounded border border-amber-500/10 flex justify-between text-[7.5px] text-amber-500">
                        <span>پاڼه: {savedProgress} / {book.pages.length}</span>
                        <span className="opacity-60 text-right">ښود موند خوښ</span>
                      </div>
                    )}

                    <div className={`flex justify-between gap-1 pt-1 border-t ${selectedTheme.border}`}>
                      <button
                        onClick={() => setActiveBook(book)}
                        className={`px-1.5 py-0.5 border ${selectedTheme.border} rounded text-[8.5px] text-current opacity-70 hover:opacity-100`}
                      >
                        تفصیل
                      </button>

                      <div className="flex gap-1.5">
                        {/* Download section removed per user request */}
                        <button
                          onClick={() => handleStartReading(book)}
                          className="px-2 py-0.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[8.5px] font-bold rounded-md flex items-center gap-0.5 cursor-pointer"
                        >
                          لوستل
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* 4. DETAIL BANNER DIALOG */}
      {activeBook && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4" id="book_info_overlay">
          <div className={`${selectedTheme.cardBg} border ${selectedTheme.border} rounded-xl w-full max-w-sm overflow-hidden animate-slow-fade-in relative shadow-xl text-right p-4 space-y-4`}>
            
            <div className="flex justify-between items-start">
              <button 
                onClick={() => setActiveBook(null)}
                className={`p-1 rounded-md border ${selectedTheme.border} ${selectedTheme.cardBg} text-current opacity-70 hover:opacity-100 cursor-pointer`}
              >
                <X className="w-4 h-4" />
              </button>
              <span className="text-[9px] bg-amber-500/15 text-amber-500 px-2 py-0.5 rounded font-extrabold pb-1">
                کتاب پېژندنه او مالومات
              </span>
            </div>

            {/* Centered Cover in details modal */}
            <div className="flex justify-center py-2 bg-slate-950/20 rounded-lg p-2.5">
              <BookCover book={activeBook} size="lg" />
            </div>

            <div className={`space-y-1 pb-2 border-b ${selectedTheme.border}`}>
              <h2 className="text-sm font-bold text-current">{activeBook.pashtoTitle}</h2>
              <p className="text-[10px] text-sky-500">لیکوال: {activeBook.author}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] text-right">
              <div className={`bg-slate-950/20 p-2 rounded-lg border ${selectedTheme.border}`}>
                <span className="opacity-55 block text-[9px]">کټګوري:</span>
                <span className="font-bold text-amber-500 text-[9.5px]">{activeBook.categoryLabel}</span>
              </div>
              <div className={`bg-slate-950/20 p-2 rounded-lg border ${selectedTheme.border}`}>
                <span className="opacity-55 block text-[9px]">اندازه:</span>
                <span className="font-bold text-amber-500 text-[9.5px]">{activeBook.size}</span>
              </div>
              <div className={`bg-slate-950/20 p-2 rounded-lg border ${selectedTheme.border}`}>
                <span className="opacity-55 block text-[9px]">خپرندویه تاریخ:</span>
                <span className="font-bold text-amber-500 text-[9.5px]">{activeBook.publishedYear}</span>
              </div>
              <div className={`bg-slate-950/20 p-2 rounded-lg border ${selectedTheme.border}`}>
                <span className="opacity-55 block text-[9px]">سکان نښه:</span>
                <span className="font-bold text-sky-500 text-[9px]">تصویري لوړ کیفیت</span>
              </div>
            </div>

            <p className="text-[11px] leading-relaxed text-current opacity-80">
              {activeBook.description}
            </p>

            <div className="pt-2">
              <button
                onClick={() => handleStartReading(activeBook)}
                className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[11px] transition cursor-pointer text-center"
              >
                مطالعه پیل کړه
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. OVERHAULED PDF VIEWER WORKSPACE - ULTRAPOLISHED REDESIGN FOR PICTORIAL/SCANNED PDFs */}
      {activeReadingBook && (
        <div className="fixed inset-0 z-50 bg-[#080d1a] text-white flex flex-col justify-between overflow-hidden" id="active_reader_workspace">
          
          {/* A. REDESIGNED NEW ULTRALIGHT MINIMALIST HEADER BAR */}
          <div className="bg-slate-950/90 border-b border-slate-800 p-2 px-3 flex items-center justify-between gap-2 relative z-30">
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  handleStopTTS();
                  setActiveReadingBook(null);
                }}
                className="p-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200"
                title="بندول"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-right">
                <span className="text-[7.5px] bg-amber-500/10 text-amber-500 px-1.5 rounded font-bold block ml-auto w-max">
                  {activeReadingBook.categoryLabel}
                </span>
                <h2 className="text-[11px] font-bold text-zinc-100 truncate mt-0.5">{activeReadingBook.pashtoTitle}</h2>
              </div>
            </div>

            {/* B. MID ZONE: COMPACT CENTRALIZED SLICK CONTROL DECK */}
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto flex-nowrap max-w-[65%] sm:max-w-none scrollbar-none justify-end pb-0.5">
              
              {/* PAGE COUNTER & FORM */}
              <div className="flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-800 text-[10px] sm:text-xs">
                <button
                  onClick={() => handlePageChange(readerPage - 1)}
                  disabled={readerPage === 1}
                  className="p-1 rounded text-slate-400 hover:bg-slate-800 disabled:opacity-30 block"
                  title="مخکینۍ پاڼه"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
                <span className="font-mono font-bold text-amber-500">{readerPage}</span>
                <span className="opacity-40 font-mono">/</span>
                <span className="font-mono opacity-80">{activeReadingBook.pages.length}</span>
                <button
                  onClick={() => handlePageChange(readerPage + 1)}
                  disabled={readerPage === activeReadingBook.pages.length}
                  className="p-1 rounded text-slate-400 hover:bg-slate-800 disabled:opacity-30 block"
                  title="راتلونکې پاڼه"
                >
                  <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>

              {/* RETRO SLICK IMAGE ADJUSTMENT POPUP CONTROLS */}
              <div className="flex items-center gap-0.5 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                {/* ZOOM OUT */}
                <button 
                  onClick={() => { setReaderFit('custom'); setReaderZoom(prev => Math.max(50, prev - 10)); }}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400"
                  title="وړوکي کول"
                >
                  <ZoomOut className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
                <span className="text-[8.5px] sm:text-[9.5px] font-mono text-zinc-300 w-6 sm:w-8 text-center">{readerZoom}%</span>
                {/* ZOOM IN */}
                <button 
                  onClick={() => { setReaderFit('custom'); setReaderZoom(prev => Math.min(250, prev + 10)); }}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400"
                  title="لوسترول"
                >
                  <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>

              {/* SCANNED PDF ENHANCEMENTS TOOL PANEL */}
              <div className="flex items-center gap-0.5 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px] sm:text-xs">
                {/* Rotate CW 90 deg */}
                <button
                  onClick={() => {
                    const nextAngle = (rotationAngle + 90) % 360;
                    setRotationAngle(nextAngle);
                    triggerToast(`پاڼه ۹۰ درکې وغبرګول شوه!`, 'info');
                  }}
                  className="p-1 rounded text-sky-400 hover:bg-slate-850"
                  title="انځور روتېشن"
                >
                  <RotateCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
                
                {/* Contrast Toggle */}
                <button
                  onClick={() => {
                    const next = scannedContrast === 100 ? 150 : scannedContrast === 150 ? 180 : 100;
                    setScannedContrast(next);
                    triggerToast(`روښانوالی تضاد شو: ${next}%`, 'info');
                  }}
                  className={`p-1 rounded ${scannedContrast !== 100 ? 'text-amber-500' : 'text-slate-400'}`}
                  title="تصویري تضاد (High Contrast)"
                >
                  <Sliders className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>

                {/* Ink Boldness enhancer key */}
                <button
                  onClick={() => {
                    setInkBoldness(!inkBoldness);
                    triggerToast(inkBoldness ? "توند رنګ ليرې شو" : "د رنګ توندوالی فعال شو!", 'info');
                  }}
                  className={`p-1 rounded ${inkBoldness ? 'text-emerald-400 bg-slate-800' : 'text-slate-400'}`}
                  title="د تورو توندوالی"
                >
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>

                {/* Inverted scanned colors (Night scan) */}
                <button
                  onClick={() => {
                    setInvertedScan(!invertedScan);
                    triggerToast(invertedScan ? "معکوس حالت بند شو" : "معکوس کونکي رڼا (Night scan) فعاله شوه", 'info');
                  }}
                  className={`p-1 rounded ${invertedScan ? 'text-rose-400 bg-slate-800' : 'text-slate-400'}`}
                  title="بدل رنګ لوستونکي موډ"
                >
                  <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>

              {/* AUDIO READ ALOUD */}
              <button
                onClick={isSpeaking ? handleStopTTS : handlePlayTTS}
                className={`p-1 rounded sm:p-1.5 transition ${isSpeaking ? 'bg-emerald-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-300'}`}
                title="غږیز لوستونکی"
              >
                {isSpeaking ? <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" /> : <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />}
              </button>

            </div>

          </div>

          {/* C. ACTIVE SCANNED ENGINE SPLIT SCREEN LAYOUT */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 overflow-hidden relative" id="reader_viewport_split">
            
            {/* SENSORY SHADOW FRAME WORKSPACE FOR OPTIMIZED CONTROLS */}
            {!isFullscreen && (
              <div className="bg-slate-950/90 border-r border-slate-800 hidden lg:flex flex-col p-3 space-y-4 text-right overflow-y-auto" id="reader_side_settings">
                
                {/* Advanced Contrast Settings & Presets */}
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800/80 space-y-2">
                  <h4 className="text-[10px] font-bold text-amber-500 uppercase">د سکن شوي پاڼې تضاد او کیفیت اصلاح</h4>
                  
                  <div className="space-y-2 text-[10.5px]">
                    
                    {/* Contrast slider element */}
                    <div className="space-y-1">
                      <span className="text-[9px] opacity-60 block">د انځور تضاد (Contrast): {scannedContrast}%</span>
                      <input 
                        type="range"
                        min="80"
                        max="200"
                        value={scannedContrast}
                        onChange={(e) => setScannedContrast(Number(e.target.value))}
                        className="w-full accent-amber-500 h-1 cursor-pointer"
                      />
                    </div>

                    {/* Margins Crop Option */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                      <button 
                        onClick={() => {
                          setCropMargins(!cropMargins);
                          triggerToast(cropMargins ? "حاشیې عادي شوې" : "د حاشیو پاکوالی د پوره انځور لپاره رامنځته شو", "info");
                        }}
                        className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${cropMargins ? 'bg-amber-500 text-black' : 'bg-slate-950 border border-slate-800 text-slate-400'}`}
                      >
                        {cropMargins ? "فعاله ده (Clipped)" : "بنده (Full Scan)"}
                      </button>
                      <span className="text-[9.5px] opacity-70">سپینې حاشیې پرې کول:</span>
                    </div>

                    {/* Screen Brightness Slider */}
                    <div className="pt-2 border-t border-slate-850">
                      <span className="text-[9px] opacity-60 block">د سکرین د لید روښانتیا: {brightnessLevel}%</span>
                      <input 
                        type="range"
                        min="30"
                        max="100"
                        value={brightnessLevel}
                        onChange={(e) => setBrightnessLevel(Number(e.target.value))}
                        className="w-full h-1 accent-indigo-500 cursor-pointer"
                      />
                    </div>

                  </div>
                </div>



                {/* Table of contents page jumps index */}
                <div className="space-y-1 max-h-36 overflow-y-auto pr-0.5 text-right">
                  <span className="text-[10px] font-bold text-slate-400">فهرست او د منځپانګې مخونه:</span>
                  {activeReadingBook.pages.map(p => (
                    <button
                      key={p.pageNumber}
                      onClick={() => handlePageChange(p.pageNumber)}
                      className={`w-full p-1.5 text-right text-[10px] rounded block truncate transition ${p.pageNumber === readerPage ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15' : 'hover:bg-slate-900 border border-transparent text-slate-400'}`}
                    >
                      {p.pageNumber}. {p.chapterTitle}
                    </button>
                  ))}
                </div>

              </div>
            )}

            {/* MAIN VIEWER PORT: STYLED SCANNED VINTAGE PAPER CANVAS */}
            <div className={`col-span-1 ${isFullscreen ? 'lg:col-span-4' : 'lg:col-span-3'} overflow-y-auto px-4 py-6 flex items-start justify-center relative hide-scrollbar`} id="scanned_pdf_viewport_canvas">
              
              {/* Dynamic brightness overlay */}
              <div 
                className="absolute inset-0 bg-black pointer-events-none z-40 transition-opacity"
                style={{ opacity: `${(100 - brightnessLevel) / 100 * 0.7}` }}
              ></div>

              <div 
                className={`w-full max-w-xl rounded-xl relative shadow-2xl overflow-hidden text-slate-950 leading-relaxed text-right transition-all duration-300 ${
                  cropMargins ? 'p-3 md:p-5' : 'p-6 md:p-8'
                } ${
                  invertedScan 
                  ? 'bg-zinc-950 text-slate-100 border border-zinc-900' 
                  : 'scanned-vintage-paper' // default cream vintage look
                }`}
                style={getSimulatedReaderStyle()}
                id="physical_paper_sheet"
              >
                
                {/* Vintage scanner elements */}
                <div className="absolute top-0 bottom-0 left-3 w-px bg-rose-500/20 pointer-events-none"></div>

                {/* Running head of the page */}
                <div className="flex items-center justify-between border-b border-black/10 pb-2 mb-4 font-mono text-[9px] opacity-75">
                  <span>المکتبة المدنیة الشیخ المهاجر المدني</span>
                  <span className="font-bold">مخ: {readerPage} د {activeReadingBook.pages.length}</span>
                </div>

                {/* Unique scan certification imprint */}
                <div className="absolute top-20 right-8 w-16 h-16 border-2 border-rose-500/20 rounded-full flex items-center justify-center text-rose-550/20 font-extrabold text-[7px] rotate-12 pointer-events-none z-10 select-none uppercase">
                  د تفتیش نښان
                </div>

                {/* Scanned manuscript text displaying */}
                <div className="space-y-4">
                  <h2 className="text-md md:text-lg font-bold border-r-3 border-amber-500 pr-2 leading-snug">
                    {activeReadingBook.pages.find(p => p.pageNumber === readerPage)?.chapterTitle}
                  </h2>
                  <p className="text-[9px] text-slate-400 select-none leading-none">
                    [د انځور د پکسلو کیفیت چمتو دی - د لوستلو ښه والي لپاره د تضاد د کنټرول ټنبو څخه ګټه واخلئ]
                  </p>
                  
                  {/* Text Container stylized with scanned ink look */}
                  <p className="text-[13px] md:text-[14px] leading-loose text-justify whitespace-pre-line pr-1 font-serif tracking-wide text-[#160e05]" 
                     style={{ color: invertedScan ? '#eceff4' : '#140c03' }}>
                    {activeReadingBook.pages.find(p => p.pageNumber === readerPage)?.content}
                  </p>
                </div>

                {/* Stamp visual corner markers */}
                <div className="absolute top-2 left-2 border-t-2 border-l-2 border-black/10 w-2.5 h-2.5 pointer-events-none"></div>
                <div className="absolute top-2 right-2 border-t-2 border-r-2 border-black/10 w-2.5 h-2.5 pointer-events-none"></div>
                <div className="absolute bottom-2 left-2 border-b-2 border-l-2 border-black/10 w-2.5 h-2.5 pointer-events-none"></div>
                <div className="absolute bottom-2 right-2 border-b-2 border-r-2 border-black/10 w-2.5 h-2.5 pointer-events-none"></div>

                {/* Running Footer within paper */}
                <div className="border-t border-black/10 pt-3 mt-6 opacity-60 text-[9px] text-center">
                  تصویري کتاب د لوستلو مخ • ټول حقوق کاريال جوړونکی : خبيب تکل سره خوندي دي
                </div>

              </div>

            </div>

          </div>

          {/* D. RUNNING MINI FOOTER INDICATOR */}
          <div className="bg-slate-950/90 border-t border-slate-800 p-2 px-3 flex justify-between items-center z-30">
            <span className="text-[9px] opacity-50">تضاد اصلاح: {scannedContrast}% | د مخ څرخېدلو درجو: {rotationAngle}°</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => handlePageChange(readerPage - 1)}
                disabled={readerPage === 1}
                className="px-2.5 py-0.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded text-[10px] disabled:opacity-30"
              >
                مخکینی
              </button>
              <div className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-[10px] font-bold text-amber-500 rounded">
                پاڼه {readerPage}
              </div>
              <button
                onClick={() => handlePageChange(readerPage + 1)}
                disabled={readerPage === activeReadingBook.pages.length}
                className="px-2.5 py-0.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded text-[10px] disabled:opacity-30"
              >
                بل مخ
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 5. AUTHOR BIOGRAPHY MODAL */}
      {showAuthorBioModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#090f1d] border border-amber-500/25 rounded-xl w-full max-w-lg overflow-hidden animate-slow-fade-in text-right flex flex-col max-h-[85vh] shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            
            {/* Header */}
            <div className="bg-slate-950 p-4 flex justify-between items-center border-b border-amber-500/10">
              <button onClick={() => setShowAuthorBioModal(false)} className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer transition">
                <X className="w-4 h-4" />
              </button>
              <div className="text-right">
                <h3 className="font-bold text-xs text-amber-500 flex items-center gap-1 justify-end">
                  <Award className="w-4 h-4 text-amber-500 animate-pulse" /> دلیکوال مبارک پېژندلیک او بیوګرافي
                </h3>
                <span className="text-[9px] text-[#8e9bb4]">د علم او تحقیق په ډګر کې یو ځلانده ستوری</span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 overflow-y-auto space-y-4 text-slate-200 text-xs leading-relaxed dir-rtl max-h-[calc(85vh-120px)] space-y-3 font-sans">
              
              {/* Profile Bio Cover style */}
              <div className="bg-gradient-to-l from-slate-950 to-slate-900 p-4 rounded-xl border border-amber-500/10 text-right space-y-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
                
                <h4 className="text-sm font-bold text-amber-400">
                  د علم او تحقیق په ډګر کې یو ځلانده ستوری: څېړنوال  شیخ القرآن والحدیث الحاج ګل الرحمن  حقاني «الهماجر المدني»
                </h4>
                
                <p className="text-[11px] text-slate-300">
                  د پوهې او فضیلت په دې کاروان کې، د پکتیا د ځاځي اریوب د خیرمینې د سیمې یو علمي شخصیت، څېړنوال  شیخ القرآن والحدیث الحاج ګل الرحمن  حقاني«الهماجر المدني» د خپلو دیني او علمي هڅو په مټ د ټولنې د خدمت لپاره ملا تړلې ده. نوموړی چې د حافظ تراب خان لمسی او د حاجي عبد الرحمن زوی دی، په ۱۳۴۸ هجري لمریز کال کې دې نړۍ ته سترګې پرانیستې.
                </p>
              </div>

              {/* Journey details */}
              <div className="space-y-1.5 p-3 bg-slate-950/40 rounded-lg border border-slate-800/80 text-right font-sans">
                <h5 className="font-bold text-amber-400 text-xs border-b border-slate-800 pb-1 flex items-center gap-1 justify-end">
                  <span>علمي او دیني سفر</span>
                  <Compass className="w-3.5 h-3.5 text-amber-500" />
                </h5>
                <p className="text-[11px] text-slate-300 text-right">
                  ښاغلي الهماجر المدني خپلې لومړنۍ دیني زده کړې د خیبر پښتونخوا په «مفتاح العلوم» مدرسه کې پیل او د حدیثو لوړه دوره یې د «دارالعلوم حقانیه» په مشهور علمي مرکز کې په بریالیتوب سره پای ته ورسوله. د هغه علمي سفر یوازې په دیني علومو پورې محدود پاتې نه شو، بلکې د وزارت معارف او د علومو اکاډمۍ د جیدو علماوو په وړاندې یې په خپلو علمي ازموینو کې د «ممتاز لیسانس» او «محقق» درجې ترلاسه کړې. نوموړی اوسمهال د علومو اکاډمۍ د «سر محقق معاون» په رتبه، د «تفسیر القرآن» په ستره علمي پروژه کې په ډېر اخلاص او ژمنتیا بوخت دی.
                </p>
              </div>

              {/* Created Works (Taleefat) */}
              <div className="space-y-3 p-3 bg-slate-950/40 rounded-lg border border-slate-800/80 text-right">
                <h5 className="font-bold text-amber-400 text-xs border-b border-slate-800 pb-1 flex items-center gap-1 justify-end">
                  <span>د لیکوال علمي آثار</span>
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                </h5>
                
                {/* A. Printed works */}
                <div className="space-y-1">
                  <h6 className="text-[11px] font-bold text-amber-500/90 pr-1">الف: چاپ شوي آثار:</h6>
                  <ul className="grid grid-cols-1 gap-1 text-[10.5px] text-slate-300 pr-2">
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۱) تفسير اريوبي المسمى بزبدة التفاسير:</strong> عربي اوه جلده.</span><span className="text-amber-500">🔸</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۲) معراج الاسلام (حکومت اوسیاست):</strong> (پښتو، فارسي).</span><span className="text-amber-500">🔸</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۳) معراج التصوف:</strong> (پښتو).</span><span className="text-amber-500">🔸</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۴) معراج الحجاج والمعتمرین:</strong> (پښتو، فارسي).</span><span className="text-amber-500">🔸</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۵) تلخیص معراج الحجاج والمعتمرین:</strong> (پښتو).</span><span className="text-amber-500">🔸</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۶) معراج الواعظین:</strong> (پښتو، فارسي).</span><span className="text-amber-500">🔸</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۷) زبدة المسائل:</strong> (پښتو).</span><span className="text-amber-500">🔸</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۸) سيف القهار على المستهزئین الكفار:</strong> (پښتو، فارسي).</span><span className="text-amber-500">🔸</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۹) تنوير المسلمين في حکم تلفزيون:</strong> (پښتو، فارسي).</span><span className="text-amber-500">🔸</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۱۰) زاد المسافر:</strong> (پښتو، فارسي).</span><span className="text-amber-500">🔸</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۱۱) اداب الزيارت المشاهده في المدينة المنوره:</strong> (عربي).</span><span className="text-amber-500">🔸</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۱۲) زبدة الصلوة على اشرف المخلوقات صلى الله عليه وسلم:</strong> (عربي).</span><span className="text-amber-500">🔸</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۱۳) معراج الصرف:</strong> (پښتو).</span><span className="text-amber-500">🔸</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۱十四) معراج النحوا:</strong> (پښتو).</span><span className="text-amber-500">🔸</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۱۵) معراج المنطق:</strong> (پښتو).</span><span className="text-amber-500">🔸</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۱۶) معراج العقائد شرحه شرح العقائد:</strong> (پښتو).</span><span className="text-amber-500">🔸</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۱۷) معراج الاصول شرح حسامي:</strong> (پښتو).</span><span className="text-amber-500">🔸</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۱۹) زبدة النحوا شرح هداية النحوا:</strong> (عربي).</span><span className="text-amber-500">🔸</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۲۰) الرسالة الحقانية العالية:</strong> (عربي، پښتو).</span><span className="text-amber-500">🔸</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۲۱) ملفوظات:</strong> (پښتو).</span><span className="text-amber-500">🔸</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۲۲) تحفة المباركة من مدينة المنورة الى الائمة المسلمة:</strong> (عربي، پښتو).</span><span className="text-amber-500">🔸</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۲۳) جامع اللطيف في تحذير المسلمين من موالاة الكفار والملحدين:</strong> (عربي، پښتو).</span><span className="text-amber-500">🔸</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>(۲۴) الوصية في العقائد اهل السنة والجماعة:</strong> (پښتو).</span><span className="text-amber-500">🔸</span></li>
                  </ul>
                </div>

                {/* B. Unprinted works */}
                <div className="space-y-1 pt-1 border-t border-slate-800/60 font-sans">
                  <h6 className="text-[11px] font-bold text-amber-500/90 pr-1">ب: ناچاپ آثار:</h6>
                  <ul className="grid grid-cols-1 gap-1 text-[10.5px] text-slate-300 pr-2">
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>۱-: تفسير اريوبي المسمى بزبدة التفاسير (عربي):</strong> پځه جلد.</span><span className="text-amber-500">🔹</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>۲-: تفسير اريوبي المسمى بزبدة التفاسير (پښتو):</strong> دوه جلد.</span><span className="text-amber-500">🔹</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>۳-: معراج الحجاج والمعتمرین:</strong> (اردو).</span><span className="text-amber-500">🔹</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>۴-: زبدة الصلوة على اشرف المخلوقات صلى الله عليه وسلم:</strong> (پښتو).</span><span className="text-amber-500">🔹</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>۵-: الواقعات النادارت:</strong> (عربي).</span><span className="text-amber-500">🔹</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>۶-: الرسالة الفقهية في حکم المسحي بالجوربية:</strong> (عربي).</span><span className="text-amber-500">🔹</span></li>
                    <li className="flex items-start justify-end gap-1.5"><span className="text-right"><strong>۷-: سفرنامه سیایند:</strong> (پښتو).</span><span className="text-amber-500">🔹</span></li>
                  </ul>
                </div>

              </div>

              {/* End Note */}
              <div className="text-center p-3.5 bg-amber-500/5 rounded-xl border border-amber-500/10 space-y-1.5">
                <p className="text-[10.5px] italic text-amber-200/90 leading-relaxed font-semibold">
                  «د هغه ژوند د علمي تعقیب، دیني خدمت او د پوهې د خپرولو یوه ښکلې بېلګه ده. الله تعالی دې د نوموړي علمي هڅې او د تفسیر په برخه کې دغه ستر خدمتونه په خپل دربار کې قبول او منظور کړي.»
                </p>
                <div className="pt-2 border-t border-amber-500/10 flex justify-between items-center text-[9.5px]">
                  <span className="text-slate-400 font-mono text-right text-[9px]">ترتيب کوونکي: مفتي ولي الرحمن متوکل</span>
                  <span className="text-amber-500 font-bold">ګټور او فکري اثر</span>
                </div>
              </div>

            </div>

            {/* Footer actions */}
            <div className="bg-slate-950 p-3 text-center border-t border-slate-900">
              <button 
                onClick={() => setShowAuthorBioModal(false)}
                className="px-6 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition cursor-pointer"
              >
                بندول
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. COMPACT RETRO CONTACT / DIRECT ACTION OVERLAY dialog */}
      {showContactDialog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-sm overflow-hidden animate-slow-fade-in text-right">
            
            <div className="bg-slate-950 p-3.5 flex justify-between items-center border-b border-slate-850">
              <button onClick={() => setShowContactDialog(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
              <div className="text-right">
                <h3 className="font-bold text-xs text-slate-100">جوړونکي سره په تماس کې شئ</h3>
                <p className="text-[9px] text-[#8e9bb4]">د کاريال جوړونکی : خبيب تکل شخصي تماسونه</p>
              </div>
            </div>

            <div className="p-4 space-y-2 text-right">
              
              {/* Telegram */}
              <a 
                href="https://t.me/khubaib_takl"
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-indigo-950/20 hover:bg-indigo-950/40 rounded-lg border border-indigo-500/20 flex items-center justify-between text-left transition"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                <div className="flex-1 text-right">
                  <span className="font-bold text-indigo-400 text-[11px] block">Telegram ټلیګرام چینل</span>
                  <span className="text-[9px] text-slate-400 font-mono">@khubaib_takl</span>
                </div>
              </a>

              {/* WhatsApp */}
              <a 
                href="https://wa.me/93765443156"
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-emerald-950/20 hover:bg-emerald-950/40 rounded-lg border border-emerald-500/20 flex items-center justify-between text-left transition"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                <div className="flex-1 text-right">
                  <span className="font-bold text-emerald-400 text-[11px] block">واټساپ مستقیم چټ تګلاره</span>
                  <span className="text-[9px] text-slate-400 font-mono">+93 (76) 544 3156</span>
                </div>
              </a>

              {/* Direct Call */}
              <a 
                href="tel:0777233699"
                className="p-2 bg-slate-950/40 hover:bg-slate-950 border border-slate-800 flex items-center justify-between text-left transition"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                <div className="flex-1 text-right">
                  <span className="font-bold text-slate-200 text-[11px] block">مستقیم تلیفوني تماس</span>
                  <span className="text-[9px] text-slate-400 font-mono">0777233699</span>
                </div>
              </a>

            </div>

            <div className="p-3 bg-slate-950 text-center text-[8.5px] text-slate-500 leading-normal">
              په هره نښه کلیک کولو سره په مستقیمه توګه خپل موبایل کې اړونده چینونه فعال کړئ.
            </div>

          </div>
        </div>
      )}

      {/* 7. ADVANCED COMPACT CONFIG SETTINGS SCREEN */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-sm overflow-hidden animate-slow-fade-in text-right">
            
            <div className="bg-slate-950 p-4 flex justify-between items-center border-b border-slate-850">
              <button onClick={() => setShowSettingsModal(false)} className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-bold text-xs text-amber-500">
                پرمختللي امستنې او ترتیبات (Settings)
              </h3>
            </div>

            <div className="p-4 space-y-4 text-right">
              
              {/* Themes list selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block">د منځپانګې تومنه او رنګ غوره کړه:</label>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  {APP_THEMES.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setSelectedTheme(theme);
                        localStorage.setItem(KEYS.THEME_ID, theme.id);
                        triggerToast(`رنګ تنظیم شو: ${theme.name}`, "success");
                      }}
                      className={`p-2 rounded-lg border text-right transition flex items-center justify-between ${
                        selectedTheme.id === theme.id 
                        ? 'border-amber-500 bg-slate-950 text-amber-500 font-bold' 
                        : 'border-slate-800 bg-slate-950/40 text-slate-300'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${theme.accent}`} />
                      <span>{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Speech rate speeds */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block">د غږ ویونکي متوسط چټکتیا (TTS Rate):</label>
                <div className="flex items-center justify-between text-[11px] bg-slate-950 p-2 rounded-lg border border-slate-850">
                  <span className="font-mono text-amber-500">{ttsSpeed}x</span>
                  <div className="flex gap-1">
                    {[0.75, 0.95, 1.25].map(val => (
                      <button
                        key={val}
                        onClick={() => {
                          setTtsSpeed(val);
                          localStorage.setItem(KEYS.SPEED_RATE, String(val));
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] ${ttsSpeed === val ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-850'}`}
                      >
                        {val}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Buttons segment */}
              <div className="pt-2.5 border-t border-slate-800/80 flex gap-1.5">
                <button
                  onClick={handleResetSettings}
                  className="w-full py-1.5 bg-red-950/40 border border-red-500/20 hover:border-red-500 text-red-200 rounded-lg text-[9.5px]"
                >
                  ټول بيا پیلول (Reset Cache)
                </button>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[9.5px] font-bold"
                >
                  خوندي کړه
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* STORAGE ACCESS PERMISSION DIALOG */}
      {showStoragePermissionDialog && bookToExport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-sm overflow-hidden animate-slow-fade-in text-right">
            
            <div className="bg-slate-950 p-4 border-b border-slate-850 flex items-center justify-between text-right">
              <button 
                onClick={() => {
                  setShowStoragePermissionDialog(false);
                  setBookToExport(null);
                }} 
                className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-bold text-xs text-amber-500 flex items-center gap-1.5 justify-end">
                <span>د وسیلې حافظې ته لاسرسی</span>
                <HelpCircle className="w-4 h-4 text-amber-500" />
              </h3>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-amber-500/10 rounded-full text-amber-500 border border-amber-500/20">
                  <Download className="w-10 h-10 animate-bounce" />
                </div>
              </div>

              <div className="space-y-1.5 text-center sm:text-right">
                <h4 className="text-xs font-bold text-white text-right">
                  د «{bookToExport.pashtoTitle}» کتاب ډاونلوډ کولو لپاره د حافظې اجازه
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed text-right">
                  د دې لپاره چې د «المکتبة المدنیة الشیخ المهاجر المدني» دغه د کیفیت لرونکي لوستلو اثر په بشپړ ډول ستاسو د آلې په داخلي حافظه کې خوندي او صادر شي، نو اړینه ده چې د ډاونلوډ اجازه تایید کړئ.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => {
                    setShowStoragePermissionDialog(false);
                    setBookToExport(null);
                  }}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10.5px] font-bold cursor-pointer"
                >
                  لغوه کول
                </button>
                <button
                  onClick={confirmAndExportBook}
                  className="px-5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-[10.5px] font-extrabold flex items-center gap-1 cursor-pointer shadow-md"
                >
                  اجازه ورکول او ډاونلوډ
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 9. NATIVE APP EXIT CONFIRMATION DIALOG */}
      {showExitDialog && (
        <div className="fixed inset-0 z-55 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-xs overflow-hidden animate-slow-fade-in text-right shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            
            <div className="bg-slate-950 p-4 border-b border-slate-850 flex items-center justify-between text-right">
              <span className="text-sm">🚪</span>
              <h3 className="font-bold text-xs text-amber-500">له اپلیکیشن څخه وتل</h3>
            </div>

            <div className="p-4 text-center space-y-4 font-sans">
              <p className="text-[11px] text-slate-300 leading-relaxed text-right">
                ايا غواړئ له اپلکيشن څخه ووځئ؟
              </p>

              <div className="flex gap-2 justify-end pt-2">
                {/* 1: نه */}
                <button
                  onClick={() => setShowExitDialog(false)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-[10px] font-bold transition cursor-pointer"
                >
                  نه
                </button>
                {/* 2: هو */}
                <button
                  onClick={() => {
                    try {
                      CapApp.exitApp();
                    } catch (e) {
                      console.warn("CapApp.exitApp() only works in native environments.", e);
                      setShowExitDialog(false);
                      triggerToast("له کاريال څخه وتل په موبایل کې تایید کړئ.", "info");
                    }
                  }}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition cursor-pointer"
                >
                  هو
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 8. MINI FOOTER SECTION */}
      <footer className={`${selectedTheme.cardBg} border-t ${selectedTheme.border} py-3.5 text-center text-[10px] transition-all relative z-10 mt-auto`} id="app_footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2 text-right">
          <p className="opacity-80 text-[10px]">
            خپرونکی او ترتیب کوونکی: <span className="font-bold text-amber-500">مفتي ولي الرحمن متوکل</span> • <span className="text-[9px] opacity-70">کاريال جوړونکی: خبيب تکل</span>
          </p>

          <div className="flex gap-2 text-[9px] text-amber-500">
             کتاب، رڼا اوسیله د مخلص انسان په غاړه کې
          </div>
        </div>
      </footer>

    </div>
  );
}
