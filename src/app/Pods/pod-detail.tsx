import { LogsTable } from '@app/components/logs-table';
import { logsStreamData } from '@app/data/logs-test-data';
import {
  Tabs,
  Tab,
  TabTitleText,
  Panel,
  PanelMain,
  PanelMainBody,
  Breadcrumb,
  BreadcrumbItem,
} from '@patternfly/react-core';
import React from 'react';

let interval: NodeJS.Timeout | null = null;

export const PodDetail: React.FC = () => {
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [logsData, setLogsData] = React.useState(logsStreamData.data.result);

  const handleToggleStreaming = () => {
    setIsStreaming(!isStreaming);
  };

  // TODO: remove as is only for testing streaming UI
  React.useEffect(() => {
    if (isStreaming) {
      if (interval) {
        clearInterval(interval);
      }
      interval = setInterval(() => {
        setLogsData((prev) => [
          {
            stream: prev[0].stream,
            values: [prev[0].values[0], ...prev[0].values],
          },
        ]);
      }, 700);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isStreaming]);

  return (
    <Panel>
      <PanelMain>
        <PanelMainBody>
          <Breadcrumb>
            <BreadcrumbItem to="#">Pods</BreadcrumbItem>
            <BreadcrumbItem to="#" isActive>
              Pod details
            </BreadcrumbItem>
          </Breadcrumb>
          <Tabs activeKey={4}>
            <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>}>
              Details
            </Tab>
            <Tab eventKey={1} title={<TabTitleText>Metrics</TabTitleText>}>
              Metrics
            </Tab>
            <Tab eventKey={2} title={<TabTitleText>YAML</TabTitleText>}>
              YAML
            </Tab>
            <Tab eventKey={3} title={<TabTitleText>Database</TabTitleText>}>
              YAML
            </Tab>
            <Tab eventKey={4} title={<TabTitleText>Logs</TabTitleText>}>
              <LogsTable
                logsData={logsData}
                isStreaming={isStreaming}
                onToggleStreaming={handleToggleStreaming}
              ></LogsTable>
            </Tab>
            <Tab eventKey={5} title={<TabTitleText>Events</TabTitleText>}>
              Events
            </Tab>
            <Tab eventKey={6} title={<TabTitleText>Terminal</TabTitleText>}>
              Terminal
            </Tab>
          </Tabs>
        </PanelMainBody>
      </PanelMain>
    </Panel>
  );
};
