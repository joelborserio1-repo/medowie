import type { Core } from '@strapi/strapi';

const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedExecutableTypes = [
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
  const r2AccountId = env('R2_ACCOUNT_ID');
  const r2Bucket = env('R2_BUCKET');

  // Cloudflare R2 (S3-compatible) when configured; otherwise Strapi's
  // default local-disk provider — fine for local dev, but on Railway the
  // filesystem is ephemeral, so production should set the R2_* env vars.
  // See docs/DEPLOYMENT.md.
  const uploadProviderConfig = r2AccountId && r2Bucket
    ? {
        provider: 'aws-s3',
        providerOptions: {
          // R2_PUBLIC_URL: the bucket's public r2.dev URL or a custom domain
          // mapped to it — without this, uploaded file URLs point at R2's
          // private S3 endpoint and won't load in a browser.
          baseUrl: env('R2_PUBLIC_URL'),
          rootPath: undefined,
          s3Options: {
            endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
            region: 'auto',
            credentials: {
              accessKeyId: env('R2_ACCESS_KEY_ID'),
              secretAccessKey: env('R2_SECRET_ACCESS_KEY'),
            },
            params: { Bucket: r2Bucket },
            forcePathStyle: true,
          },
        },
        actionOptions: { upload: {}, uploadStream: {}, delete: {} },
      }
    : undefined;

  return {
    'users-permissions': {
      config: {
        jwtManagement: 'refresh',
        sessions: {
          httpOnly: true,
        },
      },
    },
    upload: {
      config: {
        ...(uploadProviderConfig ?? {}),
        security: {
          allowedTypes: allowedMediaTypes,
          deniedTypes: deniedExecutableTypes,
        },
      },
    },
  };
};

export default config;
