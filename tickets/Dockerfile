FROM node:alpine

WORKDIR /app

COPY package.json .
# omit dev to avoid adding the testing libraries (mongodb-memory-server is quite heavy)
RUN npm install --omit=dev
COPY . .

CMD ["npm", "start"]
