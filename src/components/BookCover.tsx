import React, { useState } from 'react';
import { Book } from '../booksData';
import { LayoutGrid, Scroll, Sparkles, Compass, ShieldAlert, Award, FileText, CheckCircle } from 'lucide-react';

interface BookCoverProps {
  book: Book;
  size?: 'sm' | 'md' | 'lg';
}

export const BookCover: React.FC<BookCoverProps> = ({ book, size = 'md' }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  const [imageError, setImageError] = useState(false);

  // Sizing definitions
  const containerClasses = isSm 
    ? "w-14 h-20 text-[6px] p-1 rounded" 
    : isLg 
      ? "w-48 h-68 text-xs p-3 rounded-lg border-2" 
      : "w-full h-24 text-[8px] p-1.5 rounded-md";

  if (!imageError) {
    return (
      <img 
        src={`/assets/${book.id}.jpg`} 
        alt={book.pashtoTitle}
        referrerPolicy="no-referrer"
        onError={() => setImageError(true)}
        className={`${isSm ? 'w-14 h-20 rounded shadow-xs' : isLg ? 'w-48 h-68 rounded-lg shadow-md border border-amber-500/20 bg-slate-950/40' : 'w-full h-24 rounded-md shadow-xs'} object-cover text-[8px]`}
      />
    );
  }

  // Author short version
  const shortAuthor = "شيخ الحدیث ګل الرحمن حقاني";

  // Dynamic Cover Rendering based on the user's specific book covers
  switch (book.id) {
    case 'tanwir-ul-muslimeen-pashto':
      // Image 1: Sky-blue cover with floral pattern and old TV set
      return (
        <div 
          className={`relative ${containerClasses} bg-gradient-to-b from-[#87CEEB] to-[#4682B4] text-slate-900 overflow-hidden flex flex-col justify-between border border-sky-300 shadow-md`}
          style={{ direction: 'rtl' }}
        >
          {/* Ornamental abstract background circles */}
          <div className="absolute inset-0 bg-radial-gradient from-white/20 to-transparent pointer-events-none"></div>
          
          {/* Header */}
          <div className="flex justify-between items-center opacity-85 text-[5px] sm:text-[7px]">
            <span className="font-bold border border-blue-900/10 px-0.5 rounded">پښتو لوستنه</span>
            <span>تصویري نسخه</span>
          </div>

          {/* Core Content */}
          <div className="text-center relative z-10 my-auto flex flex-col items-center">
            <h4 className="font-extrabold text-[#0D2C54] tracking-tight leading-tight text-[10px] sm:text-[14px]">
              تنوير المسلمين
            </h4>
            <div className="flex flex-col gap-0.5 mt-0.5 text-rose-700 font-extrabold text-[7px] sm:text-[10px] leading-tight">
              <span>اسلام او تلويزيون</span>
            </div>

            {/* Vintage TV Set graphic */}
            <div className={`mt-1 bg-amber-400/90 border border-amber-600/30 p-0.5 rounded flex items-center justify-center shadow-xs ${isSm ? 'w-5 h-4' : 'w-10 h-8'}`}>
              <div className="bg-slate-950 w-full h-full rounded-xs flex items-center justify-center relative">
                <span className="text-[3px] text-amber-500 font-bold">TV</span>
                <div className="absolute -top-1 left-1.5 w-0.5 h-1.5 bg-slate-400 rotate-12 origin-bottom"></div>
                <div className="absolute -top-1 right-1.5 w-0.5 h-1.5 bg-slate-400 -rotate-12 origin-bottom"></div>
              </div>
            </div>
          </div>

          {/* Footer publisher info */}
          <div className="border-t border-blue-950/10 pt-0.5 flex justify-between items-center opacity-90 text-[4.5px] sm:text-[7px]">
            <span className="truncate max-w-[70%]">{shortAuthor}</span>
            <span className="font-mono text-[4px] sm:text-[6.5px]">ثبت مأخذ</span>
          </div>
        </div>
      );

    case 'al-minhaj-al-jalil-pashto':
      // Image 2: Maroon top, white bottom cover with 3 circles (rose, bouquet, sword)
      return (
        <div 
          className={`relative ${containerClasses} bg-white text-slate-900 overflow-hidden flex flex-col justify-between border border-red-950/20 shadow-md`}
          style={{ direction: 'rtl' }}
        >
          {/* Gold header border */}
          <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-red-900 to-[#5a1215] flex flex-col justify-end p-1 text-center text-white border-b border-amber-500/20">
            <h4 className="font-extrabold text-amber-300 tracking-tight leading-none text-[8.5px] sm:text-[12px] mb-0.5">
              المنهاج الجليل
            </h4>
            <span className="text-[5.5px] sm:text-[7.5px] text-zinc-200 line-clamp-1 italic">في حكم القتيل</span>
          </div>

          <div className="h-6"></div> {/* Spacer to let golden header breathe */}

          {/* Badge */}
          <div className="text-center z-10">
            <span className="bg-red-800 text-white text-[5px] sm:text-[7.5px] px-1.5 py-0.2 rounded-full font-bold shadow-xs">
              پښتو ترجمه
            </span>
          </div>

          {/* Three horizontal circles (Rose, Flowers, Sword) */}
          <div className="flex justify-around items-center gap-1 my-1 px-1 z-10">
            {/* Left Circle: Red Rose */}
            <div className="w-5 h-5 sm:w-10 sm:h-10 rounded-full border border-sky-400 bg-sky-100/50 flex items-center justify-center relative overflow-hidden shadow-xs">
              <span className="text-[6px] sm:text-[11px]">🌹</span>
            </div>
            {/* Middle Circle: Flowers */}
            <div className="w-5 h-5 sm:w-10 sm:h-10 rounded-full border border-amber-400 bg-amber-50/50 flex items-center justify-center relative overflow-hidden shadow-xs">
              <span className="text-[6px] sm:text-[11px]">💐</span>
            </div>
            {/* Right Circle: Sword */}
            <div className="w-5 h-5 sm:w-10 sm:h-10 rounded-full border border-red-500 bg-red-50 flex items-center justify-center relative overflow-hidden shadow-xs">
              <span className="text-[5px] sm:text-[10px] transform -rotate-45">⚔️</span>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#5a1215] text-amber-300 p-0.5 text-center text-[4.5px] sm:text-[7.5px] font-bold">
            مؤلف: {shortAuthor}
          </div>
        </div>
      );

    case 'zubdat-ul-masail-pashto':
      // Image 3: Purple-yellow gradient cover with blue chapter bubbles
      return (
        <div 
          className={`relative ${containerClasses} bg-gradient-to-tr from-[#ffe066] to-[#b197fc] text-slate-900 overflow-hidden flex flex-row border border-purple-300 shadow-md`}
          style={{ direction: 'rtl' }}
        >
          {/* Left book spine (purple sidebar) */}
          <div className="w-4 sm:w-8 bg-[#5f3dc4] text-amber-300 flex flex-col justify-center items-center p-0.5 text-center shrink-0 border-l border-purple-400">
            <span className="text-[3px] sm:text-[6px] font-bold tracking-widest writing-mode-vertical uppercase [writing-mode:vertical-lr]">
              مبارک اثر
            </span>
          </div>

          {/* Clean Content block */}
          <div className="flex-1 p-1 sm:p-2 flex flex-col justify-between text-right">
            <div className="flex justify-between items-center opacity-80 text-[4px] sm:text-[6.5px]">
              <span className="text-[4px] sm:text-[6.5px] bg-[#5f3dc4]/15 text-[#5f3dc4] font-bold px-0.5 rounded">دریم چاپ</span>
              <span>شرحه المسائل</span>
            </div>

            {/* Black round badge title */}
            <div className="my-1 text-center">
              <div className="inline-block bg-slate-950 text-white rounded-full p-1 border border-amber-500">
                <h4 className="font-extrabold text-amber-400 text-[8px] sm:text-[12px] leading-none mb-0.5">
                  زبدة المسائل
                </h4>
                <span className="text-[4px] sm:text-[6.5px] block text-emerald-300">پښتو ضمیمه</span>
              </div>
            </div>

            {/* Mini Chapter lists representing the blue bullet labels */}
            <div className="grid grid-cols-2 gap-0.5 text-[4px] sm:text-[6px] opacity-90 truncate leading-none">
              <span className="bg-sky-600 text-white p-0.2 rounded text-center truncate">۱. اسلامي اقتصاد</span>
              <span className="bg-sky-600 text-white p-0.2 rounded text-center truncate">۲. د اخستلو مسائل</span>
              <span className="bg-sky-600 text-white p-0.2 rounded text-center truncate">۳. د سود احکام</span>
              <span className="bg-sky-600 text-white p-0.2 rounded text-center truncate">۴. د مضاورت شرحه</span>
            </div>

            <span className="text-[3px] sm:text-[6px] opacity-70 block truncate text-slate-800 mt-1">{shortAuthor}</span>
          </div>
        </div>
      );

    case 'miraj-ul-islam-pashto':
      // Image 4: Green cover with Medina green dome and minaret at bottom left
      return (
        <div 
          className={`relative ${containerClasses} bg-[#2b8a3e] text-white overflow-hidden flex flex-col justify-between border border-emerald-500 shadow-md`}
          style={{ direction: 'rtl' }}
        >
          {/* Top banner */}
          <div className="flex justify-between items-center p-1 text-[4px] sm:text-[7px] bg-emerald-900/60 font-semibold">
            <span>دریم برخلاصه</span>
            <span className="bg-amber-400 text-emerald-950 px-0.5 rounded font-black text-[3px] sm:text-[6.5px]">دریم چاپ</span>
          </div>

          {/* Sunburst background effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-amber-500/10 rounded-full blur-md"></div>

          {/* Central Title */}
          <div className="text-center my-auto px-1 z-10">
            <h4 className="font-black text-rose-100 text-[11px] sm:text-[15px] drop-shadow-sm leading-tight">
              معراج الإسلام
            </h4>
            <span className="text-[5.5px] sm:text-[8px] opacity-90 text-amber-200 font-bold">پښتو مفصل علمي نسخه</span>
          </div>

          {/* Bottom Left Medina Green Dome vector block */}
          <div className="absolute bottom-2 left-1 z-10 flex items-end gap-0.5">
            {/* Green Dome */}
            <div className="w-5 h-5 sm:w-10 sm:h-10 bg-emerald-900 rounded-t-full border-t-2 border-amber-300 relative flex items-center justify-center">
              <div className="w-1 h-2 bg-amber-400 rounded-full absolute -top-1"></div>
            </div>
            {/* Minaret */}
            <div className="w-1.5 h-8 sm:w-3 sm:h-16 bg-zinc-100 rounded-t-lg relative border-l border-zinc-300">
              <div className="w-2.5 h-1 bg-amber-400 absolute bottom-3 -left-0.5"></div>
              <div className="w-1 h-1 bg-emerald-900 absolute top-1 left-0.2"></div>
            </div>
          </div>

          {/* Right aligned simple text options in Pashto */}
          <div className="flex flex-col gap-0.2 text-[4px] sm:text-[6px] items-end px-1.5 opacity-90 text-right z-10 w-1/2 mr-auto mb-1">
            <span className="truncate border-b border-white/10 w-full font-semibold">اسلامي پالیسي</span>
            <span className="truncate border-b border-white/10 w-full font-semibold">اسلامي حکومت</span>
            <span className="truncate border-b border-white/10 w-full font-semibold">مسلمانانو بېداري</span>
          </div>

          {/* Footer author */}
          <div className="bg-emerald-950 py-0.5 px-1.5 text-center text-[4.5px] sm:text-[7px] font-mono font-medium tracking-tight">
            مؤلف: {shortAuthor}
          </div>
        </div>
      );

    case 'tuhfat-ul-mubaraka-pashto':
      // Image 6: Green patterned cover with Al-Masjid an-Nabawi photo at bottom
      return (
        <div 
          className={`relative ${containerClasses} bg-[#1b4332] text-white overflow-hidden flex flex-col justify-between border border-emerald-900 shadow-md`}
          style={{ direction: 'rtl' }}
        >
          {/* Oriental decorative arch borders */}
          <div className="absolute inset-1.5 border border-amber-500/20 rounded pointer-events-none"></div>

          <div className="p-1 text-center opacity-85 text-[5px] sm:text-[7px]">
            <span>مدينة منوره مبارکه تحفه</span>
          </div>

          {/* Title block with white cursive frame */}
          <div className="text-center px-1.5 z-10 my-auto">
            <div className="bg-emerald-950/80 p-1 border-y-2 border-amber-500/30 rounded-md">
              <h4 className="font-extrabold text-white text-[9px] sm:text-[13px] drop-shadow-sm leading-tight">
                تحفة المباركة
              </h4>
              <p className="text-[4px] sm:text-[6.5px] text-amber-300">من مدينة المنورة الى الامة المسلمة</p>
            </div>
          </div>

          {/* Medina image facsimile (depicted via nice silhouette) */}
          <div className="w-full h-5 sm:h-12 bg-cover bg-amber-500/5 border-t border-amber-500/15 flex items-end justify-center z-10 relative">
            <div className="w-4 h-4 sm:w-8 h-8 rounded-full bg-emerald-800 absolute -bottom-1 left-4 border border-amber-500/20"></div>
            <span className="text-[4px] sm:text-[6.5px] text-amber-200 z-10 font-bold bg-black/40 px-1 py-0.2 rounded-full mb-0.5">مسجد نبوي تصویر</span>
          </div>

          <div className="bg-[#081c15] text-center text-[4px] sm:text-[6.5px] py-0.5 opacity-90">
            مؤلف: {shortAuthor}
          </div>
        </div>
      );

    case 'saif-ul-qahhar-ala-al-mustahzi-ul-kuffar-pashto':
      // Image 7: Beautiful sunset orange-yellow cover with Medina minarets
      return (
        <div 
          className={`relative ${containerClasses} bg-gradient-to-b from-[#f77f00] via-[#fcbf49] to-[#eae2b7] text-slate-950 overflow-hidden flex flex-col justify-between border border-amber-500 shadow-md`}
          style={{ direction: 'rtl' }}
        >
          {/* Header */}
          <div className="p-1 flex justify-between items-center text-[4px] sm:text-[7px] text-slate-900 font-bold">
            <span>مداخله او رد</span>
            <span>تصویري آفلاین سکن</span>
          </div>

          {/* Outstanding Bold Crimson Red title */}
          <div className="text-center px-1 z-10 my-auto leading-tight">
            <h4 className="font-black text-rose-800 text-[9.5px] sm:text-[14px] [text-shadow:_0_1px_1px_rgba(255,255,255,0.7)]">
              سيف القهار
            </h4>
            <span className="text-[4.5px] sm:text-[7.5px] text-[#003049] font-extrabold block">على المستهزين الکفار</span>
          </div>

          {/* Sun background and Mosque skyline vector */}
          <div className="relative w-full h-8 sm:h-16 bg-white/20 border-t border-amber-300/30 flex items-end justify-center overflow-hidden">
            {/* Mosque Domes */}
            <div className="absolute w-6 h-6 sm:w-12 sm:h-12 bg-slate-950/20 rounded-full bottom-[-8px]"></div>
            <div className="absolute w-8 h-8 sm:w-16 sm:h-16 bg-amber-500/10 rounded-full bottom-[-12px]"></div>
            
            {/* Tall Minarets */}
            <div className="w-1 h-7 sm:w-1.5 sm:h-14 bg-amber-900/40 mx-2 rounded-t-sm"></div>
            <div className="w-1 h-6 sm:w-1.5 sm:h-12 bg-amber-900/40 mx-1 rounded-t-sm"></div>
            <div className="w-1 h-7 sm:w-1.5 sm:h-14 bg-amber-900/40 mx-2 rounded-t-sm"></div>
          </div>

          {/* Footer publisher badge */}
          <div className="bg-[#d62828] text-white py-0.5 text-center text-[4px] sm:text-[6.5px] font-bold">
            کتاب جوړونکی: {shortAuthor}
          </div>
        </div>
      );

    case 'zubdat-ul-salat':
      // Image 8: Classic leather black/navy cover with luxury gold floral borders
      return (
        <div 
          className={`relative ${containerClasses} bg-[#0b0c10] text-amber-200 overflow-hidden flex flex-col justify-between border-2 border-amber-500/40 shadow-xl`}
          style={{ direction: 'rtl' }}
        >
          {/* Gold vintage corner frames (simulated with standard double borders) */}
          <div className="absolute inset-1 border border-amber-500/20 rounded pointer-events-none"></div>
          <div className="absolute top-1 left-1 bg-amber-400 w-1 h-1"></div>
          <div className="absolute top-1 right-1 bg-amber-400 w-1 h-1"></div>
          <div className="absolute bottom-1 left-1 bg-amber-400 w-1 h-1"></div>
          <div className="absolute bottom-1 right-1 bg-amber-400 w-1 h-1"></div>

          {/* Sacred Quranic verse at top */}
          <div className="p-1 px-1.5 text-center mt-0.5 z-10 bg-slate-950/60 rounded">
            <span className="text-[3.5px] sm:text-[5.5px] text-emerald-300 font-mono italic block line-clamp-1 leading-none">
              عزيز عليه ما عنتم حريص عليكم بالمؤمنين رؤوف رحيم
            </span>
          </div>

          {/* Main Title gold Calligraphy */}
          <div className="text-center my-auto z-10 px-1">
            <h4 className="font-extrabold text-[11px] sm:text-[16px] text-amber-400 tracking-wide font-serif leading-none">
              زبدة الصلوة
            </h4>
            <span className="text-[4.5px] sm:text-[7.5px] text-amber-200/80 font-mono block mt-1 tracking-widest uppercase">
              على اشرف المخلوقات
            </span>
          </div>

          {/* Authorship gold text */}
          <div className="text-center pb-2 z-10">
            <p className="text-[4px] sm:text-[6px] text-amber-300/60 font-medium">ګل الرحمن حقاني</p>
            <span className="text-[3px] sm:text-[4px] opacity-40 block">القرآن والحدیث مأخذ</span>
          </div>
        </div>
      );

    case 'zad-ul-musafir-pashto':
      // Image 9: Sky-blue cover with plane, bus, and car visuals
      return (
        <div 
          className={`relative ${containerClasses} bg-[#1a7fa0] text-white overflow-hidden flex flex-col justify-between border border-sky-400 shadow-md`}
          style={{ direction: 'rtl' }}
        >
          {/* Radial light backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-[#ffffff]/15 rounded-full blur-md"></div>

          {/* Header info */}
          <div className="p-0.5 flex justify-between items-center text-[4px] sm:text-[6.5px] bg-[#0c5973]/70">
            <span>زاد المسافر پښتو</span>
            <span className="text-amber-300">مسافر توښه</span>
          </div>

          {/* Red Title with white stroke */}
          <div className="text-center z-10 my-auto">
            <h4 className="font-black text-[#f21b3f] text-[10.5px] sm:text-[14px] [text-shadow:_1px_1px_rgba(255,255,255,0.9)] tracking-tight leading-none mb-0.5">
              زاد المسافر
            </h4>
            <span className="text-[5px] sm:text-[8px] text-white font-extrabold bg-[#0c5973]/40 px-1 rounded-full">پښتني ادبي تګلاره</span>
          </div>

          {/* Traveling Vehicles Facsimile graphics */}
          <div className="flex flex-col gap-0.5 items-center justify-center my-1 z-10 px-1 relative">
            <span className="text-[6px] sm:text-[11px] font-bold block animate-bounce" title="Airplane">✈️</span>
            <div className="flex gap-1 justify-center items-center">
              <span className="text-[6px] sm:text-[10px]">🚌</span>
              <span className="text-[6px] sm:text-[10px]">🚗</span>
            </div>
          </div>

          {/* Footing publisher banner */}
          <div className="bg-[#032b38] text-center text-amber-300 text-[4.5px] sm:text-[7.5px] py-0.5 font-bold tracking-tight">
            مكتبة اشرفية • پښتو
          </div>
        </div>
      );

    case 'miraj-ul-hujjaj-pashto':
      // Image 10: Brown cover with drawing of Kaaba & 5 blue circles
      return (
        <div 
          className={`relative ${containerClasses} bg-gradient-to-b from-[#8a5a36] to-[#4e2b0f] text-amber-100 overflow-hidden flex flex-col justify-between border border-amber-800 shadow-md`}
          style={{ direction: 'rtl' }}
        >
          {/* Top slogan */}
          <div className="p-0.5 text-center text-[3.5px] sm:text-[5px] bg-amber-950/60 font-semibold tracking-wider">
            واتموا الحج والعمرة لله
          </div>

          {/* Title and subtitle in white banner shape */}
          <div className="text-center z-10 my-auto leading-tight px-0.5">
            <h4 className="font-extrabold text-white text-[9px] sm:text-[12px] [text-shadow:_0_1px_1px_rgba(0,0,0,0.8)]">
              معراج الحجاج
            </h4>
            <span className="text-[4px] sm:text-[6px] text-amber-300 block">والمعتمرين پښتو لارښود</span>
          </div>

          {/* Bottom section showing Kaaba outline and blue badges on right */}
          <div className="flex justify-between items-end my-1 px-1 z-11">
            {/* Kaaba replica block */}
            <div className="w-6 h-6 sm:w-11 sm:h-11 bg-slate-900 rounded border border-amber-500/30 flex flex-col justify-start relative text-center">
              <div className="w-full h-1.5 bg-amber-400 absolute top-1.5"></div>
              <span className="text-[3px] sm:text-[5px] text-amber-400 font-bold mt-3.5">کعبه</span>
            </div>

            {/* Symmetrical blue small circles list representing chapters */}
            <div className="flex flex-col gap-0.2 items-end opacity-90 text-[3.5px] sm:text-[5.5px]">
              <span className="bg-sky-700 text-white rounded-full px-0.5 text-[3.5px] sm:text-[5px] truncate max-w-[32px] sm:max-w-full">فضائل</span>
              <span className="bg-sky-700 text-white rounded-full px-0.5 text-[3.5px] sm:text-[5px] truncate max-w-[32px] sm:max-w-full">مسائل</span>
              <span className="bg-sky-700 text-white rounded-full px-0.5 text-[3.5px] sm:text-[5px] truncate max-w-[32px] sm:max-w-full">عمره</span>
            </div>
          </div>

          {/* Footer author text */}
          <div className="bg-amber-950/80 p-0.5 text-center text-[4px] sm:text-[6.5px]">
            لیکوال: {shortAuthor}
          </div>
        </div>
      );

    case 'minhaj-ul-firqa-al-najiya-pashto':
    case 'al-risalat-ul-haqqaniyyah':
      // Image 11: Deep brown cover with white arch containing green board and 12 circles
      return (
        <div 
          className={`relative ${containerClasses} bg-[#3e2723] text-stone-200 overflow-hidden flex flex-col justify-between border border-stone-800 shadow-md`}
          style={{ direction: 'rtl' }}
        >
          {/* Symmetrical green listing circles around borders */}
          <div className="absolute top-2 left-1 bg-emerald-600 border border-emerald-400 w-1.5 h-1.5 rounded-full"></div>
          <div className="absolute top-4 left-1 bg-emerald-600 border border-emerald-400 w-1.5 h-1.5 rounded-full"></div>
          <div className="absolute top-6 left-1 bg-emerald-600 border border-emerald-400 w-1.5 h-1.5 rounded-full"></div>
          <div className="absolute top-2 right-1 bg-emerald-600 border border-emerald-400 w-1.5 h-1.5 rounded-full"></div>
          <div className="absolute top-4 right-1 bg-emerald-600 border border-emerald-400 w-1.5 h-1.5 rounded-full"></div>
          <div className="absolute top-6 right-1 bg-emerald-600 border border-emerald-400 w-1.5 h-1.5 rounded-full"></div>

          {/* White Arch Center Backdrop */}
          <div className="mx-2 my-auto bg-stone-100 rounded-t-xl p-0.5 sm:p-1 border border-amber-500/20 z-10 flex flex-col justify-between min-h-[50%]">
            <div className="bg-[#1b4332] rounded-t-lg p-1 text-center text-amber-200">
              <h4 className="font-extrabold text-[8px] sm:text-[11px] leading-tight text-white mb-0.5">
                {book.id === 'al-risalat-ul-haqqaniyyah' ? 'الرسالة الحقانية' : 'منهاج الفرقة'}
              </h4>
              <p className="text-[4px] sm:text-[6.5px] opacity-80 text-amber-300">الناجية پښتو بشپړ شرحه</p>
            </div>
          </div>

          {/* Mini signatures */}
          <div className="bg-stone-900 py-0.5 text-center text-[4px] sm:text-[6.5px] opacity-90 truncate">
            {shortAuthor}
          </div>
        </div>
      );

    case 'miraj-ul-waizin':
      // Image 12: Sky-blue watercolor cover with gold mosque dome drawing
      return (
        <div 
          className={`relative ${containerClasses} bg-gradient-to-tr from-[#98f5e1] via-[#80c3f4] to-[#fcf4af] text-slate-950 overflow-hidden flex flex-col justify-between border border-sky-300 shadow-md`}
          style={{ direction: 'rtl' }}
        >
          {/* Slogan */}
          <div className="p-0.5 text-center text-[3.5px] sm:text-[5px] bg-sky-900/10 text-[#0c3343] font-bold">
            هذا بيان للناس وهدى وموعظة للمتقين
          </div>

          {/* Glossy Red 3D style title */}
          <div className="text-center z-10 my-auto">
            <h4 className="font-black text-[#d90429] text-[10px] sm:text-[14px] [text-shadow:_1px_1px_rgba(255,255,255,0.9)] leading-tight tracking-tight">
              معراج الواعظين
            </h4>
            <span className="text-[3.5px] sm:text-[5.5px] opacity-75 font-mono font-black italic text-sky-900">مواعظ خطيبان</span>
          </div>

          {/* Golden Mosque dome sketch on right */}
          <div className="absolute bottom-2 right-1 z-10 flex flex-col items-center">
            {/* Dome */}
            <div className="w-4 h-4 sm:w-8 sm:h-8 bg-amber-400 rounded-t-full border border-amber-600/50 relative">
              <div className="w-0.5 h-1.5 bg-amber-700 absolute -top-1 left-1.5"></div>
            </div>
            {/* Minaret sketch */}
            <div className="w-1 h-5 sm:w-2 sm:h-10 bg-zinc-200 border-l border-zinc-400"></div>
          </div>

          <div className="bg-sky-950 text-white text-center text-[4px] sm:text-[6.5px] py-0.5 font-bold">
            مکتبه فاروقیه • {shortAuthor}
          </div>
        </div>
      );

    default:
      // Fallback premium classical Islamic book cover for books without explicit photo attachments
      const defaultColor = book.coverGradient || "from-emerald-900 to-emerald-950";
      return (
        <div 
          className={`relative ${containerClasses} bg-gradient-to-tr ${defaultColor} text-amber-200 overflow-hidden flex flex-col justify-between border-2 border-amber-500/20 shadow-md`}
          style={{ direction: 'rtl' }}
        >
          {/* Delicate borders */}
          <div className="absolute inset-1 border border-amber-500/10 rounded pointer-events-none"></div>

          <div className="flex justify-between items-center opacity-85 text-[5px] sm:text-[7px]">
            <span className="font-semibold text-amber-300">اسلامي سرچینه</span>
            <span>تصویري مخ</span>
          </div>

          <div className="text-center z-10 my-auto px-1">
            <h4 className="font-extrabold text-[9px] sm:text-[13px] text-amber-300 leading-tight">
              {book.pashtoTitle}
            </h4>
            <p className="text-[4px] sm:text-[6.5px] opacity-60 truncate mt-0.5">{book.title}</p>
          </div>

          <div className="border-t border-amber-500/10 pt-0.5 flex justify-between items-center opacity-90 text-[4px] sm:text-[6.5px]">
            <span className="truncate max-w-[70%]">{shortAuthor}</span>
            <span className="font-mono text-[3px] sm:text-[5.5px]">{book.size}</span>
          </div>
        </div>
      );
  }
};
