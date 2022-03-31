import { Checkbox, Split, SplitItem, Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import { ExpandableRowContent, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import * as _ from 'lodash-es';
import React from 'react';
import { DateFormat, dateToFormat } from './date-utils';
import { LogDetail } from './log-detail';
import './logs-table.css';
import { StreamLogData } from './logs.types';
import { ResourceLink } from './resource-link';

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

export const LogsTable: React.FC<LogsTableProps> = ({ logsData, children }) => {
  const [expandedItems, setExpandedItems] = React.useState<Set<number>>(new Set());
  const [showResources, setShowResources] = React.useState(false);
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
    <>
      <Toolbar isSticky>
        <ToolbarContent>
          <ToolbarItem className="co-logs-table-toolbar">{children}</ToolbarItem>

          <ToolbarGroup>
            <ToolbarItem>
              <Checkbox
                label="Show Resources"
                isChecked={showResources}
                onChange={setShowResources}
                aria-label="checkbox for showing resources names"
                id="showResourcesCheckbox"
              />
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>

      <TableComposable aria-label="Logs Table" variant="compact" className="co-logs-table">
        <Thead>
          <Tr>
            <Th></Th>
            <Th></Th>
            <Th>Date</Th>
            <Th>Message</Th>
          </Tr>
        </Thead>

        {tableData.map((value, index) => {
          const isExpanded = expandedItems.has(rowIndex);
          const severityClass = getSeverityClass(value.severity);

          const parentRow = (
            <Tr
              key={`${value.timestamp}-${rowIndex}`}
              className={`co-logs-table__row ${severityClass} ${
                isExpanded ? 'co-logs-table__row-parent-expanded' : ''
              }`}
            >
              <Td expand={{ isExpanded, onToggle: handleRowToggle, rowIndex }} />
              <Td className="co-logs-table__time">{value.time}</Td>
              <Td>
                <div className="co-logs-table__message">{value.message}</div>
                {showResources && (
                  <Split className="co-logs-table__resources" hasGutter>
                    {value.resources.map((resource) => (
                      <SplitItem key={resource.id}>
                        <ResourceLink link={resource.link} type={resource.type} name={resource.id} />
                      </SplitItem>
                    ))}
                  </Split>
                )}
              </Td>
            </Tr>
          );

          const childRow = isExpanded ? (
            <Tr
              className={`co-logs-table__row ${severityClass} co-logs-table__row-child-expanded`}
              isExpanded={true}
              key={`${value.timestamp}-${rowIndex}-child`}
            >
              <Td colSpan={100}>
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
    </>
  );
};
