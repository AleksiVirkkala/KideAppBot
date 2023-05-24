export const runtime = 'edge';

import { ImageResponse } from 'next/server';
import { getSearchParams } from '@common/utils';
import { ZodError, z } from 'zod';
import { BotLogo } from 'ui';
import { appName } from '@/utils/appInfo';

const imageParamsSchema = z.object({
  version: z.coerce.string(),
  width: z.coerce.number().int().min(1).max(6000),
  height: z.coerce.number().int().min(1).max(6000)
});

const getParams = (request: Request) => {
  const params = getSearchParams(request.url);
  return {
    height: 2532,
    width: 1170,
    ...imageParamsSchema.partial().parse(params)
  };
};

export function GET(request: Request) {
  try {
    const { version, width, height } = getParams(request);
    console.log('generating SplashScreen:', { version, width, height });

    return new ImageResponse(
      (
        <div tw="bg-gray-100 h-full w-full flex flex-col items-center justify-center pb-12">
          <div tw="flex pl-6">
            <BotLogo fill="#6366f1" width="180" preserveAspectRatio="xMidYMid meet" />
          </div>
          <div tw="pt-10 text-zinc-700/50 text-6xl">{appName}</div>
        </div>
      ),
      {
        width,
        height
      }
    );
  } catch (e) {
    console.log(e);

    if (e instanceof ZodError) {
      return new Response(`Failed to generate the image: ${e.message}`, {
        status: 400
      });
    }
    return new Response(`Failed to generate the image`, {
      status: 500
    });
  }
}
