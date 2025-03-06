// Global types for modern web APIs

// View Transitions API
interface Document {
	startViewTransition?: (updateCallback: () => Promise<void> | void) => {
		ready: Promise<void>;
		finished: Promise<void>;
		updateCallbackDone: Promise<void>;
		skipTransition: () => void;
	};
}

// CSS Container Queries
interface CSSContainerRule extends CSSRule {
	readonly containerName: string;
	readonly containerQuery: string;
}

// Resize Observer
interface ResizeObserverEntry {
	readonly contentBoxSize: ReadonlyArray<ResizeObserverSize>;
	readonly borderBoxSize: ReadonlyArray<ResizeObserverSize>;
	readonly devicePixelContentBoxSize?: ReadonlyArray<ResizeObserverSize>;
}

// Web Share API
interface Navigator {
	share?: (data: ShareData) => Promise<void>;
	canShare?: (data: ShareData) => boolean;
}

interface ShareData {
	url?: string;
	text?: string;
	title?: string;
	files?: File[];
}

// Periodic Background Sync
interface ServiceWorkerRegistration {
	periodicSync?: {
		register: (tag: string, options?: { minInterval: number }) => Promise<void>;
		unregister: (tag: string) => Promise<void>;
		getTags: () => Promise<string[]>;
	};
}

// Web App Manifest types
interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[];
	prompt: () => Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Media Session API
interface Navigator {
	mediaSession?: MediaSession;
}

interface MediaSession {
	metadata: MediaMetadata | null;
	playbackState: 'none' | 'paused' | 'playing';
	setActionHandler: (
		action: MediaSessionAction,
		handler: MediaSessionActionHandler | null,
	) => void;
}

type MediaSessionAction =
	| 'play'
	| 'pause'
	| 'seekbackward'
	| 'seekforward'
	| 'previoustrack'
	| 'nexttrack'
	| 'stop'
	| 'seekto';
type MediaSessionActionHandler = (details: any) => void;

// Clipboard API extended types
interface Navigator {
	clipboard: {
		read(): Promise<ClipboardItems>;
		write(data: ClipboardItems): Promise<void>;
		readText(): Promise<string>;
		writeText(text: string): Promise<void>;
	};
}

type ClipboardItems = ClipboardItem[];

interface ClipboardItem {
	readonly types: string[];
	getType(type: string): Promise<Blob>;
}
