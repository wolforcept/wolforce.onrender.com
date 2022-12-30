import { useRef, useEffect } from 'react'
import { FC } from 'react';

interface CanvasProps {
    w: number
    h: number
    draw: (ctx: CanvasRenderingContext2D) => void
    onMouseUp?: (x: number, y: number) => void
    onMouseDown?: (x: number, y: number) => void
    onMouseMove?: (x: number, y: number) => void
}

const Canvas: FC<CanvasProps> = function ({ w, h, draw, onMouseUp, onMouseDown, onMouseMove }) {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context == null) throw new Error('Could not get context');
            draw(context)
        }

    }, []);

    return <canvas

        onMouseDown={event => {
            if (onMouseDown && canvasRef.current) {
                let rect = canvasRef.current.getBoundingClientRect();
                let x = event.clientX - rect.left;
                let y = event.clientY - rect.top;
                onMouseDown(x, y)
            }
        }}

        onMouseMove={event => {
            if (onMouseMove && canvasRef.current) {
                let rect = canvasRef.current.getBoundingClientRect();
                let x = event.clientX - rect.left;
                let y = event.clientY - rect.top;
                onMouseMove(x, y)
            }
        }}

        onMouseUp={event => {
            if (onMouseUp && canvasRef.current) {
                let rect = canvasRef.current.getBoundingClientRect();
                let x = event.clientX - rect.left;
                let y = event.clientY - rect.top;
                onMouseUp(x, y)
            }
        }}

        ref={canvasRef} width={w} height={h} />

}

export default Canvas;
