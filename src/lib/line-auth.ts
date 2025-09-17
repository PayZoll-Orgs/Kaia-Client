// LINE Authentication Library - Clean Implementation
// Supports both LINE Login v2.1 and LIFF

import { liff } from '@line/liff';

// Configuration
export const LINE_AUTH_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_LINE_CLIENT_ID || '',
  redirectUri: process.env.NEXT_PUBLIC_LINE_REDIRECT_URI || '',
  liffId: process.env.NEXT_PUBLIC_LIFF_ID || '',
  scope: 'profile openid',
  
  // LINE Login v2.1 API endpoints
  authUrl: 'https://access.line.me/oauth2/v2.1/authorize',
  tokenUrl: 'https://api.line.me/oauth2/v2.1/token',
  profileUrl: 'https://api.line.me/v2/profile',
  friendsUrl: 'https://api.line.me/friendship/v1/friends',
} as const;

// User interface
export interface LineUser {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

// Friend interface
export interface LineFriend {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

// Auth state interface
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: LineUser | null;
  friends: LineFriend[];
  error: string | null;
  isInLineApp: boolean;
}

// PKCE utilities - Generate URL-safe random string
function generateRandomString(length: number): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset[array[i] % charset.length];
  }
  
  return result;
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const challenge = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  return challenge;
}

// LIFF utilities
export class LIFFAuth {
  private static initialized = false;

  static async initialize(): Promise<boolean> {
    if (this.initialized) return true;
    
    try {
      await liff.init({ liffId: LINE_AUTH_CONFIG.liffId });
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('LIFF initialization failed:', error);
      return false;
    }
  }

  static isInLineApp(): boolean {
    try {
      return liff.isInClient();
    } catch {
      return false;
    }
  }

  static isLoggedIn(): boolean {
    try {
      return liff.isLoggedIn();
    } catch {
      return false;
    }
  }

  static async login(): Promise<void> {
    try {
      if (!liff.isLoggedIn()) {
        liff.login();
      }
    } catch (error) {
      throw error;
    }
  }

