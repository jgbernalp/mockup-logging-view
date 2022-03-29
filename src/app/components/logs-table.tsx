import { ExpandableRowContent, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import * as _ from 'lodash-es';
import React from 'react';
import { DateFormat, dateToFormat } from './date-utils';
import { StreamLogData } from './logs.types';
import { ResourceLink } from './resource-link';
import './logs-table.css';
import { LogDetail } from './log-detail';

interface LogsTableProps {
  logsData: Array<StreamLogData>;
}

const aggregateStreamLogData = (data: Array<StreamLogData>): StreamLogData => {
  // TODO merge based on timestamp
  // TODO color code different streams
  const aggregatedValues = data.length === 1 ? data[0].values : _.flatMap(data.map((stream) => stream.values));

  return {
    stream: {},
    // TODO remove limit, check virtualized table
    values: aggregatedValues.slice(0, 100),
  };
};

const getSeverityClass = (severity: string) => {
  return severity ? `co-logs-table__severity-${severity}` : '';
};

export const LogsTable: React.FC<LogsTableProps> = ({ logsData }) => {
  const [expandedItems, setExpandedItems] = React.useState<Set<number>>(new Set());
  // TODO aggregate
  const aggregatedData = React.useMemo(() => aggregateStreamLogData(logsData), [logsData]);
  const tableData = aggregatedData.values.map((value, index) => {
    const timestamp = String(value[0]);
    const time = parseFloat(timestamp) / 1e6;
    const formattedTime = dateToFormat(new Date(time), DateFormat.Full);

    return {
      time: formattedTime,
      timestamp,
      severity: ['error', 'info', 'warning', ''][index % 4],
      resources: [
        {
          type: 'POD',
          id: 'cluster-6b8b8f66c7-k4v9q',
          // TODO: resource link builder
          link: '/k8s/ns/openshift-gitops/pods/cluster-6b8b8f66c7-k4v9q',
        },
        {
          type: 'CONTAINER',
          id: 'cluster',
          // TODO: resource link builder
          link: 'k8s/ns/openshift-gitops/pods/cluster-6b8b8f66c7-k4v9q/containers/cluster',
        },
      ],
      message: value[1],
    };
  });

  const handleRowToggle = (_event: React.MouseEvent, rowIndex: number) => {
    if (expandedItems.has(rowIndex)) {
      expandedItems.delete(rowIndex);
      setExpandedItems(new Set(expandedItems));
    } else {
      setExpandedItems(new Set(expandedItems.add(rowIndex)));
    }
  };

  let rowIndex = 0;

  return (
    <TableComposable aria-label="Expandable Table" variant="compact">
      <Thead>
        <Tr>
          <Th></Th>
          <Th></Th>
          <Th>Date</Th>
          <Th>Resources</Th>
          <Th>Message</Th>
        </Tr>
      </Thead>

      {tableData.map((value, index) => {
        const isExpanded = expandedItems.has(rowIndex);
        const parentRow = (
          <Tr
            key={`${value.timestamp}-${rowIndex}`}
            className={`co-logs-table__row ${getSeverityClass(value.severity)}`}
          >
            <Td expand={{ isExpanded, onToggle: handleRowToggle, rowIndex }} />
            <Td className="co-logs-table__time">{value.time}</Td>
            <Td>
              {value.resources.map((resource) => (
                <ResourceLink link={resource.link} type={resource.type} name={resource.id} key={resource.id} />
              ))}
            </Td>
            <Td className="co-logs-table__message">{value.message}</Td>
          </Tr>
        );

        const childRow = isExpanded ? (
          <Tr isExpanded={true} key={`${value.timestamp}-${rowIndex}-child`}>
            <Td colSpan={5}>
              <ExpandableRowContent>
                <LogDetail />
              </ExpandableRowContent>
            </Td>
          </Tr>
        ) : null;

        rowIndex += isExpanded ? 2 : 1;

        return (
          <Tbody isExpanded={isExpanded} key={index}>
            {parentRow}
            {childRow}
          </Tbody>
        );
      })}
    </TableComposable>
  );
};
