import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';

export default function useOnScreen(ref) {
  const [isOnScreen, setIsOnScreen] = useState(false);
  const observerRef = useRef(null);
  const posts = useSelector(({ posts }) => posts);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) =>
      setIsOnScreen(entry.isIntersecting)
    );
  }, []);

  useEffect(() => {
    if (ref.current.lastChild) {
      observerRef.current.observe(ref.current.lastChild);
      // Remove the observer as soon as the component is unmounted
      return () => {
        observerRef.current.disconnect();
      };
    }
  }, [posts]);

  return { isOnScreen, setIsOnScreen };
}
