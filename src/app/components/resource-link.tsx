import React from 'react';

const iconStyle: React.CSSProperties = {
  borderRadius: '20px',
  color: 'var(--pf-global--palette--white)',
  display: 'inline-block',
  flexShrink: 0,
  fontSize: '14px',
  lineHeight: '16px',
  marginRight: '4px',
  padding: '1px 4px',
  textAlign: 'center',
  whiteSpace: 'nowrap',
};

const linkStyle: React.CSSProperties = {
  whiteSpace: 'nowrap',
  display: 'inline-block',
};

const linkContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

interface ResourceLinkProps {
  type: string;
  name: string;
  link: string;
}

export const ResourceLink: React.FC<ResourceLinkProps> = ({ type, name, link }) => {
  const renderIcon = (type: string) => {
    switch (type) {
      case 'POD':
        return <div style={{ ...iconStyle, backgroundColor: '#009596' }}>P</div>;
      case 'CONTAINER':
        return <div style={{ ...iconStyle, backgroundColor: '#2b9af3' }}>C</div>;
    }
    return null;
  };

  return (
    <div style={linkContainerStyle}>
      {renderIcon(type)}
      <a style={linkStyle} href={link}>
        {name}
      </a>
    </div>
  );
};
