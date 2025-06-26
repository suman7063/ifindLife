
import React from 'react';

// Temporary wrapper to replace the missing withProfileTypeAdapter
// This ensures existing components continue to work without modification
export const withProfileTypeAdapter = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => {
    return <Component {...props} />;
  };
};

export default withProfileTypeAdapter;