  static async getProfile(): Promise<LineUser> {
    try {
      const profile = await liff.getProfile();
      return {
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getFriends(): Promise<LineFriend[]> {
    try {
      // Note: LIFF doesn't provide direct friends API access
      // This would need to be implemented through your backend
      // For now, return empty array
      return [];
    } catch (error) {
      throw error;
    }
  }

  static logout(): void {
    try {
      liff.logout();
    } catch {
      // Silent fail for logout
    }
  }

  static async scanQRCode(): Promise<string | null> {
    try {
      // Ensure LIFF is initialized first
      if (!this.initialized) {
        console.log('⚠️ LIFF not initialized, attempting initialization...');
        const initSuccess = await this.initialize();
        if (!initSuccess) {
          throw new Error('Failed to initialize LIFF');
        }
      }
      
      console.log('🔍 LIFFAuth.scanQRCode() - Pre-scan checks:', {
        initialized: this.initialized,
        isInClient: this.isInLineApp(),
        isLoggedIn: this.isLoggedIn(),
        liffAvailable: typeof liff !== 'undefined',
        scanCodeV2Available: typeof liff?.scanCodeV2 === 'function'
      });
      
      if (!this.isInLineApp()) {
        throw new Error('QR code scanning is only available in LINE app');
      }
      
      if (typeof liff?.scanCodeV2 !== 'function') {
        throw new Error('LIFF scanCodeV2 not available - LIFF may not be properly initialized');
      }
      
      console.log('🚀 Calling liff.scanCodeV2()...');
      const result = await liff.scanCodeV2();
      console.log('📱 liff.scanCodeV2() result:', result);
      
      return result?.value || null;
    } catch (error: unknown) {
      console.error('❌ LIFF QR scan error:', error);
      
      // Handle user cancellation gracefully
      const err = error as { code?: string };
      if (err.code === 'CANCEL') {
        console.log('ℹ️ User cancelled QR scan');
        return null;
      }
      
      throw error;
    }
  }

  static canScanQRCode(): boolean {
    try {
      return liff.isInClient();
    } catch {
      return false;
    }
  }
}

// OAuth utilities
export class OAuthAuth {
  static async generateLoginUrl(): Promise<string> {
    const state = generateRandomString(32);
    const nonce = generateRandomString(32);
    const codeVerifier = generateRandomString(128); // PKCE spec: 43-128 characters
    
    // Store in sessionStorage
    sessionStorage.setItem('line_auth_state', state);
    sessionStorage.setItem('line_auth_nonce', nonce);
    sessionStorage.setItem('line_code_verifier', codeVerifier);
    
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: LINE_AUTH_CONFIG.clientId,
      redirect_uri: LINE_AUTH_CONFIG.redirectUri,
      state,
      scope: LINE_AUTH_CONFIG.scope,
      nonce,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    return `${LINE_AUTH_CONFIG.authUrl}?${params.toString()}`;
  }

  static async exchangeCodeForToken(code: string): Promise<{
    access_token: string;
    id_token?: string;
    refresh_token?: string;
  }> {
    const codeVerifier = sessionStorage.getItem('line_code_verifier');
    
    if (!codeVerifier) {
      throw new Error('Code verifier not found. Please restart the login process.');
    }

    const requestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: LINE_AUTH_CONFIG.redirectUri,
      client_id: LINE_AUTH_CONFIG.clientId,
      code_verifier: codeVerifier,
    });

    try {
      const response = await fetch(LINE_AUTH_CONFIG.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestBody,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData: { error?: string; error_description?: string } = {};
        try {
          errorData = JSON.parse(errorText);
        } catch {
          // Failed to parse error response
        }
        
        throw new Error(`Token exchange failed: ${response.status} - ${errorData.error_description || errorData.error || errorText}`);
      }

      const tokenData = await response.json();
      
      // Clean up session storage
      sessionStorage.removeItem('line_code_verifier');
      sessionStorage.removeItem('line_auth_nonce');
      
      return tokenData;
    } catch (error) {
      throw error;
    }
  }

  static async getProfile(accessToken: string): Promise<LineUser> {
    try {
      const response = await fetch(LINE_AUTH_CONFIG.profileUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Profile fetch failed: ${response.status}`);
      }

      const profile = await response.json();
      return {
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getFriends(accessToken: string): Promise<LineFriend[]> {
    try {
      const response = await fetch(LINE_AUTH_CONFIG.friendsUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("This is the response", response);
      if (!response.ok) {
        // Friends API might not be available or user hasn't granted permission
        // Return empty array instead of throwing error
        return [];
      }

      const friendsData = await response.json();
      
      // Transform the response to our LineFriend interface
      return friendsData.friends?.map((friend: LineFriend) => ({
        userId: friend.userId,
        displayName: friend.displayName,
        pictureUrl: friend.pictureUrl,
        statusMessage: friend.statusMessage,
      })) || [];
    } catch {
      // Return empty array on error instead of throwing
      return [];
    }
  }
}

// Storage utilities
export class AuthStorage {
  private static readonly USER_KEY = 'line_user';
  private static readonly FRIENDS_KEY = 'line_friends';
  private static readonly ACCESS_TOKEN_KEY = 'line_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'line_refresh_token';

  static saveUser(user: LineUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getUser(): LineUser | null {
    try {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  static saveFriends(friends: LineFriend[]): void {
    localStorage.setItem(this.FRIENDS_KEY, JSON.stringify(friends));
  }

  static getFriends(): LineFriend[] {
    try {
      const friendsData = localStorage.getItem(this.FRIENDS_KEY);
      return friendsData ? JSON.parse(friendsData) : [];
    } catch {
      return [];
    }
  }

  static saveTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static clear(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.FRIENDS_KEY);
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}

// Main authentication class
export class LineAuth {
  private static instance: LineAuth;
  private authState: AuthState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    friends: [],
    error: null,
    isInLineApp: false,
  };
  private listeners: ((state: AuthState) => void)[] = [];

  private constructor() {}

  static getInstance(): LineAuth {
    if (!this.instance) {
      this.instance = new LineAuth();
    }
    return this.instance;
  }

  // Subscribe to auth state changes
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.authState));
  }

  private updateState(updates: Partial<AuthState>): void {
    this.authState = { ...this.authState, ...updates };
    this.notifyListeners();
  }

  getState(): AuthState {
    return { ...this.authState };
  }

  async initialize(): Promise<void> {
    this.updateState({ isLoading: true, error: null });

    try {
      // Initialize LIFF
      const liffInitialized = await LIFFAuth.initialize();
      const isInLineApp = LIFFAuth.isInLineApp();
      
      this.updateState({ isInLineApp });

      // Check if user is authenticated
      let user: LineUser | null = null;
      let friends: LineFriend[] = [];
      
      if (liffInitialized && isInLineApp && LIFFAuth.isLoggedIn()) {
        // Use LIFF authentication
        user = await LIFFAuth.getProfile();
        friends = await LIFFAuth.getFriends();
        AuthStorage.saveUser(user);
        AuthStorage.saveFriends(friends);
      } else {
        // Check stored user data
        user = AuthStorage.getUser();
        friends = AuthStorage.getFriends();
      }

      this.updateState({
        isAuthenticated: !!user,
        user,
        friends,
        isLoading: false,
      });
    } catch (error) {
      this.updateState({
        isAuthenticated: false,
        user: null,
        friends: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      });
    }
  }

  async login(): Promise<void> {
    this.updateState({ isLoading: true, error: null });

    try {
      if (this.authState.isInLineApp) {
        // Use LIFF login
        await LIFFAuth.login();
        const user = await LIFFAuth.getProfile();
        const friends = await LIFFAuth.getFriends();
        AuthStorage.saveUser(user);
        AuthStorage.saveFriends(friends);
        
        this.updateState({
          isAuthenticated: true,
          user,
          friends,
          isLoading: false,
        });
      } else {
        // Use OAuth login
        const loginUrl = await OAuthAuth.generateLoginUrl();
        window.location.href = loginUrl;
      }
    } catch (error) {
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      });
    }
  }

  async handleOAuthCallback(code: string, state: string): Promise<void> {
    this.updateState({ isLoading: true, error: null });

    try {
      // Verify state
      const storedState = sessionStorage.getItem('line_auth_state');
      
      if (state !== storedState) {
        throw new Error('Invalid state parameter - possible CSRF attack');
      }

      // Exchange code for token
      const tokens = await OAuthAuth.exchangeCodeForToken(code);
      
      // Get user profile and friends
      const user = await OAuthAuth.getProfile(tokens.access_token);
      const friends = await OAuthAuth.getFriends(tokens.access_token);
      
      // Save data
      AuthStorage.saveUser(user);
      AuthStorage.saveFriends(friends);
      AuthStorage.saveTokens(tokens.access_token, tokens.refresh_token);
      
      // Clean up session storage
      sessionStorage.removeItem('line_auth_state');

      this.updateState({
        isAuthenticated: true,
        user,
        friends,
        isLoading: false,
      });
    } catch (error) {
      this.updateState({
        isAuthenticated: false,
        user: null,
        friends: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      });
    }
  }

  logout(): void {
    // Clear storage
    AuthStorage.clear();
    
    // LIFF logout if in LINE app
    if (this.authState.isInLineApp) {
      LIFFAuth.logout();
    }

    // Update state
    this.updateState({
      isAuthenticated: false,
      user: null,
      friends: [],
      error: null,
    });
  }
}
