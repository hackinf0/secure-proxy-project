FROM python:3.11-slim

WORKDIR /app
COPY scripts/ /app/scripts/
WORKDIR /app/scripts

# Install dependencies
RUN apt-get update && \
    apt-get install -y git curl nano && \
    git clone --depth 1 https://github.com/sqlmapproject/sqlmap.git /opt/sqlmap && \
    ln -s /opt/sqlmap/sqlmap.py /usr/local/bin/sqlmap && \
    chmod +x /usr/local/bin/sqlmap && \
    git clone https://github.com/s0md3v/XSStrike.git /opt/xsstrike && \
    pip install -r /opt/xsstrike/requirements.txt && \
    ln -s /opt/xsstrike/xsstrike.py /usr/local/bin/xsstrike && \
    chmod +x /usr/local/bin/xsstrike && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

CMD ["sh"]
