import { LogsExpressionInput } from '@app/components/logs-expression-input';
import { LogsHistogram } from '@app/components/logs-histogram';
import { LogsTable } from '@app/components/logs-table';
import { logsStreamData, logsVolumeData } from '@app/data/logs-test-data';
import { useBoolean } from '@app/utils/useBoolean';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  Flex,
  FormGroup,
  Grid,
  PageSection,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { SyncAltIcon } from '@patternfly/react-icons';
import * as React from 'react';

const refreshIntervalOptions = [
  { key: 'OFF_KEY', name: 'Refresh off' },
  { key: '15s', name: '15 seconds' },
  { key: '30s', name: '30 seconds' },
  { key: '1m', name: '1 minute' },
  { key: '5m', name: '5 minutes' },
  { key: '15m', name: '15 minutes' },
  { key: '30m', name: '30 minutes' },
  { key: '1h', name: '1 hour' },
  { key: '2h', name: '2 hours' },
  { key: '1d', name: '1 day' },
];

const RefreshIntervalDropdown: React.FC = () => {
  const [isOpen, toggleIsOpen, , setClosed] = useBoolean(false);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);

  const handleSelectedValue = (index: number) => () => {
    setClosed();
    setSelectedIndex(index);
  };

  return (
    <FormGroup fieldId="logs-refresh-interval">
      <Dropdown
        dropdownItems={refreshIntervalOptions.map(({ key, name }, index) => (
          <DropdownItem componentID={key} onClick={handleSelectedValue(index)} key={key}>
            {name}
          </DropdownItem>
        ))}
        isOpen={isOpen}
        toggle={<DropdownToggle onToggle={toggleIsOpen}>{refreshIntervalOptions[selectedIndex].name}</DropdownToggle>}
      />
    </FormGroup>
  );
};

const timeRangeOptions = [
  { key: 'CUSTOM', name: 'Custom time range' },
  { key: '5m', name: 'Last 5 minutes' },
  { key: '15m', name: 'Last 15 minutes' },
  { key: '30m', name: 'Last 30 minutes' },
  { key: '1h', name: 'Last 1 hour' },
  { key: '2h', name: 'Last 2 hours' },
  { key: '6h', name: 'Last 6 hours' },
  { key: '12h', name: 'Last 12 hours' },
  { key: '1d', name: 'Last 1 day' },
  { key: '2d', name: 'Last 2 days' },
  { key: '1w', name: 'Last 1 week' },
  { key: '2w', name: 'Last 2 weeks' },
];

const TimeRangeDropdown: React.FC = () => {
  const [isOpen, toggleIsOpen, , setClosed] = useBoolean(false);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(1);

  const handleSelectedValue = (index: number) => () => {
    setClosed();
    setSelectedIndex(index);
  };

  return (
    <FormGroup fieldId="logs-time-range">
      <Dropdown
        dropdownItems={timeRangeOptions.map(({ key, name }, index) => (
          <DropdownItem componentID={key} onClick={handleSelectedValue(index)} key={key}>
            {name}
          </DropdownItem>
        ))}
        isOpen={isOpen}
        toggle={<DropdownToggle onToggle={toggleIsOpen}>{timeRangeOptions[selectedIndex].name}</DropdownToggle>}
      />
    </FormGroup>
  );
};

const LogsPage: React.FunctionComponent = () => {
  return (
    <PageSection>
      <Grid hasGutter>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <Title headingLevel="h1" size="lg">
            Logs
          </Title>
          <Flex>
            <TimeRangeDropdown />
            <RefreshIntervalDropdown />
            <Button variant="primary">
              <SyncAltIcon />
            </Button>
          </Flex>
        </Flex>
        <LogsHistogram logsData={logsVolumeData.data.result} />

        <LogsTable logsData={logsStreamData.data.result}>
          <LogsExpressionInput />
        </LogsTable>
      </Grid>
    </PageSection>
  );
};

export { LogsPage };
