import { ref, watch, type Ref, reactive } from 'vue';
import { useOpenApi, type TopicDto, type ChatDto } from './useOpenApi';
import type {
  ProjectSchema,
  PlatformType,
  BlockSchema,
  BlockModel
} from '@vtj/core';
import { useElementSize } from '@vueuse/core';

export type UseAIOptions = ReturnType<typeof useOpenApi>;

export interface Dict {
  label: string;
  value: any;
}

export interface AISendData {
  model: string;
  auto: boolean;
  prompt: string;
  type?: string;
}

export interface AITopic {
  id: string;
  appId: string;
  createAt: string;
  fileId: string;
  isHot: boolean;
  model: string;
  platform: string;
  projectId: string;
  title: string;
  prompt: string;
  dependencies: string;
  dsl: any;
}

export interface AIChat {
  id: string;
  content: string;
  createdAt: string;
  dsl: any;
  message: string;
  prompt: string;
  reasoning: string;
  status: string;
  tokens: number;
  topicId: string;
  userId: string;
  userName: string;
  thinking: number;
  vue: string;
}

export interface CompletionsParams {
  chat: AIChat;
  callback?: (data: any, done?: boolean) => void;
  error?: (e: any, cancel?: boolean) => void;
}

function useDict(code: string, getDictOptions: (code: string) => Promise<any>) {
  const result: Ref<Dict[]> = ref([]);
  if (getDictOptions) {
    getDictOptions(code).then((res: any) => {
      result.value = res || [];
    });
  }

  return result;
}

async function createTopicDto(
  data: AISendData,
  engine: UseAIOptions['engine']
) {
  const { model, type, prompt } = data;
  const projectDsl = engine.project.value?.toDsl() as ProjectSchema;
  const { dependencies = [], __UID__, id, platform } = projectDsl;
  const deps = dependencies.map((n) => n.package);
  const dsl = engine.current.value?.toDsl() as BlockSchema;
  const vue = await engine.service.genVueContent(projectDsl, dsl);

  const dto: TopicDto = {
    model,
    type: type as string,
    prompt,
    projectId: __UID__ as string,
    appId: id as string,
    fileId: dsl?.id as string,
    dsl: JSON.stringify(dsl),
    platform: platform as PlatformType,
    dependencies: deps,
    vue
  };
  return dto;
}

