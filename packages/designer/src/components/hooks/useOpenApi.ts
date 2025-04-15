import { jsonp } from '@vtj/utils';
import type { BlockSchema, PlatformType } from '@vtj/core';
import { useEngine } from '../../framework';

export interface PublishTemplateDto {
  name: string;
  label: string;
  category: string;
  cover: Blob;
  share: boolean;
  version: string;
  platform: string;
  latest?: string;
  dsl: string;
  id?: string;
}

export interface TemplateDto {
  id: string;
  name: string;
  label: string;
  vip: boolean;
  share: boolean;
  cover: string;
  author: string;
  userId: string;
  category: string;
  latest: string;
  platform: string;
}

export interface TopicDto {
  model: string;
  projectId: string;
  appId: string;
  fileId: string;
  type: string;
  prompt: string;
  dsl: string;
  platform: PlatformType;
  dependencies: string[];
  vue: string;
}

export interface ChatDto {
  topicId: string;
  prompt: string;
}

export function useOpenApi() {
  const engine = useEngine();
  const { access, remote } = engine || {};

  const toRemoteAuth = () => {
    if (remote && access) {
      const redirect = encodeURIComponent(location.href);
      const { auth = '/auth.html' } = access.options;
      const { protocol, host, pathname } = location;
      const clientUrl = `${protocol}//${host}${pathname}#/auth?redirect=${redirect}`;
      if (typeof auth === 'string') {
        const href = auth.startsWith('/') ? `${remote}${auth}` : auth;
        location.href = `${href}?r=${encodeURIComponent(clientUrl)}`;
      } else {
        auth(location.search);
      }
    }
  };

  const isLogined = async () => {
    const token = access?.getData()?.token;
    if (token) {
      const api = `${remote}/api/open/user/${token}`;
      const res = await jsonp(api).catch(() => null);
      if (res && res.data) {
        return true;
      }
      return false;
    }
    return false;
  };

  const getTemplates = async (platform: PlatformType = 'web') => {
    const api = `${remote}/api/open/templates`;
    const token = access?.getData()?.token;
    const res = await jsonp(api, {
      query: token ? { platform, token } : { platform }
    });
    return (res?.data || []) as TemplateDto[];
  };

  const getTemplateById = async (id: string) => {
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/template/${token}`;
    const res = await jsonp(api, { query: { id } });
    return (res?.data || null) as TemplateDto;
  };

  const removeTemplate = async (id: string) => {
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/template/remove/${token}`;
    const res = await jsonp(api, { query: { id } });
    return !!res?.data;
  };

  const getTemplateDsl = async (id: string) => {
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/dsl/${token}`;
    const res = await jsonp(api, { query: { id } });
    if (res?.data) {
      return res.data as BlockSchema;
    }
    return null;
  };

  const getDictOptions = async (code: string) => {
    const api = `${remote}/api/open/dict/${code}`;
    const res = await jsonp(api);
    return res?.data || [];
  };

  const getTemplateCategories = () => getDictOptions('TemplateCategory');

  const publishTemplate = async (dto: PublishTemplateDto) => {
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/template/publish/${token}`;
    const data = new FormData();
    for (const [name, value] of Object.entries(dto)) {
      if (value !== undefined) {
        data.append(name, value);
      }
    }
    return window
      .fetch(api, {
        method: 'post',
        body: data
      })
      .then((res) => res.json());
  };

  const postTopic = async (dto: TopicDto) => {
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/topic/post/${token}`;
    const res = await window.fetch(api, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    });
    return await res.json();
  };

  const getChats = async (topicId: string) => {
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/chat/list/${token}?id=${topicId}`;
    const res = await window.fetch(api, {
      method: 'get'
    });
    return await res.json();
  };

  const getTopics = async (fileId: string) => {
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/topic/list/${token}?id=${fileId}`;
    const res = await window.fetch(api, {
      method: 'get'
    });
    return await res.json();
  };

  const postChat = async (dto: ChatDto) => {
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/chat/post/${token}`;
    const res = await window.fetch(api, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    });
    return await res.json();
  };

  const saveChat = async (chat: any) => {
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/chat/save/${token}`;
    const res = await window.fetch(api, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(chat)
    });
    return await res.json();
  };

  const removeTopic = async (topicId: string) => {
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/topic/remove/${token}?id=${topicId}`;
    const res = await window.fetch(api, {
      method: 'get'
    });
    return await res.json();
  };

  const getHotTopics = async () => {
    const api = `${remote}/api/open/topic/hot`;
    const res = await window.fetch(api, {
      method: 'get'
    });
    return await res.json();
  };

  const chatCompletions = async (
    topicId: string,
    chatId: string,
    callback?: (data: any, done?: boolean) => void,
    error?: (err: any, cancel?: boolean) => void
  ) => {
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/completions/${token}?tid=${topicId}&id=${chatId}`;
    const controller = new AbortController();
    fetch(api, {
      method: 'get'
    })
      .then(async (res) => {
        const reader = res.body?.getReader();
        if (!reader) return;
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            callback && callback(null, true);
            break;
          }

          const lines = decoder.decode(value).split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                callback && callback(data, done);
              } catch (e) {
                const msg = line.slice(6);
                error && error(msg ? new Error(msg) : e);
                break;
              }
            }
          }
        }
      })
      .catch((err) => {
        error && error(err, err.name === 'AbortError');
      });

    return () => {
      controller.abort();
    };
  };

  return {
    engine,
    access,
    remote,
    toRemoteAuth,
    isLogined,
    getTemplates,
    getTemplateDsl,
    getDictOptions,
    getTemplateCategories,
    publishTemplate,
    getTemplateById,
    removeTemplate,
    postTopic,
    getChats,
    getTopics,
    postChat,
    removeTopic,
    chatCompletions,
    saveChat,
    getHotTopics
  };
}
