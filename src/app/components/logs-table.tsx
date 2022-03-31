import { ColumnManagementModal } from '@app/console-components/column-management-modal';
import {
  Button,
  Checkbox,
  Split,
  SplitItem,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Tooltip,
} from '@patternfly/react-core';
import { ColumnsIcon } from '@patternfly/react-icons';
import { ExpandableRowContent, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import * as _ from 'lodash-es';
import React from 'react';
import { ResourceLink } from '../console-components/resource-link';
import { DateFormat, dateToFormat } from './date-utils';
import { LogDetail } from './log-detail';
import './logs-table.css';
import { MetricValue, StreamLogData } from './logs.types';

interface LogsTableProps {
  logsData: Array<StreamLogData>;
}

type LogsTableColumn = {
  title: string;
  isDisabled?: boolean;
  isSelected?: boolean;
};

const parseValueData = (value: MetricValue, index: number) => {
  const timestamp = String(value[0]);
  const time = parseFloat(timestamp) / 1e6;
  const formattedTime = dateToFormat(new Date(time), DateFormat.Full);

  return {
    time: formattedTime,
    timestamp,
    severity: ['error', 'info', 'warning', ''][index % 3],
    namespace: {
      type: 'POD',
      id: ['default', 'openshift-console', 'openshift-monitoring', ''][index % 3],
      // TODO: resource link builder
      link: '/k8s/ns/openshift-gitops/pods/cluster-6b8b8f66c7-k4v9q',
    },
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
};

const aggregateStreamLogData = (data: Array<StreamLogData>) => {
  // TODO merge based on timestamp
  // TODO color code different streams
  const aggregatedValues = data.length === 1 ? data[0].values : _.flatMap(data.map((stream) => stream.values));

  return aggregatedValues.slice(0, 100).map(parseValueData);
};

const getSeverityClass = (severity: string) => {
  return severity ? `co-logs-table__severity-${severity}` : '';
};

const defaultColumns: Array<LogsTableColumn> = [
  {
    title: 'Date',
    isDisabled: true,
    isSelected: true,
  },
  {
    title: 'Message',
    isDisabled: true,
    isSelected: true,
  },
];

const defaultAdditionalColumns: Array<LogsTableColumn> = [
  {
    title: 'Resources',
    isDisabled: false,
    isSelected: false,
  },
  {
    title: 'Namespace',
    isDisabled: false,
    isSelected: false,
  },
];

export const LogsTable: React.FC<LogsTableProps> = ({ logsData, children }) => {
  const [expandedItems, setExpandedItems] = React.useState<Set<number>>(new Set());
  const [showResources, setShowResources] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [additionalColumns, setAdditionalColumns] = React.useState(defaultAdditionalColumns);
  const tableData = React.useMemo(() => aggregateStreamLogData(logsData), [logsData]);

  const handleRowToggle = (_event: React.MouseEvent, rowIndex: number) => {
    if (expandedItems.has(rowIndex)) {
      expandedItems.delete(rowIndex);
      setExpandedItems(new Set(expandedItems));
    } else {
      setExpandedItems(new Set(expandedItems.add(rowIndex)));
    }
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleColumnsSelected = (columns: Array<LogsTableColumn>) => {
    setIsModalOpen(false);
    setAdditionalColumns(columns);
  };

  const visibleColumns = React.useMemo(
    () => additionalColumns.filter((column) => column.isSelected),
    [additionalColumns]
  );

  let rowIndex = 0;

  return (
    <>
      {/* TODO: use ColumnManagementModal from console project */}
      <ColumnManagementModal
        columns={defaultColumns.concat(additionalColumns)}
        isModalOpen={isModalOpen}
        onModalToggle={handleModalToggle}
        onColumnsSelected={handleColumnsSelected}
      />
      <div>
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
            <ToolbarGroup variant="icon-button-group">
              <ToolbarItem>
                <Tooltip content="Manage columns">
                  <Button variant="plain" aria-label="edit" onClick={handleModalToggle}>
                    <ColumnsIcon />
                  </Button>
                </Tooltip>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        <TableComposable aria-label="Logs Table" variant="compact" className="co-logs-table" isStriped isExpandable>
          <Thead>
            <Tr>
              <Th></Th>
              <Th></Th>
              <Th>Date</Th>
              <Th>Message</Th>
              {visibleColumns.map((column) => (
                <Th key={column.title}>{column.title}</Th>
              ))}
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
                {visibleColumns.map((column, index) => {
                  let columnContent: React.ReactNode = null;
                  switch (column.title) {
                    case 'Resources':
                      columnContent = value.resources.map((resource) => (
                        <ResourceLink key={resource.id} link={resource.link} type={resource.type} name={resource.id} />
                      ));
                      break;
                    case 'Namespace':
                      {
                        const namespace = value.namespace;
                        columnContent = (
                          <ResourceLink key={namespace.id} link={namespace.link} type="NAMESPACE" name={namespace.id} />
                        );
                      }
                      break;
                  }

                  return columnContent ? (
                    <Td key={`additional-col-${column.title}-row-${index}`}>{columnContent}</Td>
                  ) : null;
                })}
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

            // Expanded elements add a row in the table
            rowIndex += isExpanded ? 2 : 1;

            return (
              <Tbody isExpanded={isExpanded} key={index}>
                {parentRow}
                {childRow}
              </Tbody>
            );
          })}
        </TableComposable>
      </div>
    </>
  );
};
