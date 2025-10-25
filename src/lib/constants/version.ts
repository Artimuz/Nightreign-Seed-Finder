// This file centralizes version information from package.json
// It can be safely imported from both client and server code
import packageJson from '../../../package.json';

export const APP_VERSION = packageJson.version;
export const APP_NAME = packageJson.name;