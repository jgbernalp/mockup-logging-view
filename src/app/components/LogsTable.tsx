import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import React from 'react';
import { StreamLogData } from './Logs.types';

interface LogsTableProps {
  logsData: Array<StreamLogData>;
}

export const LogsTable: React.FC<LogsTableProps> = ({ logsData }) => {
  // TODO
  const aggregatedData = logsData[0].values;

  return (
    <TableComposable aria-label="Expandable Table" variant="compact">
      <Thead>
        <Tr>
          <Th />
          <Th>timestamp</Th>
          <Th>Pod</Th>
          <Th>Message</Th>
        </Tr>
      </Thead>
      <Tbody>
        {aggregatedData.map((value) => {
          return (
            <Tr key={value[0]}>
              <Td></Td>
              <Td>{value[0]}</Td>
              <Td></Td>
              <Td>{value[1]}</Td>
            </Tr>
          );
        })}
      </Tbody>
    </TableComposable>
  );
};
