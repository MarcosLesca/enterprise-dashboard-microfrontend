import { FederatedTypes } from '@module-federation/vite';
import { ModuleFederationPlugin } from '@module-federation/webpack';

const moduleFederationConfig: ModuleFederationPlugin = {
  name: 'reactAnalytics',
  filename: 'remoteEntry.js',
  exposes: {
    './src/simple-analytics': './SimpleAnalytics',
  },
  shared: {
    'react': { singleton: true, requiredVersion: '^18.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
  },
};

export default moduleFederationConfig;