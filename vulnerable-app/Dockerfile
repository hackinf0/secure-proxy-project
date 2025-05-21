FROM debian:bullseye

# Install Apache + PHP + SQLite
RUN apt-get update && apt-get install -y \
    apache2 \
    php \
    php-cli \
    php-sqlite3 \
    libapache2-mod-php \
    && apt-get clean

# Copy your vulnerable app code
COPY app/ /var/www/html/

# Expose Apache default port
EXPOSE 80

# Start Apache in foreground
CMD ["apachectl", "-D", "FOREGROUND"]
