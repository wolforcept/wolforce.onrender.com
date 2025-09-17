// import { useEffect, useRef, useState } from "react";
// import type { Dim, Pos, Window } from "./../Interfaces";

// const style: React.CSSProperties = {
//     position: "absolute",
//     userSelect: "none",
//     padding: 2,
//     backgroundColor: "#c2c2c2",
//     fontFamily: "\"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif",
// }

// interface DesktopWindowProps {
//     window: Window
//     setPositionAndSize: (pos: Pos, size: Dim) => void
//     closeWindow: () => void
// }

// export default function DesktopWindow(props: DesktopWindowProps) {

//     const { setPositionAndSize, closeWindow } = props
//     const pos = props.window.pos;
//     const dim = props.window.dim;

//     const dragRef = useRef<HTMLDivElement>(null)
//     const [offset, setOffset] = useState<Pos | null>(null)
//     const [isMaximized, setIsMaximized] = useState(false)

//     const handleMouseDown = (e: React.MouseEvent) => {
//         const box = dragRef.current
//         if (box) {
//             setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y })
//             e.preventDefault()
//         }
//     }

//     const handleMouseMove = (e: MouseEvent) => {
//         if (offset) {
//             setPositionAndSize({ x: e.clientX - offset.x, y: e.clientY - offset.y }, { w: 320, h: 320 })
//         }
//         e.preventDefault()
//     }

//     const handleMouseUp = (e: MouseEvent) => {
//         if (offset) {
//             const x = Math.round(e.clientX - offset.x)
//             const y = Math.round(e.clientY - offset.y)
//             const w = 320
//             const h = 320
//             setPositionAndSize({ x, y }, { w, h })
//         }
//         setOffset(null)
//         e.preventDefault()
//     };

//     useEffect(() => {
//         if (offset) {
//             window.addEventListener("mousemove", handleMouseMove)
//             window.addEventListener("mouseup", handleMouseUp)
//         } else {
//             window.removeEventListener("mousemove", handleMouseMove)
//             window.removeEventListener("mouseup", handleMouseUp)
//         }

//         return () => {
//             window.removeEventListener("mousemove", handleMouseMove)
//             window.removeEventListener("mouseup", handleMouseUp)
//         };
//     }, [offset])

//     return (
//         <div
//             style={{
//                 ...style,
//                 top: pos.y, left: pos.x,
//                 // filter: "drop-shadow(2px 3px 2px #00000055)",
//                 borderBottom: "1px solid #828282",
//                 borderRight: "1px solid #828282",
//                 padding: 1,
//                 boxSizing: "border-box",
//             }}>
//             <div
//                 style={{
//                     position: "relative",
//                     borderTop: "1px solid white",
//                     borderLeft: "1px solid white",
//                     padding: 1,
//                     boxSizing: "border-box",
//                     width: dim.w,
//                     height: dim.h,
//                 }}
//             >
//                 <div
//                     onMouseDown={handleMouseDown}
//                     ref={dragRef}
//                     style={{ color: "white", backgroundColor: "#020282", paddingLeft: 4, display: "flex" }}
//                 >
//                     <div style={{ transform: "translateY(-1px)" }}>Name</div>
//                     <div
//                         style={{ float: "right", backgroundColor: "#55AAFF", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", border: "", margin: "2px 2px 2px auto" }}
//                         onMouseDown={(e) => { closeWindow(); e.preventDefault() }}
//                     >
//                         <div style={{ transform: "translate( -1px)" }}>⌗</div>
//                     </div>
//                     <div
//                         style={{ float: "right", backgroundColor: "red", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", border: "", margin: "2px 2px 2px 0" }}
//                         onMouseDown={() => closeWindow()}
//                     >
//                         <div style={{ transform: "translateY(-2px)" }}>X</div>
//                     </div>
//                 </div>
//                 <div style={{}}></div>
//                 <div style={{ height: 4, width: dim.w, backgroundColor: "#FFFFFF01", position: "absolute", left: -2, bottom: -2 }}></div>
//                 {/* <img src={icon} alt={altText} style={{ width: 64, height: 64," }} /> */}
//                 {/* <img src="https://i.imgur.com/rVcbILM.png" style={{ position: "absolute", left: 0, bottom: 0 }} /> */}
//             </div>
//         </div>
//     );
// }