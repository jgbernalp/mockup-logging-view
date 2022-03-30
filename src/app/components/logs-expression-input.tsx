import { Button, TextInput } from '@patternfly/react-core';
import React from 'react';
import './logs-expression-input.css';

export const LogsExpressionInput: React.FC = () => {
  return (
    <div className="co-logs-expression-input">
      <TextInput
        className="co-logs-expression-input__textInput"
        aria-label="LogQL expression input"
        placeholder="LogQL Query"
      />
      <Button variant="primary">Run Query</Button>
    </div>
  );
};
