// Define a TypeScript class with static functions to create tables in Screeps
import { Vector2 } from "../singletons/buildPlanner";

export class TableConfig {
  public columnWidth = 5;
  public rowHeight = 1;
  public fontSize = 0.4;
  public colors = {
    oddRows: "#797A9E",
    evenRows: "#BBBDF6",
    borderColor: "#EEC170",
    textColor: "#C9DCB3"
  };
}

export class VisualUtils {

  public static createTable(roomName: string, x: number, y: number, columnWidth: number, rowHeight: number, headers: string[], rows: any[][]): void {
    const visual = new RoomVisual(roomName);

    const margin = 0.1;
    const fontSize = 0.2 * rowHeight + 0.2;
    const textXOffset = 0.3;
    const rowHeightMinusMargin = (((1 + rows.length) - (2 * margin)) / (1 + rows.length)) * rowHeight;

    const textYOffset = (rowHeightMinusMargin / 2) + (fontSize / 4);

    // Draw borders
    const tableWidth = headers.length * columnWidth;
    const tableHeight = (rows.length * rowHeight) + rowHeight;

    const lineColor = "#EEC170";
    const textColor = "#D9FFF5";

    const lineStyle: LineStyle = { color: lineColor, width: 0.05 };
    const headerStyle: TextStyle = { color: textColor, align: "left", font: fontSize };
    const rowStyle: TextStyle = { color: textColor, align: "left", font: fontSize };
    const rowBackground: LineStyle = { opacity: 0.12 };

    const headerBackground = "#9893DA";
    const evenBackground = "#BBBDF6";
    const oddBackground = "#797A9E";

    const rowsToRender = [ headers, ...rows ];

    const drawRowBackground = (rowIdx: number) => {
      const isHeader = rowIdx === 0;
      const isEven = rowIdx % 2 === 0;

      const background = isHeader ? headerBackground : isEven ? evenBackground : oddBackground;

      const startX = x + margin;
      const endX = x - margin + tableWidth;
      const startY = y + (rowIdx * rowHeightMinusMargin) + (rowHeightMinusMargin / 2) + (margin * rowHeight);
      const endY = y + (rowIdx * rowHeightMinusMargin) + (rowHeightMinusMargin / 2) + (margin * rowHeight);

      visual.line(startX, startY, endX, endY, {
        ...rowBackground,
        width: rowHeightMinusMargin,
        color: background
      });
    };

    const drawRow = (rowIdx: number) => {
      const isHeader = rowIdx === 0;
      const row = rowsToRender[rowIdx];

      const style = isHeader
        ? headerStyle
        : rowStyle;

      for (let colIdx = 0; colIdx < headers.length; colIdx++) {
        const cell = row[colIdx];

        const startX = x + textXOffset + colIdx * columnWidth;
        const startY = y + (rowIdx * rowHeightMinusMargin) + textYOffset + margin;

        visual.text(cell, startX, startY, style);
      }
    };

    for (let i = 0; i < rowsToRender.length; i++) {
      drawRowBackground(i);
      drawRow(i);
    }

    // rows.forEach((row, rowIndex) => {
    //   row.forEach((cell, cellIndex) => {
    //     visual.text(cell, (x + cellIndex * 5) + textXOffset, (y + (rowIndex + 1) * rowHeightMinusMargin) + textYOffset, rowStyle);
    //
    //     const startMargin = cellIndex === 0 ? margin : 0;
    //     const endMargin = cellIndex === (headers.length - 1) ? margin : 0;
    //     const background = rowIndex % 2 === 0 ? evenBackground : oddBackground;
    //
    //     const startX = x + (cellIndex * columnWidth) + startMargin;
    //     const startY = rowIndex + rowHeightMinusMargin + rowHeight / 2;
    //     const endX = x + ((cellIndex + 1) * columnWidth) - endMargin;
    //     const endY = rowIndex + rowHeightMinusMargin + rowHeight / 2;
    //
    //     visual.line(startX, startY, endX, endY, {
    //       ...rowBackground,
    //       color: background
    //     });
    //   });
    // });


    // Top border
    visual.line(x + margin, y + margin, x + tableWidth - margin, y + margin, lineStyle);

    // Bottom border
    visual.line(x + margin, y + tableHeight - margin, x + tableWidth - margin, y + tableHeight - margin, lineStyle);

    // Left border
    visual.line(x + margin, y + margin, x + margin, y + tableHeight - margin, lineStyle);

    // Right border
    visual.line(x + tableWidth - margin, y + margin, x + tableWidth - margin, y + tableHeight - margin, lineStyle);

    // Column separators
    // headers.forEach((_, i) => {
    //   visual.line(x + i * 5, y, x + i * 5, y + tableHeight, { color: 'teal' });
    // });
  }

  static generateRoundedSquare(a: number, r: number, numSegments: number = 20): Vector2[] {
    if (r > a) {
      throw new Error("Radius r must be less than or equal to half the side length a.");
    }

    const points: Vector2[] = [];

    // Helper function to create quarter circle points
    function quarterCircle(cx: number, cy: number, startAngle: number, endAngle: number): Vector2[] {
      const segmentPoints: Vector2[] = [];
      for (let i = 0; i <= numSegments; i++) {
        const theta = startAngle + (i / numSegments) * (endAngle - startAngle);
        const x = cx + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);
        segmentPoints.push({ x, y });
      }
      return segmentPoints;
    }

    // Top-right quarter circle
    points.push(...quarterCircle(a - r, a - r, 0, Math.PI / 2));

    // Top horizontal line
    // points.push({ x: a - r, y: a });
    // points.push({ x: -(a - r), y: a });

    // Top-left quarter circle
    points.push(...quarterCircle(-(a - r), a - r, Math.PI / 2, Math.PI));

    // Left vertical line
    // points.push({ x: -a, y: a - r });
    // points.push({ x: -a, y: -(a - r) });

    // Bottom-left quarter circle
    points.push(...quarterCircle(-(a - r), -(a - r), Math.PI, (3 * Math.PI) / 2));

    // Bottom horizontal line
    // points.push({ x: -(a - r), y: -a });
    // points.push({ x: a - r, y: -a });

    // Bottom-right quarter circle
    points.push(...quarterCircle(a - r, -(a - r), (3 * Math.PI) / 2, 2 * Math.PI));

    // Right vertical line
    // points.push({ x: a, y: -(a - r) });
    // points.push({ x: a, y: a - r });

    return points;
  }
}

// Dummy data for testing



