import { useAppContext } from '@/context/AppContext';

import { BodyContent } from './BodyContent';
import { ChartModal } from './ChartModal';
import { DriverCard } from './DriverCard';

export interface BodyProps {
  pinned: boolean;
  chartOpen: boolean;
  onChartClose: () => void;
}

export function Body({ pinned, chartOpen, onChartClose }: BodyProps) {
  const { drivers, setDrivers } = useAppContext();

  return (
    <>
      <BodyContent>
        {Object.entries(drivers)
          .filter(([, driver]) => (pinned ? driver.pin : true))
          .map(([id, driver]) => (
            <DriverCard key={id} id={id} driver={driver} setDriver={setDrivers} />
          ))}
      </BodyContent>
      {chartOpen && <ChartModal drivers={drivers} onClose={onChartClose} />}
    </>
  );
}
