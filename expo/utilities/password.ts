export interface PasswordRule {
  key: "length" | "upper" | "lower";
  label: string;
  met: boolean;
}

/**
 * Password requirements: at least 6 characters, with one uppercase and one
 * lowercase letter. Returns each rule so the UI can show live feedback.
 */
export function checkPassword(password: string): PasswordRule[] {
  return [
    { key: "length", label: "At least 6 characters", met: password.length >= 6 },
    { key: "upper", label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { key: "lower", label: "One lowercase letter", met: /[a-z]/.test(password) },
  ];
}

export function isPasswordValid(password: string): boolean {
  return checkPassword(password).every((r) => r.met);
}
