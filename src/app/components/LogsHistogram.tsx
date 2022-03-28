import { Chart, ChartAxis, ChartBar, ChartStack, ChartTooltip, getResizeObserver } from '@patternfly/react-charts';
import * as _ from 'lodash-es';
import React from 'react';

import chart_color_blue_100 from '@patternfly/react-tokens/dist/esm/chart_color_blue_100';
import chart_color_red_100 from '@patternfly/react-tokens/dist/esm/chart_color_red_100';
import chart_color_gold_100 from '@patternfly/react-tokens/dist/esm/chart_color_gold_100';
import { MetricLogData } from './Logs.types';

interface LogHistogramProps {
  logsData: Array<MetricLogData>;
  ariaDesc?: string;
}

const aggregateLogData = (data: Array<MetricLogData>): MetricLogData => {
  if (data.length === 1) {
    return data[0];
  }

  // TODO merge based on timestamp
  const aggregatedValues = _.flatMap(data.map((metric) => metric.values));

  return {
    metric: {},
    values: aggregatedValues,
  };
};

const dateFormat = (date: Date): string => {
  const minutes = date.getMinutes();
  return `${date.getHours()}:${minutes < 10 ? `0${minutes}` : minutes}`;
};

const GRAPH_HEIGHT = 150;
const LEFT_PADDING = 50;
const START_DOMAIN_PADDING = 8;
const END_DOMAIN_PADDING = 8;

export const LogsHistogram: React.FC<LogHistogramProps> = ({ logsData, ariaDesc = 'Logs Histogram' }) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = React.useState(0);
  const aggregatedLogData = React.useMemo(() => aggregateLogData(logsData), [logsData]);

  const handleResize = () => {
    if (containerRef.current?.clientWidth) {
      setWidth(containerRef.current.clientWidth);
    }
  };

  React.useEffect(() => {
    const observer = containerRef.current ? getResizeObserver(containerRef.current, handleResize) : () => void 0;
    return () => observer();
  }, []);

  const bars = React.useMemo(() => {
    const ticks: Array<string> = [];
    const numberOfSamples = aggregatedLogData.values.length;
    const graphWidth = width - LEFT_PADDING - START_DOMAIN_PADDING - END_DOMAIN_PADDING;

    const infoData = aggregatedLogData.values.map((value) => {
      const time = parseFloat(String(value[0]));
      const formattedTime = dateFormat(new Date(time * 1000));
      ticks.push(formattedTime);

      return {
        x: formattedTime,
        y: parseInt(String(value[1]), 10),
        name: 'Logs',
        label: `${formattedTime} info: ${value[1]}`,
      };
    });

    const warningData = aggregatedLogData.values.map((value) => {
      const time = parseFloat(String(value[0]));
      const formattedTime = dateFormat(new Date(time * 1000));
      ticks.push(formattedTime);

      return {
        x: formattedTime,
        y: parseInt(String(value[1]), 10),
        name: 'Logs',
        label: `${formattedTime} warning: ${value[1]}`,
      };
    });

    const errorData = aggregatedLogData.values.map((value) => {
      const time = parseFloat(String(value[0]));
      const formattedTime = dateFormat(new Date(time * 1000));
      ticks.push(formattedTime);

      return {
        x: formattedTime,
        y: parseInt(String(value[1]), 10),
        name: 'Logs',
        label: `${formattedTime} error: ${value[1]}`,
      };
    });

    return {
      ticks,
      infoBars: (
        <ChartBar
          barWidth={graphWidth / numberOfSamples - 4}
          data={infoData}
          style={{ data: { fill: chart_color_blue_100.value } }}
          labelComponent={<ChartTooltip constrainToVisibleArea />}
        />
      ),
      warningBars: (
        <ChartBar
          barWidth={graphWidth / numberOfSamples - 4}
          data={warningData}
          style={{ data: { fill: chart_color_gold_100.value } }}
          labelComponent={<ChartTooltip constrainToVisibleArea />}
        />
      ),
      errorBars: (
        <ChartBar
          barWidth={graphWidth / numberOfSamples - 4}
          data={errorData}
          style={{ data: { fill: chart_color_red_100.value } }}
          labelComponent={<ChartTooltip constrainToVisibleArea />}
        />
      ),
    };
  }, [aggregatedLogData, width]);

  console.log({ width });

  return (
    <div ref={containerRef} style={{ height: GRAPH_HEIGHT }}>
      <Chart
        ariaDesc={ariaDesc}
        height={GRAPH_HEIGHT}
        padding={{
          bottom: 40,
          left: LEFT_PADDING,
          right: 0,
          top: 20,
        }}
        width={width}
      >
        <ChartAxis tickValues={bars.ticks} fixLabelOverlap />
        <ChartAxis tickCount={3} dependentAxis showGrid />
        <ChartStack domainPadding={{ x: [START_DOMAIN_PADDING, END_DOMAIN_PADDING] }}>
          {bars.infoBars}
          {bars.warningBars}
          {bars.errorBars}
        </ChartStack>
      </Chart>
    </div>
  );
};
