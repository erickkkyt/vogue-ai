declare module "google-one-tap" {
  interface OneTapOptions {
    client_id: string;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    context?: 'signin' | 'signup' | 'use';
  }

  interface OneTapResponse {
    credential: string;
  }

  type OneTapCallback = (response: OneTapResponse) => void;

  function googleOneTap(options: OneTapOptions, callback: OneTapCallback): void;

  export = googleOneTap;
}

// 扩展 Window 对象以包含 Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: any) => void;
          prompt: (callback?: any) => void;
          cancel: () => void;
        };
      };
    };
  }
}
