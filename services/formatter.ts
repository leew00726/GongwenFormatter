import { BlockType, DocBlock } from '../types';

/**
 * Heuristic parser to detect block types based on Chinese official document rules.
 */
export const parseTextToBlocks = (text: string): DocBlock[] => {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const blocks: DocBlock[] = [];

  // Helper to check for Chinese numbers (一、二、)
  const isLevel1 = (str: string) => /^[一二三四五六七八九十]+、/.test(str);
  
  // Helper for Level 2 (（一）) - Note: matches both full-width and half-width parens
  const isLevel2 = (str: string) => /^[(（][一二三四五六七八九十]+[)）]/.test(str);
  
  // Helper for Level 3 (1. ) - Must have dot
  const isLevel3 = (str: string) => /^\d+\./.test(str);
  
  // Helper for Level 4 ((1))
  const isLevel4 = (str: string) => /^[(（]\d+[)）]/.test(str);

  // Helper for Attachments
  const isAttachment = (str: string) => /^附件[：:]/.test(str);

  // Helper for Date (Usually ends with Year/Month/Day or numbers)
  const isDate = (str: string) => /\d{4}年\d{1,2}月\d{1,2}日$/.test(str);

  let hasFoundTitle = false;

  lines.forEach((line, index) => {
    let type = BlockType.BODY;

    if (!hasFoundTitle) {
      // First line is almost always title
      if (index === 0) {
        type = BlockType.TITLE;
        hasFoundTitle = true;
      } else if (index === 1 && line.length < 50 && !line.includes('：')) {
         // Sometimes title is 2 lines, or second line is document number
         // If it ends with colon, it's likely a recipient (Subtitle/Body)
         type = BlockType.TITLE;
      }
    }

    // Heuristics override
    if (index > 0) {
       // Check for Recipient (ends with colon)
       if (line.endsWith('：') || line.endsWith(':')) {
           type = BlockType.BODY; // Standard body but usually first paragraph
       } else if (isLevel1(line)) {
           type = BlockType.HEADING_1;
           hasFoundTitle = true; // Force title search stop
       } else if (isLevel2(line)) {
           type = BlockType.HEADING_2;
           hasFoundTitle = true;
       } else if (isLevel3(line)) {
           type = BlockType.HEADING_3;
           hasFoundTitle = true;
       } else if (isLevel4(line)) {
           type = BlockType.HEADING_4;
           hasFoundTitle = true;
       } else if (isAttachment(line)) {
           type = BlockType.ATTACHMENT;
           hasFoundTitle = true;
       } else if (isDate(line)) {
           type = BlockType.DATE;
       } else if (line.length < 10 && index === lines.length - 2) {
           // Possible signature before date
           type = BlockType.SIGNATURE;
       }
    }

    // Specific fix: If the parser thought it was Body but it's short and at the very end, might be signature
    if (index >= lines.length - 3 && line.length < 20 && !isDate(line) && type === BlockType.BODY) {
        // Simple heuristic for signature/department name at bottom
        type = BlockType.SIGNATURE;
    }

    blocks.push({
      id: `block-${Date.now()}-${index}`,
      type,
      content: line
    });
  });

  return blocks;
};

export const autoCorrectText = (text: string): string => {
  // 1. Convert half-width punctuation to full-width for specific marks (comma, colon) if mixed
  let polished = text;
  
  // Convert brackets for document numbers to hexagon (simplified check)
  // polished = polished.replace(/\[/g, '〔').replace(/\]/g, '〕');
  
  return polished;
};