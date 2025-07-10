/***************************************************************************************************
 * Global polyfills required by Angular and other libraries
 **************************************************************************************************/

// Zone JS is required by Angular itself.
import 'zone.js';  

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Global objects that might be needed (example: for crypto support)
(window as any).global = window;
