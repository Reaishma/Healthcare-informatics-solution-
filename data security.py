from cryptography.fernet import Fernet

def generate_key():
    key = Fernet.generate_key()
    return key

def encrypt_message(key, message):
    cipher_suite = Fernet(key)
    cipher_text = cipher_suite.encrypt(message.encode())
    return cipher_text

def decrypt_message(key, cipher_text):
    cipher_suite = Fernet(key)
    plain_text = cipher_suite.decrypt(cipher_text)
    return plain_text.decode()

# Generate a key
key = generate_key()

# Encrypt a message
message = "This is a secret message"
cipher_text = encrypt_message(key, message)

# Decrypt the message
plain_text = decrypt_message(key, cipher_text)

print(f"Key: {key}")
print(f"Encrypted Message: {cipher_text}")
print(f"Decrypted Message: {plain_text}")
