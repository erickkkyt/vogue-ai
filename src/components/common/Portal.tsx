'use client';

import { useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Optional: Create a div if #portal-root doesn't exist, though it's better to have it in the main HTML.
    // For this example, we assume #portal-root might not exist and fallback to body.
    let portalContainer = document.getElementById('portal-root');
    if (!portalContainer) {
        portalContainer = document.createElement('div');
        portalContainer.setAttribute('id', 'portal-root-created'); // Differentiate if created by script
        document.body.appendChild(portalContainer);
        // Optional: remove this element when component unmounts, if created dynamically
        // This part can be tricky with Next.js HMR and navigation.
        // A predefined #portal-root in the main layout is cleaner.
    }

    return () => {
      setMounted(false);
      // If we dynamically created portalContainer AND it's the one we created, remove it.
      // This cleanup is complex. Prefer predefined #portal-root.
      // if (portalContainer && portalContainer.id === 'portal-root-created') {
      //   document.body.removeChild(portalContainer);
      // }
    };
  }, []);

  if (!mounted) {
    return null;
  }

  // Ensure we have a target to render to, default to body if #portal-root is still missing.
  let targetElement = document.getElementById('portal-root');
  if (!targetElement) {
    // Fallback if #portal-root wasn't found or created in useEffect (should not happen if useEffect logic is robust)
    // This fallback could be document.body directly, but having a dedicated div is often cleaner.
    // For simplicity here, let's assume if it's not there after mount, we might have an issue or need to append directly to body.
    // The useEffect above tries to create one if missing. Let's try to use that.
    targetElement = document.getElementById('portal-root-created') || document.body; 
  }
  
  return createPortal(children, targetElement);
};

export default Portal; 