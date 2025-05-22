import { FirebaseError } from 'firebase/app';

export type FirebaseErrorCode = 
  | 'permission-denied'
  | 'not-found'
  | 'already-exists'
  | 'resource-exhausted'
  | 'failed-precondition'
  | 'aborted'
  | 'out-of-range'
  | 'unimplemented'
  | 'internal'
  | 'unavailable'
  | 'data-loss'
  | 'unauthenticated'
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/email-already-in-use'
  | 'auth/weak-password'
  | 'auth/operation-not-allowed'
  | 'auth/account-exists-with-different-credential'
  | 'storage/object-not-found'
  | 'storage/bucket-not-found'
  | 'storage/project-not-found'
  | 'storage/quota-exceeded'
  | 'storage/unauthenticated'
  | 'storage/unauthorized'
  | 'storage/retry-limit-exceeded'
  | 'storage/invalid-checksum'
  | 'storage/canceled'
  | 'storage/invalid-event-name'
  | 'storage/invalid-url'
  | 'storage/invalid-argument'
  | 'storage/no-default-bucket'
  | 'storage/cannot-slice-blob'
  | 'storage/server-file-wrong-size';

export class FirebaseErrorHandler {
  static getErrorMessage(error: FirebaseError): string {
    switch (error.code as FirebaseErrorCode) {
      // Authentication Errors
      case 'auth/invalid-email':
        return 'The email address is not valid.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/operation-not-allowed':
        return 'This operation is not allowed.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email address but different sign-in credentials.';

      // Firestore Errors
      case 'permission-denied':
        return 'You don\'t have permission to perform this action.';
      case 'not-found':
        return 'The requested document was not found.';
      case 'already-exists':
        return 'A document with this ID already exists.';
      case 'resource-exhausted':
        return 'You have exceeded your quota.';
      case 'failed-precondition':
        return 'The operation was rejected because the system is not in a state required for the operation\'s execution.';
      case 'aborted':
        return 'The operation was aborted.';
      case 'out-of-range':
        return 'The operation was attempted past the valid range.';
      case 'unimplemented':
        return 'The operation is not implemented or not supported/enabled.';
      case 'internal':
        return 'Internal errors.';
      case 'unavailable':
        return 'The service is currently unavailable.';
      case 'data-loss':
        return 'Unrecoverable data loss or corruption.';
      case 'unauthenticated':
        return 'The request does not have valid authentication credentials.';

      // Storage Errors
      case 'storage/object-not-found':
        return 'No object exists at the desired reference.';
      case 'storage/bucket-not-found':
        return 'No bucket is configured for Firebase Storage.';
      case 'storage/project-not-found':
        return 'No project is configured for Firebase Storage.';
      case 'storage/quota-exceeded':
        return 'Quota on your Firebase Storage bucket has been exceeded.';
      case 'storage/unauthorized':
        return 'User is not authorized to perform the desired action.';
      case 'storage/retry-limit-exceeded':
        return 'The maximum time limit on an operation has been exceeded.';
      case 'storage/invalid-checksum':
        return 'File on the client does not match the checksum of the file received by the server.';
      case 'storage/canceled':
        return 'User canceled the operation.';
      case 'storage/invalid-event-name':
        return 'Invalid event name provided.';
      case 'storage/invalid-url':
        return 'Invalid URL provided to refFromURL().';
      case 'storage/invalid-argument':
        return 'The argument passed to put() must be File, Blob, or UInt8 Array.';
      case 'storage/no-default-bucket':
        return 'No bucket has been set in your config.';
      case 'storage/cannot-slice-blob':
        return 'Commonly occurs when the local file has changed (deleted, saved again, etc.).';
      case 'storage/server-file-wrong-size':
        return 'File on the client does not match the size of the file received by the server.';

      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  static isAuthError(error: FirebaseError): boolean {
    return error.code.startsWith('auth/');
  }

  static isStorageError(error: FirebaseError): boolean {
    return error.code.startsWith('storage/');
  }

  static isFirestoreError(error: FirebaseError): boolean {
    return !this.isAuthError(error) && !this.isStorageError(error);
  }

  static handleError(error: unknown): string {
    if (error instanceof FirebaseError) {
      return this.getErrorMessage(error);
    }
    return 'An unexpected error occurred. Please try again.';
  }
} 