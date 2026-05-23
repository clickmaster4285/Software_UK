"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleDimensions = () => (isMobile ? [0.7, 0.9] : [1.05, 1]);

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className=" flex items-center justify-center relative p-2" ref={containerRef}>
      <div className="w-full relative py-12 md:p-6 lg:p-8" style={{ perspective: "1000px" }}>
        
        {/* Title */}
        <motion.div style={{ translateY: translate }} className="max-w-5xl mx-auto text-center">
          {titleComponent}
        </motion.div>

        {/* Scroll Container */}
        <motion.div
          style={{
            rotateX: rotate,
            scale,
            boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)",
          }}
          className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full 
                     border border-zinc-200 bg-white rounded-[30px] p-2 md:p-6 shadow-2xl"
        >
          <div className="h-full w-full overflow-hidden rounded-2xl bg-white md:rounded-2xl md:p-4">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};