import rootConfig from '../../eslint.config.mjs';
import nextPlugin from 'eslint-config-next/core-web-vitals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...rootConfig,
  nextPlugin
  // You can add app-specific overrides here
);
