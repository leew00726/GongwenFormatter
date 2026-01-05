export enum BlockType {
  TITLE = 'TITLE',
  SUBTITLE = 'SUBTITLE', // Usually recipient or document number
  HEADING_1 = 'HEADING_1', // 一、
  HEADING_2 = 'HEADING_2', // （一）
  HEADING_3 = 'HEADING_3', // 1.
  HEADING_4 = 'HEADING_4', // (1)
  BODY = 'BODY',
  ATTACHMENT = 'ATTACHMENT',
  SIGNATURE = 'SIGNATURE',
  DATE = 'DATE',
}

export interface DocBlock {
  id: string;
  type: BlockType;
  content: string;
}

export const FONT_SIZES = {
  TITLE: '22pt', // 二号
  BODY: '16pt', // 三号
};

export const LINE_HEIGHT = '28pt'; // Fixed 28pt leading