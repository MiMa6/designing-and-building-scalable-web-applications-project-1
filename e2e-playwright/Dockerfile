FROM mcr.microsoft.com/playwright:v1.42.0-focal

WORKDIR /app

COPY package*.json .
COPY *config.js .

RUN npm install
RUN npx playwright install chromium

COPY . .

CMD [ "npx", "playwright", "test", "--watch"]