import { Button } from '@patternfly/react-core';
import { PauseIcon, PlayIcon } from '@patternfly/react-icons';
import React from 'react';
import './toggle-play.css';

interface TogglePlayWithTranslationProps {
  onClick?: (e: React.MouseEvent) => void;
  active?: boolean;
}

export const TogglePlayWithTranslation: React.FC<TogglePlayWithTranslationProps> = ({ onClick, active }) => {
  return (
    <Button
      variant="plain"
      className={`co-toggle-play ${active ? 'co-toggle-play--active' : ''}`}
      onClick={onClick}
      aria-label={active ? 'Pause streaming' : 'Start streaming'}
    >
      {active ? <PauseIcon size="sm" /> : <PlayIcon size="sm" />}
    </Button>
  );
};
