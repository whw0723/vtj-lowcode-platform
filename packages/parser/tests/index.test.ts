import { expect, test } from 'vitest';
import { tsFormatter } from '@vtj/coder';
import { parseUniApp, parseVue, replacer } from '../src';
import { App } from './UniApp';
import { template1, dependencies } from './template';

// test('index', async () => {
//   const result = parseUniApp(App);
//   console.log(result);

//   expect(true).toBeTruthy();
// });

test('template1', async () => {
  const result = await parseVue({
    id: '235w0t1w',
    name: 'Bbb',
    source: template1,
    dependencies: dependencies as any
  });
  console.log(JSON.stringify(result, null, 2));

  expect(true).toBeTruthy();
});

// test('replacer', async () => {
//   const code = await tsFormatter(`
//     let item = 1;
//   itemIndex= 1
//    const {itemIndex,title,item,useitem} = item;
//    const title = item.title;
//    const a = this.item;
//    if(index>0){
//      console.log( item[0] );
//    }
//      item.item += '1'

//   `);
//   const result = replacer(code, 'item', 'this.context.item');

//   console.log(result);
// });
