FROM node:16-alpine AS base

# Step 1. Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
# Omit --production flag for TypeScript devDependencies
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  # Allow install without lockfile, so example works even without Node.js installed locally
  else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
  fi

COPY src ./src
COPY public ./public
COPY next.config.js .
COPY tsconfig.json .

# Environment variables must be present at build time
# https://github.com/vercel/next.js/discussions/14030
ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ARG GOOGLE_ID
ENV GOOGLE_ID=${GOOGLE_ID}
ARG GOOGLE_SECRET
ENV GOOGLE_SECRET=${GOOGLE_SECRET}
ARG FACEBOOK_ID
ENV FACEBOOK_ID=${FACEBOOK_ID}
ARG FACEBOOK_SECRET
ENV FACEBOOK_SECRET=${FACEBOOK_SECRET}
ARG GITHUB_ID
ENV GITHUB_ID=${GITHUB_ID}
ARG GITHUB_SECRET
ENV GITHUB_SECRET=${GITHUB_SECRET}
ARG NEXT_PUBLIC_S3_CREDENTIAL_SECRET_ACCESS_KEY
ENV NEXT_PUBLIC_S3_CREDENTIAL_SECRET_ACCESS_KEY=${NEXT_PUBLIC_S3_CREDENTIAL_SECRET_ACCESS_KEY}
ARG NEXT_PUBLIC_S3_CREDENTIAL_ACCESS_KEY_ID
ENV NEXT_PUBLIC_S3_CREDENTIAL_ACCESS_KEY_ID=${NEXT_PUBLIC_S3_CREDENTIAL_ACCESS_KEY_ID}
ARG NEXT_PUBLIC_S3_BUCKET_NAME
ENV NEXT_PUBLIC_S3_BUCKET_NAME=${NEXT_PUBLIC_S3_BUCKET_NAME}
ARG NEXT_PUBLIC_S3_IMAGE_URL
ENV NEXT_PUBLIC_S3_IMAGE_URL=${NEXT_PUBLIC_S3_IMAGE_URL}

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at build time
# ENV NEXT_TELEMETRY_DISABLED 1

# Build Next.js based on the preferred package manager
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then pnpm build; \
  else yarn build; \
  fi

# Note: It is not necessary to add an intermediate step that does a full copy of `node_modules` here

# Step 2. Production image, copy all the files and run next
FROM base AS runner

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Environment variables must be redefined at run time
ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ARG GOOGLE_ID
ENV GOOGLE_ID=${GOOGLE_ID}
ARG GOOGLE_SECRET
ENV GOOGLE_SECRET=${GOOGLE_SECRET}
ARG FACEBOOK_ID
ENV FACEBOOK_ID=${FACEBOOK_ID}
ARG FACEBOOK_SECRET
ENV FACEBOOK_SECRET=${FACEBOOK_SECRET}
ARG GITHUB_ID
ENV GITHUB_ID=${GITHUB_ID}
ARG GITHUB_SECRET
ENV GITHUB_SECRET=${GITHUB_SECRET}
ARG NEXT_PUBLIC_S3_CREDENTIAL_SECRET_ACCESS_KEY
ENV NEXT_PUBLIC_S3_CREDENTIAL_SECRET_ACCESS_KEY=${NEXT_PUBLIC_S3_CREDENTIAL_SECRET_ACCESS_KEY}
ARG NEXT_PUBLIC_S3_CREDENTIAL_ACCESS_KEY_ID
ENV NEXT_PUBLIC_S3_CREDENTIAL_ACCESS_KEY_ID=${NEXT_PUBLIC_S3_CREDENTIAL_ACCESS_KEY_ID}
ARG NEXT_PUBLIC_S3_BUCKET_NAME
ENV NEXT_PUBLIC_S3_BUCKET_NAME=${NEXT_PUBLIC_S3_BUCKET_NAME}
ARG NEXT_PUBLIC_S3_IMAGE_URL
ENV NEXT_PUBLIC_S3_IMAGE_URL=${NEXT_PUBLIC_S3_IMAGE_URL}

# Uncomment the following line to disable telemetry at run time
# ENV NEXT_TELEMETRY_DISABLED 1

# Note: Don't expose ports here, Compose will handle that for us

CMD ["node", "server.js"]