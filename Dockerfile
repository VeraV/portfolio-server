ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app

################################################################################
# Install all dependencies and build
FROM base as build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build
# Copy JavaScript files that TypeScript doesn't compile
RUN cp -r src/config dist/ && cp -r src/error-handling dist/

################################################################################
# Production stage
FROM base as final

ENV NODE_ENV production

USER node

COPY package.json package-lock.json ./
# Install only production dependencies
RUN npm ci --omit=dev

# Copy built app and Prisma files from build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
# Copy generated Prisma Client
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /usr/src/app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 5005

CMD npm start
