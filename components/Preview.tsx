import React from 'react';
import { BlockType, DocBlock } from '../types';

interface PreviewProps {
  blocks: DocBlock[];
}

const Preview: React.FC<PreviewProps> = ({ blocks }) => {
  
  const getStyleForBlock = (type: BlockType): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      lineHeight: '28pt',
      marginBottom: '0',
    };

    switch (type) {
      case BlockType.TITLE:
        return {
          ...baseStyle,
          fontFamily: "'Gongwen-Title', serif",
          fontSize: '22pt', // 二号
          textAlign: 'center',
          fontWeight: 'bold', // Often bold in web display to mimic XiaoBiaoSong
          marginBottom: '28pt', // Space after title
        };
      case BlockType.HEADING_1: // 一、
        return {
          ...baseStyle,
          fontFamily: "'Gongwen-Hei', sans-serif",
          fontSize: '16pt', // 三号
          textIndent: '2em',
        };
      case BlockType.HEADING_2: // （一）
        return {
          ...baseStyle,
          fontFamily: "'Gongwen-Kai', serif",
          fontSize: '16pt',
          textIndent: '2em',
        };
      case BlockType.HEADING_3: // 1.
      case BlockType.HEADING_4: // (1)
      case BlockType.BODY:
        return {
          ...baseStyle,
          fontFamily: "'Gongwen-Fang', serif",
          fontSize: '16pt',
          textIndent: '2em',
          textAlign: 'justify',
        };
      case BlockType.ATTACHMENT:
        return {
            ...baseStyle,
            fontFamily: "'Gongwen-Fang', serif",
            fontSize: '16pt',
            textIndent: '2em',
            marginTop: '28pt', // Gap before attachment
        };
      case BlockType.SIGNATURE:
      case BlockType.DATE:
        return {
            ...baseStyle,
            fontFamily: "'Gongwen-Fang', serif",
            fontSize: '16pt',
            textAlign: 'right',
            paddingRight: '2em',
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div className="bg-gray-200 p-8 overflow-y-auto h-full flex justify-center">
      <div className="a4-paper transform scale-90 sm:scale-100">
        {blocks.length === 0 && (
          <div className="text-gray-300 text-center mt-20 text-xl font-serif">
            预览区域 (请在左侧输入文字)
          </div>
        )}
        {blocks.map((block) => (
          <div key={block.id} style={getStyleForBlock(block.type)}>
            {block.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Preview;