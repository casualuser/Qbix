FROM php:5.6-apache

RUN docker-php-ext-install mysqli

RUN apt-get update && apt-get -y install git nodejs npm

RUN git clone https://github.com/EGreg/Platform.git /projects/qbix/Q
RUN ln -s /projects/qbix/Q/MyApp/web /var/www/html

RUN php -r "readfile('https://getcomposer.org/installer');" > composer-setup.php
RUN php composer-setup.php
RUN php -r "unlink('composer-setup.php');"

RUN npm install /projects/qbix/Q

CMD ["apache2-foreground"]
