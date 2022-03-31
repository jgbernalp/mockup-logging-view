import { Button, SearchInput } from '@patternfly/react-core';
import React from 'react';
import './logs-expression-input.css';

export const LogsExpressionInput: React.FC = () => {
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleSearchClear = () => {
    setSearchValue('');
  };

  return (
    <div className="co-logs-expression-input">
      <SearchInput
        className="co-logs-expression-input__searchInput"
        placeholder="LogQL Query"
        value={searchValue}
        onChange={handleSearchChange}
        onClear={handleSearchClear}
        // resultsCount={`${currentSearchResult} / ${searchResultsCount}`}
        // onNextClick={this.onSearchNext}
        // onPreviousClick={this.onSearchPrevious}
      />
      <Button variant="primary">Run Query</Button>
    </div>
  );
};
