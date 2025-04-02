import { expect, test } from 'vitest';
import { tsFormatter } from '@vtj/coder';
import { parseUniApp, parseVue } from '../src';
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

// test('patchCode', async () => {
//   const code = await tsFormatter(`
//    const {title,item} = item;
//    const title = item.title;
//    if(index>0){
//      console.log( item[0] );
//    }
//      item.item += '1'

//   `);

//   const r1 = /item/g;

//   const result = code.replace(r1, (str, index, source) => {
//     const leftStr = source.substring(0, index);
//     const regex = /(\{|\.|\,)$/;
//     if (regex.test(leftStr.trim())) {
//       return str;
//     }
//     // console.log(leftStr.trim());
//     // const excludeRegex = new RegExp(`${str}`)
//     // console.log(str, index);
//     return 'this.context.' + str;
//   });

//   console.log(result);
// });
