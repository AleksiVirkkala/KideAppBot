export const runtime = 'edge';

import { ImageResponse } from 'next/server';
import { getSearchParams } from '@common/utils';
import { BotLogo } from 'ui';
import { appName } from '@/utils/appInfo';
import { type } from 'arktype';

const boundedSize = type('1 <= integer <= 6000');

const imageParams = type({
  'version?': 'string',
  'width?': ['parsedInteger', '|>', boundedSize],
  'height?': ['parsedInteger', '|>', boundedSize]
});

const getParams = (request: Request) => {
  const params = getSearchParams(request.url);
  return {
    height: 2532,
    width: 1170,
    ...imageParams.assert(params)
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

    if (e instanceof TypeError) {
      return new Response(`${e.message}`, {
        status: 400
      });
    }
    return new Response(`Failed to generate the image`, {
      status: 500
    });
  }
}
