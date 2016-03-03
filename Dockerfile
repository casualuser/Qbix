FROM php:5.6-apache

COPY config/php.ini /usr/local/etc/php/conf.d/

RUN echo mysql-server mysql-server/root_password select root | debconf-set-selections && \
	echo mysql-server mysql-server/root_password_again select root | debconf-set-selections && \
	apt-get update && apt-get install -y \
		git \ 
		nodejs \ 
		npm \ 
		vim \ 
		mysql-server \
		libfreetype6-dev \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libpng12-dev \
    && docker-php-ext-install -j$(nproc) iconv mcrypt \
    && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-install -j$(nproc) mysql \
    && docker-php-ext-install -j$(nproc) mysqli \
    && docker-php-ext-install -j$(nproc) pdo \
    && docker-php-ext-install -j$(nproc) pdo_mysql \
    && docker-php-ext-install -j$(nproc) json \
    && docker-php-ext-install -j$(nproc) curl

RUN git clone https://github.com/EGreg/Platform.git /projects/qbix/Q
RUN ln -s /projects/qbix/Q/MyApp/web/ /var/www/html/

RUN php -r "readfile('https://getcomposer.org/installer');" > composer-setup.php
RUN php composer-setup.php
RUN php -r "unlink('composer-setup.php');"

RUN php /projects/qbix/Q/MyApp/scripts/Q/configure.php MyApp

RUN npm install /projects/qbix/Q

CMD ["apache2-foreground"]

EXPOSE 80
