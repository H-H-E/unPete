import { Conversation, Message } from './chat';
import { FolderInterface } from './folder';
import { Prompt } from './prompt';
import { SystemPrompt } from './system-prompt';

export type SupportedExportFormats = poiesisPeteExportFormatV1;
export type LatestExportFormat = poiesisPeteExportFormatV1;

export interface poiesisPeteExportFormatV1 {
  app: 'poiesisPete';
  version: 1;
  conversations: Conversation[];
  folders: FolderInterface[];
  message_templates: Prompt[];
  system_prompts: SystemPrompt[];
}
