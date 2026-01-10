import { describe, it, expect } from 'vitest';
import {
  getLaunchConfig,
  createWindowState,
  canOpenInWindow,
  shouldOpenExternal,
  isAction,
} from '../services/Launcher';

describe('Launcher Service', () => {
  describe('getLaunchConfig', () => {
    it('should return none for null/undefined item', () => {
      expect(getLaunchConfig(null).type).toBe('none');
      expect(getLaunchConfig(undefined).type).toBe('none');
    });

    it('should return folder config for folder items', () => {
      const item = {
        type: 'folder',
        label: 'My Folder',
        icon: '/icons/folder.svg',
        contents: ['page1', 'page2'],
      };
      const config = getLaunchConfig(item);
      expect(config.type).toBe('folder');
      expect(config.title).toBe('My Folder');
      expect(config.contents).toEqual(['page1', 'page2']);
    });

    it('should return external config for forceExternal items', () => {
      const item = {
        label: 'External Link',
        icon: '/icons/link.svg',
        url: 'https://example.com',
        forceExternal: true,
      };
      const config = getLaunchConfig(item);
      expect(config.type).toBe('external');
      expect(config.url).toBe('https://example.com');
    });

    it('should return app config for items with contentType', () => {
      const item = {
        label: 'Code Editor',
        icon: '/icons/notepad.svg',
        contentType: 'editor',
        size: { width: 900, height: 600 },
      };
      const config = getLaunchConfig(item);
      expect(config.type).toBe('app');
      expect(config.contentType).toBe('editor');
      expect(config.title).toBe('Code Editor');
    });

    it('should return iframe config for items with URL', () => {
      const item = {
        label: 'My Website',
        icon: '/icons/website.svg',
        url: 'https://example.com',
        size: { width: 800, height: 600 },
      };
      const config = getLaunchConfig(item);
      expect(config.type).toBe('iframe');
      expect(config.url).toBe('https://example.com');
    });

    it('should return action config for items with action', () => {
      const item = {
        label: 'Shut Down',
        icon: '/icons/shutdown.svg',
        action: 'shutdown',
      };
      const config = getLaunchConfig(item);
      expect(config.type).toBe('action');
      expect(config.action).toBe('shutdown');
    });

    it('should return none for items without launchable content', () => {
      const item = { label: 'Empty Item' };
      expect(getLaunchConfig(item).type).toBe('none');
    });
  });

  describe('createWindowState', () => {
    it('should create window state for iframe content', () => {
      const config = {
        type: 'iframe',
        title: 'Test Page',
        icon: '/icons/page.svg',
        url: 'https://example.com',
        size: { width: 800, height: 600 },
      };
      const state = createWindowState('window-1', config, 30);
      
      expect(state.id).toBe('window-1');
      expect(state.title).toBe('Test Page');
      expect(state.contentType).toBe('iframe');
      expect(state.url).toBe('https://example.com');
      expect(state.x).toBe(80); // 50 + 30
      expect(state.width).toBe(800);
    });

    it('should create window state for folder content', () => {
      const config = {
        type: 'folder',
        title: 'My Folder',
        icon: '/icons/folder.svg',
        contents: ['item1', 'item2'],
      };
      const state = createWindowState('window-2', config);
      
      expect(state.contentType).toBe('folder');
      expect(state.folderContents).toEqual(['item1', 'item2']);
    });

    it('should create window state for app content', () => {
      const config = {
        type: 'app',
        contentType: 'editor',
        title: 'Code Editor',
        icon: '/icons/notepad.svg',
        size: { width: 900, height: 600 },
      };
      const state = createWindowState('window-3', config);
      
      expect(state.contentType).toBe('editor');
      expect(state.width).toBe(900);
      expect(state.height).toBe(600);
    });

    it('should use default values for missing properties', () => {
      const config = { type: 'iframe' };
      const state = createWindowState('window-4', config);
      
      expect(state.title).toBe('Untitled');
      expect(state.icon).toBe('/icons/document.svg');
      expect(state.isMinimized).toBe(false);
      expect(state.isMaximized).toBe(false);
    });
  });

  describe('canOpenInWindow', () => {
    it('should return true for folders', () => {
      expect(canOpenInWindow({ type: 'folder', contents: [] })).toBe(true);
    });

    it('should return true for apps', () => {
      expect(canOpenInWindow({ contentType: 'editor' })).toBe(true);
    });

    it('should return true for pages with URL', () => {
      expect(canOpenInWindow({ url: 'https://example.com' })).toBe(true);
    });

    it('should return false for external links', () => {
      expect(canOpenInWindow({ url: 'https://example.com', forceExternal: true })).toBe(false);
    });

    it('should return false for actions', () => {
      expect(canOpenInWindow({ action: 'shutdown' })).toBe(false);
    });
  });

  describe('shouldOpenExternal', () => {
    it('should return true for forceExternal items', () => {
      expect(shouldOpenExternal({ url: 'https://example.com', forceExternal: true })).toBe(true);
    });

    it('should return false for regular items', () => {
      expect(shouldOpenExternal({ url: 'https://example.com' })).toBe(false);
    });
  });

  describe('isAction', () => {
    it('should return true for action items', () => {
      expect(isAction({ action: 'shutdown' })).toBe(true);
    });

    it('should return false for non-action items', () => {
      expect(isAction({ url: 'https://example.com' })).toBe(false);
    });
  });
});

