import { type JSExpression, type JSFunction } from '@vtj/core';
import { upperFirstCamelCase } from '@vtj/base';
export interface ExpressionOptions {
  context: Record<string, Set<string>>;
  computed: string[];
  libs: Record<string, string>;
  members: string[];
}

export function replacer(content: string, key: string, to: string) {
  const r1 = new RegExp(`${key}`, 'g');
  const r2 = /(\{|\.|\,|\w)$/;
  const r3 = /^\w/;
  return content.replace(r1, (str, index, source) => {
    const start = source.substring(0, index);
    const end = source.substring(index + key.length);
    if (r2.test(start.trim()) || r3.test(end.trim())) {
      return str;
    }
    return to;
  });
}

export function patchCode(
  content: string,
  id: string,
  options: ExpressionOptions
) {
  const {
    context = {},
    computed = [],
    libs = {},
    members = []
  } = options || {};
  const contextKeys = Array.from(context[id || ''] || new Set());
  if (contextKeys) {
    for (const key of contextKeys) {
      content = replacer(content, key, `this.context.${key}`);
    }
  }

  for (const key of computed) {
    content = replacer(content, key, `this.${key}.value`);
  }

  for (const [key, value] of Object.entries(libs)) {
    content = replacer(content, key, `this.$libs.${value}.${key}`);
  }

  for (const key of members) {
    content = replacer(content, key, `this.${key}`);
  }

  return content;
}

export function getJSExpression(content: string) {
  return {
    type: 'JSExpression',
    value: content
  } as JSExpression;
}

export function getJSFunction(content: string) {
  return {
    type: 'JSFunction',
    value: content
  } as JSFunction;
}

export const LIFE_CYCLES_LIST = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeUnmount',
  'unmounted',
  'errorCaptured',
  'renderTracked',
  'renderTriggered',
  'activated',
  'deactivated'
];

export const HTML_TAGS =
  'html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot'.split(
    ','
  );

export const BUILD_IN_TAGS = 'component,slot,template'.split(',');

export function formatTagName(tag: string) {
  if (HTML_TAGS.includes(tag) || BUILD_IN_TAGS.includes(tag)) {
    return tag;
  }
  return upperFirstCamelCase(tag);
}
