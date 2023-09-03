import { IconFolderPlus, IconMistOff, IconPlus } from '@tabler/icons-react';
import { useCallback, useContext, useEffect } from 'react';

import { useTranslation } from 'next-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { DEFAULT_TEMPERATURE } from '@/utils/app/const';
import { exportData, importData } from '@/utils/app/importExport';
import { storageDeleteConversation } from '@/utils/app/storage/conversation';
import { storageDeleteConversations } from '@/utils/app/storage/conversations';
import {
  storageDeleteFolders,
  storageUpdateFolders,
} from '@/utils/app/storage/folders';
import { localSaveAPIKey } from '@/utils/app/storage/local/apiKey';
import { localSaveShowPrimaryMenu } from '@/utils/app/storage/local/uiState';
import {
  deleteSelectedConversation,
  saveSelectedConversation,
} from '@/utils/app/storage/selectedConversation';

import { Conversation } from '@/types/chat';
import { Database } from '@/types/database';
import { LatestExportFormat, SupportedExportFormats } from '@/types/export';

import { ConversationList } from './components/ConversationList';
import { ConversationsSettings } from './components/ConversationsSettings';
import { ConversationsFolders } from './components/Folders';
import { PrimaryButtonAlt } from '@/components/Common/Buttons/PrimaryButton';
import { SecondaryButton } from '@/components/Common/Buttons/SecondaryButton';
import Search from '@/components/Common/Search';
import HomeContext from '@/components/Home/home.context';

import ConversationsContext from './Conversations.context';
import { ConversationsInitialState, initialState } from './Conversations.state';

import { v4 as uuidv4 } from 'uuid';

export const Conversations = () => {
  const { t } = useTranslation('conversations');

  const conversationsContextValue = useCreateReducer<ConversationsInitialState>(
    {
      initialState,
    },
  );

  const {
    state: {
      conversations,
      showPrimaryMenu,
      defaultModelId,
      database,
      folders,
      user,
    },
    dispatch: homeDispatch,
    handleCreateFolder,
    handleNewConversation,
    handleUpdateConversation,
  } = useContext(HomeContext);

  const {
    state: { searchTerm, filteredConversations },
    dispatch: chatDispatch,
  } = conversationsContextValue;

  const handleExportData = (database: Database) => {
    exportData(database, user!);
  };

  const handleImportConversations = async (data: SupportedExportFormats) => {
    if (!database || !user) return;
    const {
      conversations,
      folders,
      system_prompts,
      message_templates,
    }: LatestExportFormat = await importData(database, user, data);
    homeDispatch({ field: 'conversations', value: conversations });
    homeDispatch({
      field: 'selectedConversation',
      value: conversations[conversations.length - 1],
    });
    homeDispatch({ field: 'folders', value: folders });
    homeDispatch({ field: 'prompts', value: message_templates });
    homeDispatch({ field: 'systemPrompts', value: system_prompts });
  };

  const handleClearConversations = async () => {
    if (!database || !user) return;
    homeDispatch({ field: 'conversations', value: [] });

    const deletedFolders = folders.filter((f) => f.type === 'chat');

    let deletedFolderIds: string[] = [];
    for (const folder of deletedFolders) {
      deletedFolderIds.push(folder.id);
    }

    await storageDeleteConversations(database, user);
    storageDeleteFolders(database, user, deletedFolderIds);
    deleteSelectedConversation(user);

    const updatedFolders = folders.filter((f) => f.type !== 'chat');

    homeDispatch({ field: 'folders', value: updatedFolders });
    storageUpdateFolders(database, user, updatedFolders);
  };

  const handleDeleteConversation = (conversation: Conversation) => {
    if (!database || !user) return;
    const updatedConversations = storageDeleteConversation(
      database,
      user,
      conversation.id,
      conversations,
    );

    homeDispatch({ field: 'conversations', value: updatedConversations });
    chatDispatch({ field: 'searchTerm', value: '' });

    if (updatedConversations.length > 0) {
      homeDispatch({
        field: 'selectedConversation',
        value: updatedConversations[updatedConversations.length - 1],
      });

      saveSelectedConversation(
        user,
        updatedConversations[updatedConversations.length - 1],
      );
    } else {
      deleteSelectedConversation(user);
    }
  };

  const handleDrop = (e: any) => {
    if (e.dataTransfer) {
      const conversation = JSON.parse(e.dataTransfer.getData('conversation'));
      handleUpdateConversation(conversation, { key: 'folderId', value: null });
      chatDispatch({ field: 'searchTerm', value: '' });
      e.target.style.background = 'none';
    }
  };

  useEffect(() => {
    if (searchTerm) {
      chatDispatch({
        field: 'filteredConversations',
        value: conversations.filter((conversation) => {
          const searchable =
            conversation.name.toLocaleLowerCase() +
            ' ' +
            conversation.messages.map((message) => message.content).join(' ');
          return searchable.toLowerCase().includes(searchTerm.toLowerCase());
        }),
      });
    } else {
      chatDispatch({
        field: 'filteredConversations',
        value: conversations,
      });
    }
  }, [searchTerm, conversations, chatDispatch]);

  const doSearch = (term: string) =>
    chatDispatch({ field: 'searchTerm', value: term });

  const createFolder = () => handleCreateFolder(t('New folder'), 'chat');

  const allowDrop = (e: any) => {
    e.preventDefault();
  };

  const highlightDrop = (e: any) => {
    e.target.style.background = '#343541';
  };

  const removeHighlight = (e: any) => {
    e.target.style.background = 'none';
  };

  return (
    <ConversationsContext.Provider
      value={{
        ...conversationsContextValue,
        handleDeleteConversation,
        handleClearConversations,
        handleImportConversations,
        handleExportData,
      }}
    >
      <div className="flex items-center gap-x-2">
        <PrimaryButtonAlt
          onClick={() => {
            handleNewConversation();
            doSearch('');
          }}
        >
          {t('New conversation')}
        </PrimaryButtonAlt>

        <SecondaryButton onClick={createFolder}>
          <IconFolderPlus size={16} />
        </SecondaryButton>
      </div>
      <Search
        placeholder={t('Search...') || ''}
        searchTerm={searchTerm}
        onSearch={doSearch}
      />

      <div className="flex-grow overflow-auto">
        {filteredConversations?.length > 0 && (
          <div
            className="flex border-b pb-2
          border-theme-button-border-light dark:border-theme-button-border-dark"
          >
            <ConversationsFolders searchTerm={searchTerm} />
          </div>
        )}

        {filteredConversations?.length > 0 ? (
          <div
            className="pt-2"
            onDrop={handleDrop}
            onDragOver={allowDrop}
            onDragEnter={highlightDrop}
            onDragLeave={removeHighlight}
          >
            <ConversationList conversations={filteredConversations} />
          </div>
        ) : (
          <div className="mt-8 select-none text-center text-black dark:text-white opacity-50">
            <IconMistOff className="mx-auto mb-3" />
            <span className="text-[14px] leading-normal">{t('No data.')}</span>
          </div>
        )}
      </div>
      <ConversationsSettings />
    </ConversationsContext.Provider>
  );
};
