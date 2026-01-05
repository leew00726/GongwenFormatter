import { useState, useCallback } from 'react';
import { ICONS, SAMPLE_TEXT } from './constants';
import { parseTextToBlocks } from './services/formatter';
import { exportToWord } from './services/exporter';
import { BlockType, DocBlock } from './types';
import Preview from './components/Preview';

const { FileText, Wand2, Download, Eraser } = ICONS;

function App() {
  const [rawText, setRawText] = useState<string>('');
  const [blocks, setBlocks] = useState<DocBlock[]>([]);
  const [isSidebarOpen] = useState(true);

  // Auto-format handler
  const handleAutoFormat = useCallback(() => {
    if (!rawText.trim()) return;
    const newBlocks = parseTextToBlocks(rawText);
    setBlocks(newBlocks);
  }, [rawText]);

  // Handle block type change manually
  const handleBlockTypeChange = (id: string, newType: BlockType) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, type: newType } : b));
  };

  // Load sample
  const loadSample = () => {
    setRawText(SAMPLE_TEXT);
    // Directly parsing it for immediate feedback is optional, but let's let user click format
    setTimeout(() => {
        const newBlocks = parseTextToBlocks(SAMPLE_TEXT);
        setBlocks(newBlocks);
    }, 100);
  };

  const handleExport = async () => {
    if (blocks.length === 0) {
        alert("请先生成排版内容");
        return;
    }
    await exportToWord(blocks);
  };

  return (
    <div className="flex h-screen flex-col md:flex-row font-sans">
      {/* Sidebar / Editor */}
      <div className={`flex flex-col bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-full md:w-1/3 lg:w-1/4' : 'w-0 hidden'} md:flex`}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <h1 className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-600" />
            公文自动排版
          </h1>
          <button onClick={loadSample} className="text-xs text-blue-600 hover:underline">
            载入范例
          </button>
        </div>

        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          <textarea
            className="flex-1 w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm leading-relaxed"
            placeholder="在此处粘贴未排版的公文文字..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
        </div>

        {/* Structure Editor (Mini) */}
        {blocks.length > 0 && (
          <div className="h-1/3 border-t border-gray-200 overflow-y-auto p-2 bg-gray-50 text-xs">
            <h3 className="font-bold text-gray-500 mb-2 px-2">段落识别修正</h3>
            {blocks.map(block => (
              <div key={block.id} className="flex items-center gap-2 mb-1 p-1 hover:bg-white rounded">
                <select 
                  value={block.type} 
                  onChange={(e) => handleBlockTypeChange(block.id, e.target.value as BlockType)}
                  className="bg-white border border-gray-300 rounded px-1 py-0.5 text-xs w-24 shrink-0"
                >
                  <option value={BlockType.TITLE}>标题</option>
                  <option value={BlockType.HEADING_1}>一级标题</option>
                  <option value={BlockType.HEADING_2}>二级标题</option>
                  <option value={BlockType.HEADING_3}>三级标题</option>
                  <option value={BlockType.BODY}>正文</option>
                  <option value={BlockType.ATTACHMENT}>附件</option>
                  <option value={BlockType.SIGNATURE}>落款/署名</option>
                  <option value={BlockType.DATE}>日期</option>
                </select>
                <span className="truncate text-gray-600">{block.content}</span>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 border-t border-gray-200 bg-white grid grid-cols-2 gap-2">
          <button
            onClick={() => { setRawText(''); setBlocks([]); }}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Eraser className="w-4 h-4" />
            清空
          </button>
          <button
            onClick={handleAutoFormat}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition-colors shadow-sm"
          >
            <Wand2 className="w-4 h-4" />
            自动排版
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
            <div className="text-sm text-gray-500">
               预览模式 (A4尺寸模拟)
            </div>
            <div className="flex items-center gap-3">
                 <button 
                    onClick={handleExport}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow"
                 >
                    <Download className="w-4 h-4" />
                    导出 Word
                 </button>
            </div>
        </div>

        <Preview blocks={blocks} />
      </div>
    </div>
  );
}

export default App;