import React from 'react';

// Store for managing motion values across components
const motionValueStore = new WeakMap();
const animationControls = new WeakMap();

export const motion = {
  div: React.forwardRef(({ children, animate, initial, exit, style, variants, ...props }: any, ref: any) => {
    // Handle style transformations
    const computedStyle = { ...style };
    if (style?.scaleX) {
      const scaleValue = typeof style.scaleX === 'object' ? 
        (style.scaleX.get ? style.scaleX.get() : style.scaleX.current || 0) : style.scaleX;
      computedStyle.transform = `scaleX(${scaleValue})`;
      delete computedStyle.scaleX;
      delete computedStyle.willChange;
    }
    
    // Handle animation states
    let animationState = {};
    if (animate) {
      if (typeof animate === 'object') {
        animationState = animate;
      }
    }
    
    return React.createElement('div', {
      ref,
      ...props,
      style: { ...computedStyle, ...animationState },
      'data-animation-state': animate?.opacity === 1 ? 'visible' : 'hidden'
    }, children);
  }),
};

export const AnimatePresence = ({ children, mode }: any) => {
  return <>{children}</>;
};

export const useMotionValue = (initial: number) => {
  const [value, setValue] = React.useState(initial);
  const listenersRef = React.useRef<Set<(v: number) => void>>(new Set());
  
  const motionValue = React.useMemo(() => {
    const mv = {
      get: () => value,
      set: (newValue: number) => {
        setValue(newValue);
        // Notify all listeners
        listenersRef.current.forEach(listener => {
          try {
            listener(newValue);
          } catch (e) {
            console.error('Error in motion value listener:', e);
          }
        });
      },
      current: value,
      on: (event: string, callback: (value: number) => void) => {
        if (event === 'change') {
          listenersRef.current.add(callback);
          return () => {
            listenersRef.current.delete(callback);
          };
        }
        return () => {};
      },
      _value: value,
      _listeners: listenersRef
    };
    
    // Store the motion value
    motionValueStore.set(mv, { setValue, listenersRef });
    return mv;
  }, []);
  
  // Keep current property in sync
  React.useEffect(() => {
    motionValue.current = value;
    motionValue._value = value;
  }, [value, motionValue]);
  
  return motionValue;
};

export const useTransform = (motionValue: any, inputRange: number[], outputRange: number[]) => {
  const [transformedValue, setTransformedValue] = React.useState(() => {
    const input = motionValue.get();
    const ratio = Math.max(0, Math.min(1, input / 100));
    return outputRange[0] + (outputRange[1] - outputRange[0]) * ratio;
  });
  
  React.useEffect(() => {
    const update = (value: number) => {
      const ratio = Math.max(0, Math.min(1, value / 100));
      const transformed = outputRange[0] + (outputRange[1] - outputRange[0]) * ratio;
      setTransformedValue(transformed);
    };
    
    // Initial update
    update(motionValue.get());
    
    // Subscribe to changes
    const unsubscribe = motionValue.on('change', update);
    return unsubscribe;
  }, [motionValue, inputRange, outputRange]);
  
  return {
    get: () => transformedValue,
    current: transformedValue,
  };
};

export const animate = jest.fn((motionValue: any, target: number, options: any) => {
  let stopped = false;
  let animationFrameId: any = null;
  let currentProgress = 0;
  
  const controls = {
    stop: jest.fn(() => {
      stopped = true;
      if (animationFrameId) {
        clearTimeout(animationFrameId);
        animationFrameId = null;
      }
      animationControls.delete(controls);
    })
  };
  
  // Store control reference
  animationControls.set(controls, { motionValue, target, options });
  
  const startValue = motionValue.get();
  const duration = options.duration * 1000; // Convert to ms
  const frameTime = 16; // ~60fps
  const totalFrames = Math.ceil(duration / frameTime);
  let currentFrame = 0;
  
  const runFrame = () => {
    if (stopped) return;
    
    currentFrame++;
    currentProgress = currentFrame / totalFrames;
    
    if (currentProgress >= 1) {
      // Complete this cycle
      motionValue.set(target);
      
      if (options.repeat === Infinity) {
        // Reset for next cycle
        currentFrame = 0;
        currentProgress = 0;
        motionValue.set(startValue);
        animationFrameId = setTimeout(runFrame, frameTime);
      } else {
        // Animation complete
        animationControls.delete(controls);
      }
    } else {
      // Continue animation
      const easedProgress = currentProgress; // Linear for simplicity
      const currentValue = startValue + (target - startValue) * easedProgress;
      motionValue.set(currentValue);
      animationFrameId = setTimeout(runFrame, frameTime);
    }
  };
  
  // Start animation
  animationFrameId = setTimeout(runFrame, 0);
  
  return controls;
});

export const AnimationPlaybackControls = {};
export const Variants = {};

// Helper to manually advance animations in tests
export const __testUtils = {
  advanceAnimationsByTime: (ms: number) => {
    // This would be called by tests to manually advance animations
    // For now, we rely on Jest's timer mocking
  }
};