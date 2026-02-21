export type HAConnectionStatus =
    | 'disconnected'
    | 'connecting'
    | 'authenticating'
    | 'connected'      
    | 'auth_failed'
    | 'authenticated';

export interface HAAuthRequired {
    type: 'auth_required';
    ha_version: string;
}

export interface HAAuthMessage {
    type: 'auth';
    access_token: string;
}

export interface HAAuthOk {
    type: 'auth_ok';
    ha_version: string;
}


export interface HAAuthInvalid {
    type: 'auth_invalid';
    message: string;
}

export interface HAErrorDetails {
  code: string;
  message: string;
  translation_key?: string;
  translation_domain?: string;
  translation_placeholders?: Record<string, string | number>;
}

export interface HAErrorMessage {
  id: number;
  type: "result";
  success: false;
  error: HAErrorDetails;
}


export type HAWebSocketMessage =
  | HAAuthRequired
  | HAAuthOk
  | HAAuthInvalid
