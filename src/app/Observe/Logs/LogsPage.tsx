import { LogsHistogram } from '@app/components/LogsHistogram';
import { LogsTable } from '@app/components/LogsTable';
import { logsVolumeData, logsStreamData } from '@app/data/logs-test-data';
import { useBoolean } from '@app/utils/useBoolean';
import { Dropdown, DropdownItem, DropdownToggle, Flex, PageSection, Title } from '@patternfly/react-core';
import * as React from 'react';

const intervalOptions = [
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

const PollIntervalDropdown: React.FC = () => {
  const [isOpen, toggleIsOpen, , setClosed] = useBoolean(false);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);

  const handleSelectedValue = (index: number) => () => {
    setClosed();
    setSelectedIndex(index);
  };

  return (
    <Dropdown
      dropdownItems={intervalOptions.map(({ key, name }, index) => (
        <DropdownItem componentID={key} onClick={handleSelectedValue(index)} key={key}>
          {name}
        </DropdownItem>
      ))}
      isOpen={isOpen}
      toggle={<DropdownToggle onToggle={toggleIsOpen}>{intervalOptions[selectedIndex].name}</DropdownToggle>}
    />
  );
};

const LogsPage: React.FunctionComponent = () => {
  return (
    <PageSection>
      <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
        <Title headingLevel="h1" size="lg">
          Logs
        </Title>
        <div>
          <PollIntervalDropdown />
        </div>
      </Flex>
      <LogsHistogram logsData={logsVolumeData.data.result} />
      <LogsTable logsData={logsStreamData.data.result} />
    </PageSection>
  );
};

export { LogsPage };
