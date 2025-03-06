import { expect, test } from 'vitest';

import { parseUniApp, parseVue } from '../src';
import { App } from './UniApp';
import { source } from './template';

// test('index', async () => {
//   const result = parseUniApp(App);
//   console.log(result);

//   expect(true).toBeTruthy();
// });

test('vue', async () => {
  const result = parseVue(source);
  console.log(JSON.stringify(result, null, 2));

  expect(true).toBeTruthy();
});
