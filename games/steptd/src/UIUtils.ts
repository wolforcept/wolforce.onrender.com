import { Graphics } from "miglib";

export class UIUtils {
    /**
     * Render a 9patch panel with a given image.
     * The image should be 3x3 times the cellSize (e.g., 3x64px = 192px unscaled).
     * Width and height are specified in number of tiles (including borders).
     */
    static render9Patch(
        g: Graphics,
        imageName: string,
        x: number,
        y: number,
        widthInTiles: number,
        heightInTiles: number,
        sourceTileSize: number,
        destTileSize: number
    ): void {
        const width = widthInTiles * destTileSize;
        const height = heightInTiles * destTileSize;

        // Step 1: Draw corners (fixed size)
        // Top-left corner
        g.renderImage(imageName, x, y, {
            w: destTileSize,
            h: destTileSize,
            sx: 0,
            sy: 0,
            sw: sourceTileSize,
            sh: sourceTileSize
        });

        // Top-right corner
        g.renderImage(imageName, x + width - destTileSize, y, {
            w: destTileSize,
            h: destTileSize,
            sx: sourceTileSize * 2,
            sy: 0,
            sw: sourceTileSize,
            sh: sourceTileSize
        });

        // Bottom-left corner
        g.renderImage(imageName, x, y + height - destTileSize, {
            w: destTileSize,
            h: destTileSize,
            sx: 0,
            sy: sourceTileSize * 2,
            sw: sourceTileSize,
            sh: sourceTileSize
        });

        // Bottom-right corner
        g.renderImage(imageName, x + width - destTileSize, y + height - destTileSize, {
            w: destTileSize,
            h: destTileSize,
            sx: sourceTileSize * 2,
            sy: sourceTileSize * 2,
            sw: sourceTileSize,
            sh: sourceTileSize
        });

        // Step 2: Draw edges (tiled)
        const centerWidth = width - 2 * destTileSize;
        const centerHeight = height - 2 * destTileSize;

        // Top and bottom edges (horizontal tiling)
        for (let offsetX = 0; offsetX < centerWidth; offsetX += destTileSize) {
            const tileWidth = Math.min(destTileSize, centerWidth - offsetX);

            // Top edge
            g.renderImage(imageName, x + destTileSize + offsetX, y, {
                w: tileWidth,
                h: destTileSize,
                sx: sourceTileSize,
                sy: 0,
                sw: sourceTileSize,
                sh: sourceTileSize
            });

            // Bottom edge
            g.renderImage(imageName, x + destTileSize + offsetX, y + height - destTileSize, {
                w: tileWidth,
                h: destTileSize,
                sx: sourceTileSize,
                sy: sourceTileSize * 2,
                sw: sourceTileSize,
                sh: sourceTileSize
            });
        }

        // Left and right edges (vertical tiling)
        for (let offsetY = 0; offsetY < centerHeight; offsetY += destTileSize) {
            const tileHeight = Math.min(destTileSize, centerHeight - offsetY);

            // Left edge
            g.renderImage(imageName, x, y + destTileSize + offsetY, {
                w: destTileSize,
                h: tileHeight,
                sx: 0,
                sy: sourceTileSize,
                sw: sourceTileSize,
                sh: sourceTileSize
            });

            // Right edge
            g.renderImage(imageName, x + width - destTileSize, y + destTileSize + offsetY, {
                w: destTileSize,
                h: tileHeight,
                sx: sourceTileSize * 2,
                sy: sourceTileSize,
                sw: sourceTileSize,
                sh: sourceTileSize
            });
        }

        // Step 3: Draw center (tiled in both directions)
        for (let offsetY = 0; offsetY < centerHeight; offsetY += destTileSize) {
            const tileHeight = Math.min(destTileSize, centerHeight - offsetY);

            for (let offsetX = 0; offsetX < centerWidth; offsetX += destTileSize) {
                const tileWidth = Math.min(destTileSize, centerWidth - offsetX);

                g.renderImage(imageName, x + destTileSize + offsetX, y + destTileSize + offsetY, {
                    w: tileWidth,
                    h: tileHeight,
                    sx: sourceTileSize,
                    sy: sourceTileSize,
                    sw: sourceTileSize,
                    sh: sourceTileSize
                });
            }
        }
    }
}
