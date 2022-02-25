FROM node:latest
EXPOSE 8080
COPY . .
RUN npm install
RUN npm install -g typescript
RUN tsc
CMD node server.js