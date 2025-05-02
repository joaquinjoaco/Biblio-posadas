"use client"

import { useEffect, useState } from "react"

export default function GridBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  // const [time, setTime] = useState(0)

  // const [isMounted, setIsMounted] = useState(false);


  // if (!isMounted) {
  //   return null;
  // }

  // useEffect(() => {
  //   setIsMounted(true);
  // }, [])


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTime((prev) => prev + 0.01)
  //   }, 50)

  //   return () => clearInterval(interval)
  // }, [])

  // // Calculate gradient colors based on time
  // const hue1 = (time * 5) % 360
  // const hue2 = (time * 5 + 60) % 360
  // const hue3 = (time * 5 + 120) % 360

  return (
    <div
      className="absolute inset-0 h-full w-full overflow-hidden opacity-50"
    // style={{
    //   background: `linear-gradient(135deg, 
    //   hsl(190, 10%, 50%) 0%, 
    //   hsl(25, 100%, 50%) 50%, 
    //     hsl(100, 100%, 100%) 100%)`,
    // }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 h-full w-full opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 0, 255, 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 0, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Subtle moving dots at grid intersections */}
      {/* <div className="absolute inset-0 h-full w-full">
        {Array.from({ length: 100 }).map((_, i) => {
          const x = (i % 10) * 10 + Math.sin((time + i) * 0.2) * 5
          const y = Math.floor(i / 10) * 10 + Math.cos((time + i) * 0.2) * 5

          return (
            <div
              key={i}
              className="absolute h-[2px] w-[2px] rounded-full bg-white/30"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          )
        })}
      </div> */}

      {/* Mouse light effect */}
      <div
        className="absolute h-[50vh] w-[50vw] rounded-full bg-white/10 blur-3xl"
        style={{
          left: `${mousePosition.x * 100}%`,
          top: `${mousePosition.y * 100}%`,
          transform: "translate(-50%, -50%)",
        }}
      />
    </div >
  )
}
