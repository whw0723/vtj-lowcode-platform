import { jsonp } from '@vtj/utils';
import type { BlockSchema, PlatformType } from '@vtj/core';
import {
  useEngine,
  type PublishTemplateDto,
  type TemplateDto,
  type TopicDto,
  type ChatDto,
  type Settings,
  type CompletionChunk
} from '../../framework';
import { alert } from '../../utils';

export type { TemplateDto, PublishTemplateDto, TopicDto, ChatDto };

export function useOpenApi() {
  const engine = useEngine();
  const { access, remote, openApi } = engine || {};

  const getImage = (path?: string) => {
    if (openApi?.getImage) {
      return openApi?.getImage(path);
    }
    return path ? `${remote}/api/oss/file/${path}` : undefined;
  };

  const getOssFile = (path?: string) => {
    if (openApi?.getOssFile) {
      return openApi?.getOssFile(path);
    }
    return path ? `${remote}/api/oss/file/${path}` : undefined;
  };

  const loginBySign = async () => {
    const { auth } = engine.options;
    if (!access) return;

    if (openApi?.loginBySign) {
      const data = await openApi.loginBySign(auth).catch(() => null);
      if (data) {
        access?.login(data);
      }
      return;
    }
    if (!remote || !auth) return;
    if (typeof auth === 'string') {
      const api = `${remote}/api/open/auth/${auth}`;
      const res = await jsonp(api).catch(() => null);
      if (res && res.data) {
        access.login(res.data);
      }
    } else if (typeof auth === 'function') {
      const res = await auth().catch(() => null);
      if (res && res.data) {
        access.login(res.data);
      }
    }
  };

  const toRemoteAuth = () => {
    if (remote && access) {
      const redirect = encodeURIComponent(location.href);
      const { auth = '/login' } = access.options;
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
      if (openApi?.isLogined) {
        const data = await openApi.isLogined().catch(() => null);
        return !!data;
      }
      const api = `${remote}/api/open/user/${token}`;
      const res = await jsonp(api).catch(() => null);
      if (res && res.data) {
        access?.login(res.data);
        return true;
      }
      return false;
    }
    return false;
  };

  const getTemplates = async (platform: PlatformType = 'web') => {
    if (openApi?.getTemplates) {
      return await openApi?.getTemplates(platform);
    }
    const api = `${remote}/api/open/templates`;
    const token = access?.getData()?.token;
    const res = await jsonp(api, {
      query: token ? { platform, token } : { platform }
    });
    return (res?.data || []) as TemplateDto[];
  };

  const getTemplateById = async (id: string) => {
    if (openApi?.getTemplateById) {
      return await openApi?.getTemplateById(id);
    }
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/template/${token}`;
    const res = await jsonp(api, { query: { id } });
    return (res?.data || null) as TemplateDto;
  };

  const removeTemplate = async (id: string) => {
    if (openApi?.removeTemplate) {
      return await openApi?.removeTemplate(id);
    }
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/template/remove/${token}`;
    const res = await jsonp(api, { query: { id } });
    return !!res?.data;
  };

  const getTemplateDsl = async (id: string) => {
    if (openApi?.getTemplateDsl) {
      return await openApi?.getTemplateDsl(id);
    }
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/dsl/${token}`;
    const res = await jsonp(api, { query: { id } });
    if (res?.data) {
      return res.data as BlockSchema;
    }
    return null;
  };

  const getDictOptions = async (code: string) => {
    if (openApi?.getDictOptions) {
      return await openApi?.getDictOptions(code);
    }
    const api = `${remote}/api/open/dict/${code}`;
    const res = await jsonp(api).catch(() => null);
    return res?.data || [];
  };

  const getTemplateCategories = () => getDictOptions('TemplateCategory');

  const publishTemplate = async (dto: PublishTemplateDto) => {
    if (openApi?.publishTemplate) {
      return await openApi?.publishTemplate(dto);
    }
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
    if (openApi?.postTopic) {
      return await openApi?.postTopic(dto);
    }
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/topic/post/${token}`;
    const res = await window
      .fetch(api, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dto)
      })
      .then((res) => res.json())
      .catch(() => null);
    if (!res?.success) {
      await alert(res.message || '未知错误');
    }
    return res;
  };

  const postImageTopic = async (dto: TopicDto) => {
    if (openApi?.postImageTopic) {
      return await openApi?.postImageTopic(dto);
    }
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/topic/image/${token}`;
    const data = new FormData();
    Object.entries(dto).forEach(([name, value]) => {
      data.append(name, value);
    });
    const res = await window
      .fetch(api, {
        method: 'post',
        body: data
      })
      .then((res) => res.json())
      .catch((e) => e);
    if (!res?.success) {
      await alert(res.message || '未知错误');
    }
    return res;
  };

  const postJsonTopic = async (dto: TopicDto) => {
    if (openApi?.postJsonTopic) {
      return await openApi?.postJsonTopic(dto);
    }
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/topic/json/${token}`;
    const data = new FormData();
    Object.entries(dto).forEach(([name, value]) => {
      data.append(name, value);
    });
    const res = await window
      .fetch(api, {
        method: 'post',
        body: data
      })
      .then((res) => res.json())
      .catch((e) => e);
    if (!res?.success) {
      await alert(res.message || '未知错误');
    }
    return res;
  };

  const getChats = async (topicId: string) => {
    if (openApi?.getChats) {
      return await openApi?.getChats(topicId);
    }
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/chat/list/${token}?id=${topicId}`;
    const res = await window.fetch(api, {
      method: 'get'
    });
    return await res.json();
  };

  const getTopics = async (fileId: string) => {
    if (openApi?.getTopics) {
      return await openApi?.getTopics(fileId);
    }
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/topic/list/${token}?id=${fileId}`;
    const res = await window.fetch(api, {
      method: 'get'
    });
    return await res.json();
  };

  const postChat = async (dto: ChatDto) => {
    if (openApi?.postChat) {
      return await openApi?.postChat(dto);
    }
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/chat/post/${token}`;
    const res = await window
      .fetch(api, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dto)
      })
      .then((res) => res.json())
      .catch(() => null);
    if (!res?.success) {
      await alert(res.message || '未知错误');
    }
    return res;
  };

  const saveChat = async (chat: any) => {
    if (openApi?.saveChat) {
      return await openApi?.saveChat(chat);
    }
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

  const cancelChat = async (chat: any) => {
    if (openApi?.cancelChat) {
      return await openApi.cancelChat(chat);
    }
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/chat/cancel/${token}?id=${chat.id}`;
    const res = await window.fetch(api, {
      method: 'get'
    });
    return await res.json();
  };

  const removeTopic = async (topicId: string) => {
    if (openApi?.removeTopic) {
      return await openApi?.removeTopic(topicId);
    }
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/topic/remove/${token}?id=${topicId}`;
    const res = await window.fetch(api, {
      method: 'get'
    });
    return await res.json();
  };

  const getHotTopics = async () => {
    if (openApi?.getHotTopics) {
      return await openApi?.getHotTopics();
    }
    const api = `${remote}/api/open/topic/hot`;
    return await window
      .fetch(api, {
        method: 'get'
      })
      .then((res) => res.json())
      .catch(() => null);
  };

  const chatCompletions = async (
    topicId: string,
    chatId: string,
    callback?: (data: CompletionChunk | null, done?: boolean) => void,
    error?: (err: Error, cancel?: boolean) => void
  ) => {
    if (openApi?.chatCompletions) {
      return await openApi?.chatCompletions(topicId, chatId, callback, error);
    }

    const token = access?.getData()?.token;
    const api = `${remote}/api/open/completions/${token}?tid=${topicId}&id=${chatId}`;
    const controller = new AbortController();
    const signal = controller.signal;

    // 新增：行处理函数
    const processLine = (line: string) => {
      if (!line.startsWith('data: ')) return;

      const content = line.slice(6).trim();
      if (!content) return; // 忽略空消息

      try {
        const data = JSON.parse(content);
        callback?.(data, false);
      } catch (e) {
        error?.(new Error(content));
        controller.abort();
      }
    };

    // 新增：统一错误处理
    const handleError = (err: unknown) => {
      const isAbort = err instanceof Error && err.name === 'AbortError';
      const errorObj = err instanceof Error ? err : new Error(String(err));
      if (!isAbort) {
        error?.(errorObj, isAbort);
        controller.abort();
      }
    };

    // 新增：行缓冲区
    let buffer = '';
    const decoder = new TextDecoder();

    fetch(api, {
      method: 'get',
      signal
    })
      .then(async (res) => {
        const reader = res.body?.getReader();
        if (!reader) return;

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              // 处理缓冲区剩余内容
              if (buffer) {
                processLine(buffer);
              }
              callback?.(null, true);
              break;
            }

            // 解码并追加到缓冲区
            buffer += decoder.decode(value, { stream: true });

            // 按行分割并处理完整行
            const lines = buffer.split('\n');
            // 保留最后一行（可能不完整）
            buffer = lines.pop() || '';

            for (const line of lines) {
              processLine(line);
            }
          }
        } catch (e) {
          handleError(e);
        }
      })
      .catch(handleError);

    return () => controller.abort();
  };

  const getSettins = async () => {
    if (openApi?.getSettins) {
      return await openApi?.getSettins();
    }
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/settings/${token}`;
    const res = await window
      .fetch(api, {
        method: 'get'
      })
      .then((res) => res.json())
      .catch(() => null);
    return res?.data as Settings;
  };

  const createOrder = async () => {
    if (openApi?.createOrder) {
      return await openApi?.createOrder();
    }
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/order/${token}`;
    const res = await window
      .fetch(api, {
        method: 'post'
      })
      .then((res) => res.json())
      .catch(() => null);
    if (!res?.success) {
      await alert(res.message || '未知错误');
    }
    return res;
  };

  const cancelOrder = async (id: string) => {
    if (openApi?.cancelOrder) {
      return await openApi?.cancelOrder(id);
    }
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/order/cancel/${token}?id=${id}`;
    return await window
      .fetch(api, {
        method: 'get'
      })
      .then((res) => res.json())
      .catch(() => null);
  };

  const getOrder = async (id: string) => {
    if (openApi?.getOrder) {
      return await openApi?.getOrder(id);
    }
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/order/${token}?id=${id}`;
    return await window
      .fetch(api, {
        method: 'get'
      })
      .then((res) => res.json())
      .catch(() => null);
  };

  // const uploader = async (file: File) => {
  //   if (openApi?.uploader) {
  //     return await openApi?.uploader(file);
  //   }
  //   const token = access?.getData()?.token;
  //   const api = `${remote}/api/open/upload/${token}`;
  //   const data = new FormData();
  //   data.append('file', file);
  //   return await window
  //     .fetch(api, {
  //       method: 'post',
  //       body: data
  //     })
  //     .then((res) => res.json())
  //     .catch(async (e) => {
  //       await alert(e.message || '上传失败');
  //       return null;
  //     });
  // };

  return {
    engine,
    access,
    remote,
    loginBySign,
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
    getHotTopics,
    getSettins,
    createOrder,
    cancelOrder,
    getOrder,
    getImage,
    getOssFile,
    postImageTopic,
    postJsonTopic,
    cancelChat
  };
}
