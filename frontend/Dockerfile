FROM node:20-alpine
WORKDIR /app
COPY package.json postcss.config.js tailwind.config.ts next.config.ts tsconfig.json next-env.d.ts ./
RUN npm install
COPY . ./
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
