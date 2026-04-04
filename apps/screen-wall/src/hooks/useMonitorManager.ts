import { type ChangeEvent } from 'react';

import { type Monitor, type MonitorUtils } from '@/models';
import { calculateMonitorDimensions } from '@/utils';

export function useMonitorManager(monitors: MonitorUtils) {
  const addMonitor = () => {
    const id = monitors.value.length + 1;

    const monitor: Monitor = {
      name: `Monitor ${id.toString()}`,
      orientation: 'horizontal',
      aspectRatio: '16:9',
      inches: 27,
      position: calculateMonitorDimensions({
        orientation: 'horizontal',
        aspectRatio: '16:9',
        inches: 27,
        position: { x: 0, y: 0, w: 0, h: 0 }
      })
    };
    monitors.add(monitor);
  };

  const changeMonitor = (index: number) => {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const m = monitors.value[index];

      const $form = (e.target as HTMLElement).closest('.monitor-form');
      if (!$form) return;

      const selector = (label: string): string => {
        const $element = $form.querySelector<HTMLInputElement | HTMLSelectElement>(label);
        return $element === null ? '0' : $element.value;
      };

      m.name = selector('.name-input');
      m.orientation = selector('.orientation-select') as 'horizontal' | 'vertical';
      m.aspectRatio = selector('.aspect-ratio-select');
      m.inches = parseInt(selector('.inches-input'), 10);
      m.position = calculateMonitorDimensions(m);
      monitors.add(m, index);
    };
  };

  const delMonitor = (index: number) => {
    return () => {
      monitors.del(index);
    };
  };

  return {
    addMonitor,
    changeMonitor,
    delMonitor
  };
}
