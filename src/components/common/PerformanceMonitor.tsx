'use client';

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // 监控 Web Vitals
    const observeWebVitals = () => {
      // 监控 LCP (Largest Contentful Paint)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
            // 可以发送到分析服务
          }
        }
      });

      try {
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        // 浏览器不支持
      }

      // 监控 FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input') {
            console.log('FID:', entry.processingStart - entry.startTime);
          }
        }
      });

      try {
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch (e) {
        // 浏览器不支持
      }

      // 监控 CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            console.log('CLS:', clsValue);
          }
        }
      });

      try {
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        // 浏览器不支持
      }

      // 清理函数
      return () => {
        observer.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    };

    // 页面加载完成后开始监控
    if (document.readyState === 'complete') {
      observeWebVitals();
    } else {
      window.addEventListener('load', observeWebVitals);
    }

    // 监控资源加载时间
    const monitorResources = () => {
      const resources = performance.getEntriesByType('resource');
      resources.forEach((resource) => {
        if (resource.duration > 1000) { // 超过1秒的资源
          console.warn('Slow resource:', resource.name, resource.duration);
        }
      });
    };

    // 延迟执行资源监控
    setTimeout(monitorResources, 2000);

    // 监控内存使用情况（如果支持）
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        console.log('Memory usage:', {
          used: Math.round(memory.usedJSHeapSize / 1048576),
          total: Math.round(memory.totalJSHeapSize / 1048576),
          limit: Math.round(memory.jsHeapSizeLimit / 1048576)
        });
      }
    };

    // 每30秒监控一次内存
    const memoryInterval = setInterval(monitorMemory, 30000);

    return () => {
      clearInterval(memoryInterval);
    };
  }, []);

  // 这个组件不渲染任何内容
  return null;
}

// 性能优化建议组件
export function PerformanceHints() {
  useEffect(() => {
    // 检查是否有性能问题并给出建议
    const checkPerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
        
        if (loadTime > 3000) {
          console.warn('页面加载时间过长:', loadTime + 'ms');
          console.log('建议: 优化图片大小、启用压缩、使用CDN');
        }
        
        if (domContentLoaded > 1500) {
          console.warn('DOM解析时间过长:', domContentLoaded + 'ms');
          console.log('建议: 减少DOM节点数量、优化CSS选择器');
        }
      }
    };

    window.addEventListener('load', checkPerformance);
    
    return () => {
      window.removeEventListener('load', checkPerformance);
    };
  }, []);

  return null;
} 