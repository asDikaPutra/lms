/**
 * Validates a certificate verification code.
 * Returns { valid: true } if the uppercased input matches /^[A-Z0-9]{12}$/,
 * otherwise returns { valid: false, message: '...' }.
 *
 * @param {string} input
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateVerifyCode(input) {
    if (!input || input.trim() === '') {
        return { valid: false, message: 'Kode verifikasi tidak boleh kosong.' };
    }

    const uppercased = input.toUpperCase();
    if (/^[A-Z0-9]{12}$/.test(uppercased)) {
        return { valid: true };
    }

    return {
        valid: false,
        message: 'Kode verifikasi harus terdiri dari 12 karakter alfanumerik.',
    };
}
