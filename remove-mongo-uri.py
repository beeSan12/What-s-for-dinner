import re

def file_filter(blob, metadata):
    if metadata.path.decode() == b'docker-compose.yml':
        content = blob.data.decode('utf-8').splitlines()
        cleaned = [line for line in content if 'DB_CONNECTION_STRING=' not in line]
        blob.data = '\n'.join(cleaned).encode('utf-8')