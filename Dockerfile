FROM node:8
WORKDIR /home/ldso
COPY . .

EXPOSE 3000
ENTRYPOINT /home/ldso/entrypoint.sh
