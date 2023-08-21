import { PUBLIC_HIGHLIGHT_PROJECT_ID } from '$env/static/public';
import { appVersion } from '$lib/utils/appInfo';
import { H } from 'highlight.run';

H.init(PUBLIC_HIGHLIGHT_PROJECT_ID, {
	environment: 'production',
	version: appVersion,
	tracingOrigins: true,
	networkRecording: {
		enabled: true,
		recordHeadersAndBody: true
	}
});
