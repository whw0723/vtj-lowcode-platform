import { expect, test } from 'vitest';

import { parseUniApp, parseVue } from '../src';
import { App } from './UniApp';
import { template1 } from './template';

// test('index', async () => {
//   const result = parseUniApp(App);
//   console.log(result);

//   expect(true).toBeTruthy();
// });

test('template1', async () => {
  const result = parseVue('235w0t1w', 'Bbb', template1);
  console.log(JSON.stringify(result, null, 2));

  expect(true).toBeTruthy();
});
