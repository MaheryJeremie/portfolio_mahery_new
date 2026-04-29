import { useEffect, useRef } from 'react';
import './Cursor.css';

export default function Cursor() {
  const dot   = useRef(null);
  const ring  = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos   = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);
  const over  = useRef(false);
  const active = useRef(false);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
      }
      if (!active.current) {
        active.current = true;
        dot.current?.classList.add('cursor--active');
        ring.current?.classList.add('cursor--active');
      }
    };

    const animate = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.12;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.12;
      if (ring.current) {
        ring.current.style.transform = `translate(${pos.current.x - 20}px, ${pos.current.y - 20}px)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };

    const onOver = (e) => {
      if (!over.current && e.target.closest('a, button, [data-hover]')) {
        over.current = true;
        ring.current?.classList.add('cursor-ring--hover');
        dot.current?.classList.add('cursor-dot--hover');
      }
    };

    const onOut = (e) => {
      if (over.current && !e.relatedTarget?.closest('a, button, [data-hover]')) {
        over.current = false;
        ring.current?.classList.remove('cursor-ring--hover');
        dot.current?.classList.remove('cursor-dot--hover');
      }
    };

    const onLeave = () => {
      over.current = false;
      ring.current?.classList.remove('cursor-ring--hover');
      dot.current?.classList.remove('cursor-dot--hover');
      dot.current?.classList.remove('cursor--active');
      ring.current?.classList.remove('cursor--active');
      active.current = false;
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    window.addEventListener('blur', onLeave);
    window.addEventListener('mouseleave', onLeave);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      window.removeEventListener('blur', onLeave);
      window.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      <div ref={dot}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
