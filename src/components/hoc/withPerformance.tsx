import React, { memo, useMemo, ComponentType } from 'react';

/**
 * Higher-order component for React performance optimization
 * Automatically wraps components with React.memo and handles display names
 */
export function withPerformance<P extends object>(
  Component: ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
): ComponentType<P> {
  const MemoizedComponent = memo(Component, areEqual);
  
  MemoizedComponent.displayName = `withPerformance(${Component.displayName || Component.name})`;
  
  return MemoizedComponent;
}

/**
 * HOC for expensive computed props
 */
export function withMemoizedProps<P extends object, T>(
  Component: ComponentType<P & { computedProps: T }>,
  computeProps: (props: P) => T,
  dependencies?: (props: P) => React.DependencyList
): ComponentType<P> {
  const WrappedComponent = (props: P) => {
    const deps = dependencies ? dependencies(props) : Object.values(props);
    const computedProps = useMemo(() => computeProps(props), deps);
    
    return <Component {...props} computedProps={computedProps} />;
  };
  
  WrappedComponent.displayName = `withMemoizedProps(${Component.displayName || Component.name})`;
  
  return memo(WrappedComponent);
}

/**
 * Performance monitoring HOC (for development)
 */
export function withPerformanceMonitoring<P extends object>(
  Component: ComponentType<P>,
  componentName?: string
): ComponentType<P> {
  if (process.env.NODE_ENV === 'production') {
    return Component;
  }

  const WrappedComponent = (props: P) => {
    const name = componentName || Component.displayName || Component.name;
    const startTime = performance.now();
    
    React.useEffect(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // 16ms threshold for 60fps
        console.warn(`${name} render took ${renderTime.toFixed(2)}ms`);
      }
    });
    
    return <Component {...props} />;
  };
  
  WrappedComponent.displayName = `withPerformanceMonitoring(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}