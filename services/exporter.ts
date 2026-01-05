import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  AlignmentType, 
  HeadingLevel,
  Indent,
  convertInchesToTwip
} from "docx";
import FileSaver from "file-saver";
import { BlockType, DocBlock } from "../types";

// Standard Official Doc measurements
// 3hao = 16pt = 32 half-points
// 2hao (Title) = 22pt = 44 half-points
// Line Height 28pt. In Docx, line spacing is in 240ths of a line. 
// Or exact spacing in twips (1/20 pt). 28pt = 560 twips.

const FONT_FANGSONG = "FangSong_GB2312"; // Primary Body
const FONT_HEITI = "SimHei"; // Level 1
const FONT_KAITI = "KaiTi_GB2312"; // Level 2
const FONT_TITLE = "FZXiaoBiaoSong-B05S"; // Title (often falls back to SimSun if not present, but we declare it)

export const exportToWord = async (blocks: DocBlock[]) => {
  const children: Paragraph[] = [];

  blocks.forEach((block) => {
    let paragraph: Paragraph;

    switch (block.type) {
      case BlockType.TITLE:
        paragraph = new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: 560, lineRule: "exact" }, // 28pt
          children: [
            new TextRun({
              text: block.content,
              font: FONT_TITLE, // Ideally "方正小标宋简体"
              size: 44, // 22pt
              bold: true, // Titles often bold if font weight is low
            }),
          ],
        });
        break;

      case BlockType.HEADING_1:
        paragraph = new Paragraph({
          alignment: AlignmentType.LEFT,
          indent: { firstLine: 480 }, // 2 chars indentation approx
          spacing: { line: 560, lineRule: "exact" },
          children: [
            new TextRun({
              text: block.content,
              font: FONT_HEITI,
              size: 32, // 16pt (3hao)
            }),
          ],
        });
        break;

      case BlockType.HEADING_2:
        paragraph = new Paragraph({
          alignment: AlignmentType.LEFT,
          indent: { firstLine: 480 },
          spacing: { line: 560, lineRule: "exact" },
          children: [
            new TextRun({
              text: block.content,
              font: FONT_KAITI,
              size: 32, // 16pt
            }),
          ],
        });
        break;

        case BlockType.HEADING_3:
        case BlockType.HEADING_4:
        case BlockType.BODY:
        case BlockType.SUBTITLE:
            paragraph = new Paragraph({
            alignment: AlignmentType.LEFT,
            indent: { firstLine: 480 }, // Indent 2 chars (roughly 32pt * 2 chars width? typically 320-480 twips)
            spacing: { line: 560, lineRule: "exact" },
            children: [
                new TextRun({
                text: block.content,
                font: FONT_FANGSONG,
                size: 32, // 16pt
                }),
            ],
            });
            break;

      case BlockType.ATTACHMENT:
        // Needs extra spacing before
        paragraph = new Paragraph({
          alignment: AlignmentType.LEFT,
          indent: { firstLine: 480 },
          spacing: { before: 560, line: 560, lineRule: "exact" }, 
          children: [
            new TextRun({
              text: block.content,
              font: FONT_FANGSONG,
              size: 32,
            }),
          ],
        });
        break;

      case BlockType.SIGNATURE:
      case BlockType.DATE:
        paragraph = new Paragraph({
          alignment: AlignmentType.RIGHT,
          indent: { right: 480 }, // Padding from right
          spacing: { line: 560, lineRule: "exact" },
          children: [
            new TextRun({
              text: block.content,
              font: FONT_FANGSONG,
              size: 32,
            }),
          ],
        });
        break;
        
      default:
        paragraph = new Paragraph({
            children: [new TextRun(block.content)]
        });
    }

    children.push(paragraph);
  });

  const doc = new Document({
    sections: [
      {
        properties: {
            page: {
                margin: {
                    top: convertInchesToTwip(1.45), // ~3.7cm
                    bottom: convertInchesToTwip(1.37), // ~3.5cm
                    left: convertInchesToTwip(1.1), // ~2.8cm
                    right: convertInchesToTwip(1.02), // ~2.6cm
                },
            },
        },
        children: children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  FileSaver.saveAs(blob, "公文排版.docx");
};