/**
 * Authentication state değişikliklerini yönetmek için event system
 */

type AuthStateChangeListener = (isAuthenticated: boolean) => void;

class AuthEventManager {
  private listeners: AuthStateChangeListener[] = [];

  // Listener ekle
  subscribe(listener: AuthStateChangeListener) {
    this.listeners.push(listener);

    // Cleanup function döndür
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Event emit et
  notifyAuthStateChange(isAuthenticated: boolean) {
    this.listeners.forEach((listener) => {
      try {
        listener(isAuthenticated);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {}
    });
  }

  // Login sonrası çağır
  notifyLogin() {
    this.notifyAuthStateChange(true);
  }

  // Logout sonrası çağır
  notifyLogout() {
    this.notifyAuthStateChange(false);
  }
}

// Singleton instance
export const authEventManager = new AuthEventManager();

// Helper functions
export const notifyLogin = () => authEventManager.notifyLogin();
export const notifyLogout = () => authEventManager.notifyLogout();
export const subscribeToAuthChanges = (listener: AuthStateChangeListener) =>
  authEventManager.subscribe(listener);