export function useAI(options: Partial<UseAIOptions>) {
  const {
    getDictOptions,
    postTopic,
    getTopics,
    getChats,
    postChat,
    removeTopic,
    chatCompletions,
    saveChat,
    engine
  } = options as UseAIOptions;

  const region = engine.skeleton?.getRegion('Apps').regionRef;
  const isReady = ref(false);
  const loading = ref(false);
  const isNewChat = ref(true);
  const models = useDict('LLM', getDictOptions);
  const topicTypes = useDict('TopicType', getDictOptions);
  const topics = ref<AITopic[]>([]);
  const chats = ref<AIChat[]>([]);
  const currentTopic = ref<AITopic | null>();
  const listRef = ref();
  const panelRef = ref();
  const { height } = useElementSize(listRef);

  watch(height, () => {
    if (panelRef.value) {
      panelRef.value.scrollToBottom();
    }
  });

  const loadChats = async (topicId: string) => {
    const res = await getChats(topicId);
    if (res && res.success) {
      chats.value = res.data;
    }
  };

  const init = async (block: BlockModel | null) => {
    isReady.value = false;
    if (!block) return;
    if (block.id === currentTopic.value?.fileId) return;
    topics.value = [];
    chats.value = [];
    isNewChat.value = true;
    const res = await getTopics(block.id).catch(() => null);
    if (res && res.success) {
      topics.value = res.data;
    }
    if (topics.value.length) {
      isNewChat.value = false;
      currentTopic.value = topics.value[0];
      await loadChats(currentTopic.value.id);
    }
    isReady.value = true;
  };

  const onPostTopic = async (data: AISendData) => {
    loading.value = true;
    const dto = await createTopicDto(data, engine);
    const res = await postTopic(dto).catch(() => null);
    loading.value = false;
    if (res && res.success) {
      const { topic, chat } = res.data;
      chats.value = [];
      topics.value.unshift(topic);
      isNewChat.value = false;
      currentTopic.value = topic;
      const rChat = reactive(chat);
      chats.value.push(rChat);
      completions(rChat, (c) => {
        if (data.auto) {
          onApply(c);
        }
      });
    }
    return res;
  };

  const onPostChat = async (data: AISendData) => {
    if (!currentTopic.value) return;
    loading.value = true;
    const dto: ChatDto = {
      topicId: currentTopic.value.id,
      prompt: data.prompt
    };
    const res = await postChat(dto).catch(() => null);
    loading.value = false;

    if (res && res.success) {
      const chat = reactive(res.data);
      chats.value.push(chat);
      completions(chat, (c) => {
        if (data.auto) {
          onApply(c);
        }
      });
    }
    return res;
  };

  const onRemoveTopic = async (topic: AITopic) => {
    const res = await removeTopic(topic.id).catch(() => null);
    if (res && res.success) {
      topics.value = topics.value.filter((n) => n.id !== topic.id);
      if (topic.id === currentTopic.value?.id) {
        chats.value = [];
        currentTopic.value = null;
        isNewChat.value = true;
      }
    }
  };

  const vue2Dsl = async (chat: AIChat) => {
    if (!currentTopic.value) return;
    const id = currentTopic.value?.fileId as string;
    const { dependencies = [] } = engine.project.value || {};
    const { name = '' } = engine.current.value || {};
    const source = getVueCode(chat.content);
    return await engine.service.parseVue({
      id,
      name,
      source,
      dependencies
    });
  };

  const completions = (chat: AIChat, complete?: (chat: AIChat) => void) => {
    chat.content = '';
    chat.reasoning = '';
    chat.status = 'Pending';
    chat.reasoning = '';
    let thinking: number = 0;
    const now = Date.now();
    return chatCompletions(
      chat.topicId,
      chat.id,
      async (data, done) => {
        const choice = data?.choices?.[0];
        const delta = choice?.delta;
        if (delta) {
          const content = delta.content || '';
          const reasoning = delta.reasoning_content || '';
          if (content) {
            chat.content += content;
          }
          if (reasoning) {
            chat.reasoning += reasoning;
            thinking += Date.now() - now;
          }
        }
        if (data?.usage) {
          chat.tokens = data.usage.total_tokens || 0;
        }
        if (done && chat.status === 'Pending') {
          chat.status = 'Success';
          chat.thinking = Math.ceil(thinking / 1000);
          chat.vue = getVueCode(chat.content);
          const dsl = await vue2Dsl(chat).catch((e) => {
            chat.message = e.message;
            chat.status = 'Error';
            return null;
          });
          chat.dsl = dsl;
          await saveChat(chat);
          complete && complete(chat);
        }
      },
      async (err: any) => {
        const message = err.message || err.name || '未知错误';
        chat.message = message;
        chat.status = 'Failed';
        await saveChat(chat);
        complete && complete(chat);
      }
    );
  };

  const getVueCode = (content: string) => {
    const regex = /```vue\n([\w\W]*)```/;
    const matches = content.match(regex);
    return matches?.[1] ?? '';
  };

  const onRefresh = (chat: AIChat) => {
    return completions(chat);
  };

  const onApply = (chat: AIChat) => {
    if (chat.dsl) {
      engine.applyAI(chat.dsl);
    }
  };

  watch(
    () => region?.active,
    (widget) => {
      if (widget.name === 'AI') {
        init(engine.current.value);
      }
    },
    {
      immediate: true
    }
  );

  return {
    isReady,
    init,
    loading,
    isNewChat,
    models,
    topicTypes,
    onPostTopic,
    topics,
    chats,
    currentTopic,
    onPostChat,
    loadChats,
    onRemoveTopic,
    getVueCode,
    vue2Dsl,
    onRefresh,
    onApply,
    listRef,
    panelRef
  };
}
