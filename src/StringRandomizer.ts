/**
 * Utility class to create random string
 * TODO: Publish this class as an npm module and install it as dependencies
 */
export class StringRandomizer {
  private static readonly ALPHABETIC_LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
  private static readonly ALPHABETIC_UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private static readonly NUMBERS = '0123456789';

  /**
   *
   * @param length the length of random string to create
   * @param letters if true, generated string may include alphabetic characters
   * @param numbers if true, generated string may include numeric characters
   */
  static random(length: number, letters = true, numbers = true): string {
    let chars = '';

    if (letters) {
      chars +=
        StringRandomizer.ALPHABETIC_LOWERCASE +
        StringRandomizer.ALPHABETIC_UPPERCASE;
    }

    if (numbers) {
      chars += StringRandomizer.NUMBERS;
    }

    return Array(length)
      .fill(0)
      .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
      .join('');
  }

  static randomAlphabetic(length: number): string {
    return StringRandomizer.random(length, true, false);
  }

  static randomNumeric(length: number): string {
    return StringRandomizer.random(length, false, true);
  }

  static randomAlphaNumeric(length: number): string {
    return StringRandomizer.random(length, true, true);
  }
}
