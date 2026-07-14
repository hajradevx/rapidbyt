// shared/types/auth.d.ts
declare module "#auth-utils" {
  interface User {
    id?: string;
    username?: string;
    name?: string;
    email?: string;
    avatar?: string;
    role?: string;
  }

  interface UserSession {
    user: User;
    loggedInAt: Date;
  }
}

export {};
