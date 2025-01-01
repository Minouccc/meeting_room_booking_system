# 使用 Node.js 21 作为基础镜像
FROM node:21-alpine AS build-stage

WORKDIR /app

# 安装指定版本的 pnpm
RUN npm install -g pnpm@9.1.1

COPY pnpm-lock.yaml package.json ./

# 设置 pnpm 源
RUN pnpm config set registry https://registry.npmmirror.com/
RUN pnpm install

COPY . .

RUN pnpm build

# production stage
FROM node:21-alpine AS production-stage

# 安装指定版本的 pnpm
RUN npm install -g pnpm@9.1.1

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/pnpm-lock.yaml /app/

WORKDIR /app

RUN pnpm config set registry https://registry.npmmirror.com/
RUN pnpm install --prod

EXPOSE 3000

CMD ["node", "/app/main.js"]