export const runtime = 'edge';

import { ImageResponse } from 'next/server';
import { getSearchParams } from '@common/utils';
import { BotLogo } from 'ui';
import { type } from 'arktype';

const paramsType = type({
  'size?': ['parsedNumber', '|>', type('1 <= integer <= 512')],
  'version?': 'string'
});

const getParams = (request: Request) => {
  const params = getSearchParams(request.url);
  return {
    size: 512,
    ...paramsType.assert(params)
  };
};

export function GET(request: Request) {
  try {
    const { version, size } = getParams(request);
    console.log('generating AppIcon:', { version, size });

    return new ImageResponse(
      (
        <div tw="flex h-full w-full items-center justify-center flex-col bg-gray-50">
          <div
            tw="flex"
            style={{
              paddingLeft: 34 * (size / 512),
              paddingBottom: 28 * (size / 512)
            }}
          >
            <BotLogo fill="#6366f1" width={size * 0.45} preserveAspectRatio="xMidYMid meet" />
          </div>
        </div>
      ),
      {
        width: size,
        height: size
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
